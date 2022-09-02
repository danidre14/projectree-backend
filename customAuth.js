const fp = require('fastify-plugin')
async function customAuth(fastify, options) {

    fastify.decorateRequest("user", null);
    fastify.decorateRequest("isAuthenticated", null);
    fastify.decorateRequest("logIn", null);
    fastify.decorateRequest("logOut", null);

    fastify.addHook("onRequest", (req, res, next) => {
        const isAuthenticated = () => {
            try {
                const user = req.session.get("user");
                if (user) {
                    return user;
                }
                return null;
            } catch {
                return null;
            }
        }
        req.isAuthenticated = () => {
            return !!isAuthenticated();
        }
        req.logOut = () => {
            req.session.set("user", undefined);
        }
        req.logIn = (data, cb) => {
            const done = function (error, user) {
                if (error) {
                    if (cb && typeof cb === "function")
                        cb(error, user);
                    return;
                }
                req.session.set("user", user);
                if (cb && typeof cb === "function")
                    cb(null, user);
            }
            try {
                if (customAuth.authenticate && typeof customAuth.authenticate === "function") {
                    customAuth.authenticate(data, done);
                } else {
                    if (cb && typeof cb === "function")
                        cb("Cannot authenticate. No authentication method found.", null);
                }
            } catch (err) {
                if (cb && typeof cb === "function")
                    cb(err, null);
            }
        }
        req.user = isAuthenticated();
        next();
    });
}

customAuth.useStrategy = (strategy) => {
    if (strategy && typeof strategy === "function") {
        customAuth.authenticate = strategy;
    }
}

module.exports = fp(customAuth);