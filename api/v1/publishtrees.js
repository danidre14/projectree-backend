const prisma = require("../../prisma/context");

async function publishtreesRouter(router, options, done) {
    // router.get("/", async (req, res) => {
    //     try {
    //         if (!req.isAuthenticated())
    //             return { success: false }

    //         const authorId = req.user.id;

    //         const projectrees = await prisma.projectree.findMany({
    //             where: {
    //                 authorId
    //             }
    //         });

    //         return {
    //             success: true,
    //             data: { projectrees }
    //         }
    //     } catch (err) {
    //         console.error("Failed getting user's projectrees", err);
    //         return { success: false }
    //     }
    // });
    router.get("/:name", async (req, res) => {
        try {
            const name = req.params.name;

            const publishtree = await prisma.publishtree.findUnique({
                where: {
                    name
                },
                include: {
                    projectree: {
                        include: {
                            projectItems: true
                        }
                    }
                }
            });

            if (!publishtree)
                return {
                    success: false,
                    message: "Published projectree does not exist."
                }

            return {
                success: true,
                data: { publishtree }
            }
        } catch (err) {
            console.error("Failed getting published projectree", err);
            return { success: false }
        }
    });

    router.post("/:projectreeId", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const projectreeId = req.params.projectreeId;
            const authorId = req.user.id;
            const { name } = req.body;

            // confirm the projectree belongs to the client
            const projectree = await prisma.projectree.findFirst({
                where: {
                    id: projectreeId,
                    authorId,
                }
            });

            if (!projectree)
                return {
                    success: false,
                    message: "Projectree does not exist."
                }

            // confirm publishtree name is available
            const publishtreeByName = await prisma.publishtree.findUnique({
                where: {
                    name
                }
            })

            if (publishtreeByName)
                return {
                    success: false,
                    message: "A projectree already exists with this name."
                }

            const publishtreeByProjectreeId = await prisma.publishtree.findFirst({
                where: {
                    projectreeId
                }
            });

            if (publishtreeByProjectreeId)
                return {
                    success: false,
                    message: "This projectree has already been published."
                }


            const publishtree = await prisma.publishtree.create({
                data: {
                    name,
                    authorId,
                    projectreeId
                }
            });

            return {
                success: true,
                detail: "Projectree published successfully.",
                data: { publishtree }
            }
        } catch (err) {
            console.error("Error creating projectree", err);
            return { success: false }
        }
    });

    router.delete("/:projectreeId", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const projectreeId = req.params.projectreeId;
            const authorId = req.user.id;

            await prisma.publishtree.deleteMany({
                where: {
                    projectreeId,
                    authorId
                }
            });

            return {
                success: true,
                detail: "Projectree successfully unpublished.",
            }
        } catch (err) {
            console.error("Error deleting projectree", err);
            return { success: false }
        }
    });

    done();
}

module.exports = publishtreesRouter;