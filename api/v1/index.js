const authApi = require("./auth");
const projectreesApi = require("./projectrees");
const publishtreesApi = require("./publishtrees");

async function apis(router, options, done) {
    router.get("/", async (req, res) => {
        res.send({ api: "world" });
    });
    router.register(authApi, { prefix: "/auth" });
    router.register(projectreesApi, { prefix: "/projectrees" });
    router.register(publishtreesApi, { prefix: "/publishtrees" });
    done();
}

module.exports = apis;