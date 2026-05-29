"use client"

import { useEffect, useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import {
    createChecklistItemAction,
    deleteChecklistItemAction,
    reorderChecklistItemsAction,
    getChecklistItemsAction,
} from "@/app/(dashboard)/checklists/items/actions"

import { ChecklistBuilderHeader } from "./checklist-builder-header"
import { ChecklistItemInput } from "./checklist-item-input"
import { ChecklistItemCard } from "./checklist-item-card"
import { ChecklistEmptyState } from "./checklist-empty-state"

interface ChecklistItem {
    id: string
    title: string
    required: boolean
    order: number
}

interface Checklist {
    id: string
    title: string
    description?: string | null
    createdById?: string | null
}

interface Props {
    checklistId: string
    checklist: Checklist
}

export default function ChecklistBuilder({
    checklistId,
    checklist,
}: Props) {

    const { data: session } = useSession()

    const [items, setItems] = useState<ChecklistItem[]>([])
    const [title, setTitle] = useState("")
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [isPending, startTransition] = useTransition()

    const userId = session?.user?.id
    const userRole = session?.user?.role

    const canManage =
        userRole === "ADMIN" ||
        checklist.createdById === userId

    // LOAD
    useEffect(() => {
        loadItems()
    }, [checklistId])

    async function loadItems() {
        const data = await getChecklistItemsAction(checklistId)
        setItems(data || [])
    }

    // ➕ ADD ITEM
    function handleAddItem() {
        if (!canManage) {
            return toast.error("Sem permissão")
        }

        if (!title.trim()) {
            return toast.error("Digite um item")
        }

        startTransition(() => {
            void (async () => {
                const res = await createChecklistItemAction({
                    checklistId,
                    title,
                    required: true,
                })

                if (!res.success) {
                    toast.error(res.message)
                    return
                }

                setTitle("")
                await loadItems()
            })()
        })
    }

    // 🗑 DELETE
    function handleDelete(id: string) {
        if (!canManage) return

        startTransition(() => {
            (async () => {
                const res = await deleteChecklistItemAction(id)

                if (!res.success) {
                    toast.error(res.message)
                    return
                }

                await loadItems()
            })()
        })
    }

    // 🔄 DRAG START
    function handleDragStart(index: number) {
        if (!canManage) return
        setDragIndex(index)
    }

    // 🔄 DROP
    function handleDrop(index: number) {
        if (!canManage) return
        if (dragIndex === null) return

        const updated = [...items]
        const dragged = updated[dragIndex]

        updated.splice(dragIndex, 1)
        updated.splice(index, 0, dragged)

        const reordered = updated.map((item, i) => ({
            ...item,
            order: i,
        }))

        setItems(reordered)
        setDragIndex(null)

        startTransition(async () => {
            await reorderChecklistItemsAction({
                checklistId,
                orderedIds: reordered.map(i => i.id),
            })
        })
    }

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <ChecklistBuilderHeader
                title={checklist.title}
                description={checklist.description}
            />

            {/* INPUT */}
            {canManage && (
                <ChecklistItemInput
                    value={title}
                    onChange={setTitle}
                    onAdd={handleAddItem}
                    disabled={isPending}
                />
            )}

            {/* LIST */}
            <div className="flex flex-col gap-3">

                {items.length === 0 && (
                    <ChecklistEmptyState />
                )}

                {items.map((item, index) => (
                    <ChecklistItemCard
                        key={item.id}
                        title={item.title}
                        required={item.required}
                        canManage={canManage}
                        onDelete={() => handleDelete(item.id)}
                        dragProps={{
                            draggable: canManage,
                            onDragStart: () => handleDragStart(index),
                            onDragOver: (e: any) => e.preventDefault(),
                            onDrop: () => handleDrop(index),
                        }}
                    />
                ))}

            </div>

        </div>
    )
}