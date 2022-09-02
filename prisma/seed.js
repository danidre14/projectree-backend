const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            username: "user",
            password: "a_hashed_pass",
            email: "user@email.com",
            firstName: "Use",
            lastName: "Er"
        }
    });

    const payload = {
        name: "My Project 1",
        title: "Welcome to my ProjecTree",
        favicon: "/static/images/projectree-logo-primary.png",
        theme: "standard",
        projectItems: [
            {
                name: "Project 1",
                description: "This project is super cool bleh",
                languages: "html, css, js, mongodb",
                date: "",
                image: "/link/to/photo/here",
                position: 0,
                demoLink: "",
                sourceLink: "",
            },
            {
                name: "Cool project 2",
                description: "foo bar",
                languages: "nodejs, python",
                position: 1,
                demoLink: "/demo/link/here",
            },
            {
                name: "Cool project 3",
                description: "",
                languages: "java",
                position: 2,
                sourceLink: "source/code/p3",
            },
            {
                name: "Cool project 4",
                position: 3,
            },
            {
                name: "Project 5",
                position: 4,
            }
        ],
    }

    const projectree = await prisma.projectree.create({
        data: {
            name: payload.name,
            title: payload.title,
            favicon: payload.favicon,
            theme: payload.theme,
            authorId: user.id,
            projectItems: {
                createMany: {
                    data: payload.projectItems.map(item => ({
                        ...item,
                        authorId: user.id
                    }))
                }
            }
        }
    });


}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })