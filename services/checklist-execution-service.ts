import { prisma } from "@/lib/prisma"

export async function startExecutionService(
    checklistId: string,
    userId: string
) {
    const checklist = await prisma.checklist.findUnique({
        where: { id: checklistId },
        include: { items: true },
    })

    if (!checklist) {
        throw new Error("Checklist não encontrado")
    }

    const execution = await prisma.checklistExecution.create({
        data: {
            checklistId,
            userId,
        },
    })

    await prisma.checklistExecutionItem.createMany({
        data: checklist.items.map((item) => ({
            executionId: execution.id,
            itemId: item.id,
        })),
    })

    return execution
}


export async function updateExecutionItemService(
    executionItemId: string,
    checked: boolean,
    observation?: string
) {
    return prisma.checklistExecutionItem.update({
        where: { id: executionItemId },
        data: {
            checked,
            observation,
        },
    })
}

export async function finishExecutionService(executionId: string) {
    return prisma.checklistExecution.update({
        where: { id: executionId },
        data: {
            status: "COMPLETED",
            finishedAt: new Date(),
        },
    })
}

