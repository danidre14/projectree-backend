const prisma = require("../../prisma/context");

async function projectreesRouter(router, options, done) {
    router.get("/", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const authorId = req.user.id;

            const projectrees = await prisma.projectree.findMany({
                where: {
                    authorId
                },
                include: {
                    publishtree: true
                }
            });

            return {
                success: true,
                data: { projectrees }
            }
        } catch (err) {
            console.error("Failed getting user's projectrees", err);
            return { success: false }
        }
    });
    router.get("/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const id = req.params.id;
            const authorId = req.user.id;

            const projectree = await prisma.projectree.findFirst({
                where: {
                    id,
                    authorId,
                },
                include: {
                    projectItems: true,
                    publishtree: true,
                }
            });

            if (!projectree)
                return {
                    success: false,
                    message: "No projectree found."
                }

            return {
                success: true,
                data: { projectree }
            }
        } catch (err) {
            console.error("Failed getting user projectree", err);
            return { success: false }
        }
    });

    router.post("/", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const payload = req.body;
            const authorId = req.user.id;

            const projectree = await prisma.projectree.create({
                data: {
                    name: payload.name,
                    title: payload.title,
                    favicon: payload.favicon,
                    theme: payload.theme,
                    authorId,
                    projectItems: {
                        create: payload.projectItems.map(item => {
                            const itemDate = item.date ? new Date(item.date) : undefined;
                            return {
                                name: item.name,
                                description: item.description,
                                image: item.image,
                                languages: item.languages,
                                sourceLink: item.sourceLink,
                                demoLink: item.demoLink,
                                date: itemDate,
                                position: item.position,
                                authorId,
                            }
                        })
                    }
                }
            });

            return {
                success: true,
                detail: "Projectree created successfully.",
                data: { projectree }
            }
        } catch (err) {
            console.error("Error creating projectree", err);
            return { success: false }
        }
    });

    router.put("/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const id = req.params.id;
            const authorId = req.user.id;

            const payload = req.body;

            // validate user has access to this projectree
            const oldProjectree = await prisma.projectree.findFirst({
                where: {
                    id,
                    authorId,
                }
            });

            if (!oldProjectree)
                return { success: false }

            await prisma.projectree.update({
                where: {
                    id,
                },
                data: {
                    name: payload.name,
                    title: payload.title,
                    favicon: payload.favicon,
                    theme: payload.theme,
                    projectItems: {
                        deleteMany: {},
                        create: payload.projectItems.map(item => {
                            const itemDate = item.date ? new Date(item.date) : undefined;
                            return {
                                name: item.name,
                                description: item.description,
                                image: item.image,
                                languages: item.languages,
                                sourceLink: item.sourceLink,
                                demoLink: item.demoLink,
                                date: itemDate,
                                position: item.position,
                                authorId,
                            }
                        })
                    }
                }
            });

            const projectree = await prisma.projectree.findUnique({
                where: {
                    id,
                },
                include: {
                    projectItems: true
                }
            });

            return {
                success: true,
                detail: "Projectree updated successfully.",
                data: { projectree }
            }
        } catch (err) {
            console.error("Error updating projectree", err);
            return { success: false }
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated())
                return { success: false }

            const id = req.params.id;
            const authorId = req.user.id;

            await prisma.projectree.deleteMany({
                where: {
                    id,
                    authorId
                }
            });

            return {
                success: true,
                detail: "Projectree deleted successfully.",
            }
        } catch (err) {
            console.error("Error deleting projectree", err);
            return { success: false }
        }
    });

    done();
}

module.exports = projectreesRouter;