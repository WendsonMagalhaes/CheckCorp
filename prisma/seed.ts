import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

    const password = await bcrypt.hash("123456", 10)

    await prisma.user.create({
        data: {
            name: "Administrador",
            email: "admin@checkcorp.com",
            password,
            role: "ADMIN",
        },
    })

    console.log("Admin criado")
}

main()