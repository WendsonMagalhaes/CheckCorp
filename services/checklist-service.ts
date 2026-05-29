
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

import {
    CreateChecklistData,
    UpdateChecklistData,
} from "@/validations/checklist-schema"

/* =========================================================
   CREATE
========================================================= */

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
        throw new Error(
            "Usuário não encontrado"
        )
    }

    // =====================================
    // VALIDAÇÃO DE DESTINO
    // =====================================

    const hasSector =
        !!data.sectorId

    const hasUser =
        !!data.assignedUserId

    if (!hasSector && !hasUser) {
        throw new Error(
            "Selecione um setor ou usuário"
        )
    }

    if (hasSector && hasUser) {
        throw new Error(
            "Selecione apenas um destino"
        )
    }

    // =====================================
    // ADMIN
    // =====================================

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

    // =====================================
    // SUPERVISOR
    // =====================================

    if (user.role === "SUPERVISOR") {

        const supervisedSectorIds =
            user.supervisedSectors.map(
                sector => sector.id
            )

        // CHECKLIST POR SETOR

        if (data.sectorId) {

            const canUseSector =
                supervisedSectorIds.includes(
                    data.sectorId
                )

            if (!canUseSector) {
                throw new Error(
                    "Você não possui acesso a este setor"
                )
            }
        }

        // CHECKLIST POR USUÁRIO

        if (data.assignedUserId) {

            const assignedUser =
                await prisma.user.findUnique({
                    where: {
                        id: data.assignedUserId,
                    },
                })

            if (!assignedUser) {
                throw new Error(
                    "Usuário não encontrado"
                )
            }

            const isOwnChecklist =
                assignedUser.id === user.id

            const belongsToSupervisedSector =
                !!assignedUser.sectorId &&
                supervisedSectorIds.includes(
                    assignedUser.sectorId
                )

            if (
                !isOwnChecklist &&
                !belongsToSupervisedSector
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

    // =====================================
    // EMPLOYEE
    // =====================================

    if (user.role === "EMPLOYEE") {

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

                sectorId: null,

                createdById: user.id,
            },
        })
    }

    throw new Error(
        "Permissão inválida"
    )
}

/* =========================================================
   UPDATE
========================================================= */

export async function updateChecklistService(
    data: UpdateChecklistData
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
        throw new Error(
            "Usuário não encontrado"
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

    // =====================================
    // PERMISSÃO
    // =====================================

    const isAdmin =
        user.role === "ADMIN"

    const isOwner =
        checklist.createdById === user.id

    if (!isAdmin && !isOwner) {
        throw new Error(
            "Você não pode editar este checklist"
        )
    }

    // =====================================
    // VALIDA DESTINO
    // =====================================

    const hasSector =
        !!data.sectorId

    const hasUser =
        !!data.assignedUserId

    if (!hasSector && !hasUser) {
        throw new Error(
            "Selecione um setor ou usuário"
        )
    }

    if (hasSector && hasUser) {
        throw new Error(
            "Selecione apenas um destino"
        )
    }

    // =====================================
    // ADMIN
    // =====================================

    if (user.role === "ADMIN") {

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

                sectorId:
                    data.sectorId || null,

                assignedUserId:
                    data.assignedUserId || null,
            },
        })
    }

    // =====================================
    // SUPERVISOR
    // =====================================

    if (user.role === "SUPERVISOR") {

        const supervisedSectorIds =
            user.supervisedSectors.map(
                sector => sector.id
            )

        // SETOR

        if (data.sectorId) {

            const canUseSector =
                supervisedSectorIds.includes(
                    data.sectorId
                )

            if (!canUseSector) {
                throw new Error(
                    "Você não pode usar este setor"
                )
            }
        }

        // USUÁRIO

        if (data.assignedUserId) {

            const assignedUser =
                await prisma.user.findUnique({
                    where: {
                        id: data.assignedUserId,
                    },
                })

            if (!assignedUser) {
                throw new Error(
                    "Usuário não encontrado"
                )
            }

            const isOwnChecklist =
                assignedUser.id === user.id

            const belongsToSupervisedSector =
                !!assignedUser.sectorId &&
                supervisedSectorIds.includes(
                    assignedUser.sectorId
                )

            if (
                !isOwnChecklist &&
                !belongsToSupervisedSector
            ) {
                throw new Error(
                    "Usuário inválido"
                )
            }
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

                sectorId:
                    data.sectorId || null,

                assignedUserId:
                    data.assignedUserId || null,
            },
        })
    }

    // =====================================
    // EMPLOYEE
    // =====================================

    if (user.role === "EMPLOYEE") {

        if (
            data.assignedUserId !== user.id
        ) {
            throw new Error(
                "Você só pode editar checklists próprios"
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

                sectorId: null,

                assignedUserId: user.id,
            },
        })
    }

    throw new Error(
        "Permissão inválida"
    )
}

/* =========================================================
   DELETE
========================================================= */

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

    const user =
        await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
        })

    if (!user) {
        throw new Error(
            "Usuário não encontrado"
        )
    }

    // ADMIN pode tudo

    const isAdmin =
        user.role === "ADMIN"

    // CRIADOR

    const isOwner =
        checklist.createdById === user.id

    if (!isAdmin && !isOwner) {
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

