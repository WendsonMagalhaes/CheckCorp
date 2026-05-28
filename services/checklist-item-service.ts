import { prisma } from "@/lib/prisma"

export async function createChecklistItemService(
    checklistId: string,
    title: string,
    required: boolean
) {
    const lastItem = await prisma.checklistItem.findFirst({
        where: { checklistId },
        orderBy: { order: "desc" },
    })

    const nextOrder = lastItem ? lastItem.order + 1 : 0

    return prisma.checklistItem.create({
        data: {
            checklistId,
            title,
            required,
            order: nextOrder,
        },
    })
}

export async function deleteChecklistItemService(
    itemId: string
) {
    const item = await prisma.checklistItem.findUnique({
        where: { id: itemId },
    })

    if (!item) {
        throw new Error("Item não encontrado")
    }

    await prisma.checklistItem.delete({
        where: { id: itemId },
    })

    // 🔥 reordenar após delete
    const items = await prisma.checklistItem.findMany({
        where: { checklistId: item.checklistId },
        orderBy: { order: "asc" },
    })

    await Promise.all(
        items.map((it, index) =>
            prisma.checklistItem.update({
                where: { id: it.id },
                data: { order: index },
            })
        )
    )
}

export async function reorderChecklistItemsService(
    checklistId: string,
    orderedIds: string[]
) {
    return prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.checklistItem.update({
                where: { id },
                data: { order: index },
            })
        )
    )
}

export async function getChecklistItemsService(
    checklistId: string
) {
    return prisma.checklistItem.findMany({
        where: { checklistId },
        orderBy: { order: "asc" },
    })
}