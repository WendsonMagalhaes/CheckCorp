import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

import {
    CreateChecklistData,
    UpdateChecklistData,
} from "@/validations/checklist-schema"

export async function createChecklistService(
    data: CreateChecklistData
) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error(
            "Usuário não autenticado"
        )
    }

    const user =
        await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },

            include: {
                supervisedSectors: true,
            },
        })

    if (!user) {
        throw new Error("Usuário não encontrado")
    }

    // OBRIGA TER DESTINO

    if (
        !data.sectorId &&
        !data.assignedUserId
    ) {
        throw new Error(
            "Selecione um setor ou usuário"
        )
    }

    // =========================
    // ADMIN
    // =========================

    if (user.role === "ADMIN") {

        return prisma.checklist.create({
            data: {
                title: data.title,
                description: data.description,
                frequency: data.frequency,

                sectorId:
                    data.sectorId || null,

                assignedUserId:
                    data.assignedUserId || null,

                createdById: user.id,
            },
        })
    }

    // =========================
    // SUPERVISOR
    // =========================

    if (user.role === "SUPERVISOR") {

        const supervisedSectorIds =
            user.supervisedSectors.map(
                sector => sector.id
            )

        // CHECKLIST POR SETOR

        if (
            data.sectorId &&
            !supervisedSectorIds.includes(
                data.sectorId
            )
        ) {
            throw new Error(
                "Você não pode criar checklist para este setor"
            )
        }

        // CHECKLIST POR USUÁRIO

        if (data.assignedUserId) {

            const assignedUser =
                await prisma.user.findUnique({
                    where: {
                        id: data.assignedUserId,
                    },
                })

            if (
                !assignedUser ||
                !assignedUser.sectorId ||
                !supervisedSectorIds.includes(
                    assignedUser.sectorId
                )
            ) {
                throw new Error(
                    "Usuário fora dos setores supervisionados"
                )
            }
        }

        return prisma.checklist.create({
            data: {
                title: data.title,
                description: data.description,
                frequency: data.frequency,

                sectorId:
                    data.sectorId || null,

                assignedUserId:
                    data.assignedUserId || null,

                createdById: user.id,
            },
        })
    }

    // =========================
    // EMPLOYEE
    // =========================

    if (user.role === "EMPLOYEE") {

        // SOMENTE PARA ELE MESMO

        if (
            data.assignedUserId !== user.id
        ) {
            throw new Error(
                "Você só pode criar checklist para si mesmo"
            )
        }

        return prisma.checklist.create({
            data: {
                title: data.title,
                description: data.description,
                frequency: data.frequency,

                assignedUserId: user.id,

                createdById: user.id,
            },
        })
    }

    throw new Error("Permissão inválida")
}

export async function updateChecklistService(
    data: UpdateChecklistData
) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error(
            "Usuário não autenticado"
        )
    }

    const checklist =
        await prisma.checklist.findUnique({
            where: {
                id: data.id,
            },
        })

    if (!checklist) {

        throw new Error(
            "Checklist não encontrado"
        )
    }

    // SOMENTE O CRIADOR
    // PODE EDITAR

    if (
        checklist.createdById !==
        session.user.id
    ) {
        throw new Error(
            "Você não pode editar este checklist"
        )
    }

    // OBRIGA TER UM DESTINO

    if (
        !data.sectorId &&
        !data.assignedUserId
    ) {
        throw new Error(
            "Selecione um setor ou usuário"
        )
    }

    return prisma.checklist.update({
        where: {
            id: data.id,
        },

        data: {
            title: data.title,

            description:
                data.description,

            frequency:
                data.frequency,

            active:
                data.active,

            // SETOR
            sectorId:
                data.sectorId || undefined,

            assignedUserId:
                data.assignedUserId || undefined,
        },
    })
}

export async function deleteChecklistService(
    checklistId: string
) {

    const session = await auth()

    if (!session?.user?.id) {
        throw new Error(
            "Usuário não autenticado"
        )
    }

    const checklist =
        await prisma.checklist.findUnique({
            where: {
                id: checklistId,
            },
        })

    if (!checklist) {

        throw new Error(
            "Checklist não encontrado"
        )
    }

    // SOMENTE O CRIADOR
    // PODE EXCLUIR

    if (
        checklist.createdById !==
        session.user.id
    ) {
        throw new Error(
            "Você não pode excluir este checklist"
        )
    }

    await prisma.checklist.delete({
        where: {
            id: checklistId,
        },
    })
}