const bcrypt = require('bcrypt');

const prisma = require("../../prisma/context");

const customAuth = require("../../customAuth");

const { makeString } = require("../../utils/helperUtils");

customAuth.useStrategy(async (data, done) => {
    const { email, password } = data;
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: email
                    },
                    {
                        email
                    }
                ]
            },
            select: {
                id: true,
                email: true,
                password: true,
                username: true
            }
        });
        if (!user)
            return done("User does not exist");

        if (await bcrypt.compare(password, user.password)) {
            const authedUser = { id: user.id, username: user.username, email: user.email };
            return done(null, authedUser);
        } else {
            return done("Username or password incorrect");
        }
    } catch (err) {
        return done(err);
    }
});

async function authRouter(router, options, done) {
    router.get("/current-user", (req, res) => {
        try {
            if (req.isAuthenticated()) {
                return {
                    success: true,
                    data: {
                        user: req.user
                    }
                }
            } else {
                return { success: false }
            }
        } catch (err) {
            console.error("Failed getting current user", err);
            return { success: false }
        }
    });

    router.post("/signin", (req, res) => {
        if (req.isAuthenticated()) {
            return {
                success: true,
                message: "Already signed in.",
                lightReroute: "/dashboard"
            }
        }
        try {
            const { email, password } = req.body;

            req.logIn({ email, password }, (loginErr, user) => {
                if (loginErr) {
                    res.send({
                        success: false,
                        message: loginErr
                    });
                } else {
                    res.send({
                        success: true,
                        message: "Signed in successfully",
                        data: {
                            user
                        }
                    });
                }
            });
        } catch (err) {
            console.error("Error signing in:", err)
            return {
                success: false
            }
        }
    });

    router.post("/signup", async (req, res) => {
        if (req.isAuthenticated()) {
            return {
                success: true,
                message: "User signed up.",
                lightReroute: "/dashboard"
            }
        }
        try {
            let { firstName = "", lastName = "", username = "", email1 = "", email2 = "", password1 = "", password2 = "" } = req.body;

            // validate information

            firstName = makeString(firstName);
            lastName = makeString(lastName);
            username = makeString(username).toLowerCase();
            email1 = makeString(email1).toLowerCase();
            email2 = makeString(email2).toLowerCase();
            password1 = makeString(password1);
            password2 = makeString(password2);

            let errorMessage = [];

            if (!firstName) {
                errorMessage.push("First name field required");
            }
            if (!lastName) {
                errorMessage.push("Last name field required");
            }

            if (!username) {
                errorMessage.push("Username field required");
            }
            if (username.length < 4 || username.length > 15) {
                errorMessage.push("Username must be 4-15 characters long");
            } else {
                if (username.charAt(0).match(/^[a-z]+$/ig) === null) {
                    errorMessage.push("Username must start with a letter\n");
                } else if (username.match(/^[a-z][a-z\d]+$/ig) === null) {
                    errorMessage.push("Symbols/Spaces not allowed in username");
                }
            }

            if (!email1 || !email2) {
                errorMessage.push("Email fields required");
            }

            if (!password1 || !password2) {
                errorMessage.push("Password fields required");
            }
            if (password1.length < 8) {
                errorMessage.push("Password must be 8 or more characters\n");
            }
            if (password1.search(/\d/) === -1) {
                errorMessage.push("Password must contain at least one number\n");
            }
            if (password1.search(/[A-Z]/) === -1) {
                errorMessage.push("Password must contain at least one uppercase letter\n");
            }

            if (email1 !== email2) {
                errorMessage.push("Emails do not match");
            }

            if (password1 !== password2) {
                errorMessage.push("Passwords do not match");
            }

            if (errorMessage.length) {
                return {
                    success: false,
                    message: errorMessage.join("\n")
                }
            }

            // check user exists

            const userByUsername = await prisma.user.findFirst({
                where: {
                    username
                }, select: {
                    id: true,
                }
            });

            if (userByUsername) {
                return {
                    success: false,
                    message: "Username already exists."
                }
            }

            const userByEmail = await prisma.user.findFirst({
                where: {
                    email: email1
                }, select: {
                    id: true,
                }
            });

            if (userByEmail) {
                return {
                    success: false,
                    message: "Email already exists."
                }
            }

            // create user

            const hashedPassword = await bcrypt.hash(password1, 10);

            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    email: email1,
                    firstName,
                    lastName
                }
            });

            return {
                success: true,
                detail: "Accout created successfully.",
                lightReroute: "/signin"
            }
        } catch (err) {
            console.error("Error creating user: ", err);
            return {
                success: false
            }
        }
    });

    router.delete("/signout", (req, res) => {
        if (req.isAuthenticated()) {
            req.logOut();
            return {
                success: true,
                message: "Successfully signed out.",
                lightReroute: "/signin"
            }
        } else {
            return {
                success: true,
                message: "Already signed out.",
                lightReroute: "/"
            }
        }
    });

    done();
}

module.exports = authRouter;