"use server"

import {
    createChecklistItemService,
    deleteChecklistItemService,
    reorderChecklistItemsService,
    getChecklistItemsService,
} from "@/services/checklist-item-service"

export async function getChecklistItemsAction(
    checklistId: string
) {
    try {
        const items =
            await getChecklistItemsService(checklistId)

        return items
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function createChecklistItemAction(data: {
    checklistId: string
    title: string
    required?: boolean
}) {
    try {
        await createChecklistItemService(
            data.checklistId,
            data.title,
            data.required ?? true
        )

        return {
            success: true,
            message: "Item criado com sucesso",
        }
    } catch (error) {
        return {
            success: false,
            message: "Erro ao criar item",
        }
    }
}

export async function deleteChecklistItemAction(
    itemId: string
) {
    try {
        await deleteChecklistItemService(itemId)

        return {
            success: true,
            message: "Item removido",
        }
    } catch (error) {
        return {
            success: false,
            message: "Erro ao remover item",
        }
    }
}

export async function reorderChecklistItemsAction(data: {
    checklistId: string
    orderedIds: string[]
}) {
    try {
        await reorderChecklistItemsService(
            data.checklistId,
            data.orderedIds
        )

        return {
            success: true,
            message: "Ordem atualizada",
        }
    } catch (error) {
        return {
            success: false,
            message: "Erro ao reordenar itens",
        }
    }
}