const fastify = require("fastify");
const fastifySecureSession = require("@fastify/secure-session");
const cors = require("@fastify/cors");
const dotenv = require("dotenv");
dotenv.config();

const fastifyConfig = {
    ignoreTrailingSlash: true,
    logger: true,
}

const secureSessionConfig = {
    secret: process.env.COOKIE_SECRET,
    cookie: {
        path: "/"
    }
}

if (process.env.NODE_ENV === "production") {
    fastifyConfig.trustProxy = true; // trust first proxy
    secureSessionConfig.cookie.secure = true // serve secure cookies
    secureSessionConfig.cookie.httpOnly = true // serve secure cookies
    secureSessionConfig.cookie.sameSite = "strict" // serve secure cookies
}

const app = fastify(fastifyConfig);

app.register(cors, {
    origin: process.env.CLIENT_URL.split(" "),
    credentials: true,
});
app.register(fastifySecureSession, secureSessionConfig);

const customAuth = require("./customAuth");
const apiV1 = require("./api/v1/index");

app.register(customAuth);

app.register(apiV1, { prefix: "/api/v1" });

app.get("/", async (req, res) => {
    res.send({ hello: "world" });
});

app.listen({ port: process.env.PORT || 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log("Server started on address " + address);
});