import { prisma } from "@/lib/prisma"

function generateCycleKey(checklistId: string) {
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    return `${checklistId}:${today}`
}

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

    const cycleKey = generateCycleKey(checklistId)

    // 🔒 evita duplicação no mesmo ciclo (ex: mesmo dia)
    const existingExecution = await prisma.checklistExecution.findFirst({
        where: {
            checklistId,
            userId,
            cycleKey,
        },
    })

    if (existingExecution) {
        return existingExecution
    }

    const execution = await prisma.checklistExecution.create({
        data: {
            checklistId,
            userId,
            cycleKey, // ✅ corrigido aqui
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