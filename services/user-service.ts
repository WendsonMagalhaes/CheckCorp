import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

import {
    CreateUserData,
    UpdateUserData,
} from "@/validations/user-schema"

export async function createUserService(
    data: CreateUserData
) {

    const existingUser =
        await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        })

    if (existingUser) {

        throw new Error(
            "Usuário já existe"
        )
    }

    const passwordHash =
        await bcrypt.hash(
            data.password,
            10
        )

    return prisma.user.create({
        data: {

            name: data.name,

            email: data.email,

            password: passwordHash,

            role: data.role,

            // SETOR PRINCIPAL
            sectorId:
                data.sectorId || null,

            // SETORES SUPERVISIONADOS
            supervisedSectors:
                data.supervisedSectorIds?.length
                    ? {
                        connect:
                            data.supervisedSectorIds.map(
                                sectorId => ({
                                    id: sectorId,
                                })
                            ),
                    }
                    : undefined,
        },
    })
}

export async function updateUserService(
    data: UpdateUserData
) {

    const existingUser =
        await prisma.user.findFirst({
            where: {
                email: data.email,

                NOT: {
                    id: data.id,
                },
            },
        })

    if (existingUser) {

        throw new Error(
            "Já existe um usuário com esse e-mail"
        )
    }

    return prisma.user.update({
        where: {
            id: data.id,
        },

        data: {

            name: data.name,

            email: data.email,

            role: data.role,

            active: data.active,

            // SETOR PRINCIPAL
            sectorId:
                data.sectorId || null,

            // SETORES SUPERVISIONADOS
            supervisedSectors: {
                set:
                    data.supervisedSectorIds?.map(
                        sectorId => ({
                            id: sectorId,
                        })
                    ) || [],
            },
        },
    })
}

export async function deleteUserService(
    userId: string
) {

    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

    if (!user) {

        throw new Error(
            "Usuário não encontrado"
        )
    }

    await prisma.user.delete({
        where: {
            id: userId,
        },
    })
}