"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getCycleKey } from "@/lib/cycle-key"

/* =========================================================
   START EXECUTION (VERSÃO FINAL)
========================================================= */

export async function startChecklistExecutionAction(
    checklistId: string
) {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Não autenticado",
        }
    }

    const checklist = await prisma.checklist.findUnique({
        where: { id: checklistId },
        include: { items: true },
    })

    if (!checklist) {
        return {
            success: false,
            message: "Checklist não encontrado",
        }
    }

    const cycleKey = getCycleKey(
        new Date(),
        checklist.frequency
    )

    // 🔥 1. verifica se já existe execução nesse ciclo
    const existing = await prisma.checklistExecution.findFirst({
        where: {
            checklistId,
            userId: session.user.id,
            cycleKey,
        },
        include: { items: true },
    })

    // 🚨 2. se já existe e está FINALIZADO → bloqueia
    if (existing && existing.status === "COMPLETED") {
        return {
            success: false,
            message: "Este checklist já foi finalizado neste ciclo",
        }
    }

    // ♻️ 3. se já existe e ainda está em andamento → retorna ele
    if (existing && existing.status === "IN_PROGRESS") {
        return {
            success: true,
            execution: existing,
        }
    }

    // 🆕 4. se não existe → cria nova execução
    const execution = await prisma.checklistExecution.create({
        data: {
            checklistId,
            userId: session.user.id,
            cycleKey,
            status: "IN_PROGRESS",

            items: {
                create: checklist.items.map((i) => ({
                    itemId: i.id,
                    checked: false,
                })),
            },
        },
        include: { items: true },
    })

    return {
        success: true,
        execution,
    }
}
/* =========================================================
   TOGGLE ITEM
========================================================= */
export async function toggleExecutionItemAction(
    executionItemId: string
) {
    try {
        const item =
            await prisma.checklistExecutionItem.findUnique({
                where: { id: executionItemId },
            })

        if (!item) {
            return {
                success: false,
                message: "Item não encontrado",
            }
        }

        await prisma.checklistExecutionItem.update({
            where: { id: executionItemId },
            data: {
                checked: !item.checked,
            },
        })

        return {
            success: true,
        }
    } catch {
        return {
            success: false,
            message: "Erro interno",
        }
    }
}

/* =========================================================
   FINISH EXECUTION
========================================================= */
export async function finishChecklistExecutionAction(
    executionId: string
) {
    const execution = await prisma.checklistExecution.findUnique({
        where: { id: executionId },
        include: { items: true },
    })

    if (!execution) {
        return {
            success: false,
            message: "Execução não encontrada",
        }
    }

    // 🚨 já finalizado
    if (execution.status === "COMPLETED") {
        return {
            success: false,
            message: "Esta execução já foi finalizada",
        }
    }

    const hasPending = execution.items.some((i) => !i.checked)

    if (hasPending) {
        return {
            success: false,
            message: "Existem itens pendentes",
        }
    }

    await prisma.checklistExecution.update({
        where: { id: executionId },
        data: {
            status: "COMPLETED",
            finishedAt: new Date(),
        },
    })

    return { success: true }
}