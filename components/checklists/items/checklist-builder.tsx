"use client"

import {
    useEffect,
    useState,
    useTransition,
} from "react"

import { GripVertical, Trash, Plus } from "lucide-react"
import { toast } from "sonner"

import {
    createChecklistItemAction,
    deleteChecklistItemAction,
    reorderChecklistItemsAction,
    getChecklistItemsAction,
} from "@/app/(dashboard)/checklists/items/actions"

interface ChecklistItem {
    id: string
    title: string
    required: boolean
    order: number
}

interface Props {
    checklistId: string
}

export default function ChecklistBuilder({ checklistId }: Props) {
    const [items, setItems] = useState<ChecklistItem[]>([])
    const [title, setTitle] = useState("")
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [isPending, startTransition] = useTransition()

    // 📌 LOAD ITEMS
    useEffect(() => {
        async function loadItems() {
            const data = await getChecklistItemsAction(checklistId)
            setItems(data || [])
        }

        loadItems()
    }, [checklistId])

    // ➕ ADD ITEM
    function handleAddItem() {
        if (!title.trim()) {
            toast.error("Digite um item")
            return
        }

        startTransition(async () => {
            const res = await createChecklistItemAction({
                checklistId,
                title,
                required: true,
            })

            if (!res.success) {
                toast.error(res.message)
                return
            }

            const updated = await getChecklistItemsAction(checklistId)
            setItems(updated)

            setTitle("")
        })
    }

    // 🗑 DELETE ITEM
    function handleDelete(id: string) {
        startTransition(async () => {
            const res = await deleteChecklistItemAction(id)

            if (!res.success) {
                toast.error(res.message)
                return
            }

            const updated = await getChecklistItemsAction(checklistId)
            setItems(updated)
        })
    }

    // 🔄 DRAG START
    function handleDragStart(index: number) {
        setDragIndex(index)
    }

    // 🔄 DROP + REORDER
    function handleDrop(index: number) {
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
                orderedIds: reordered.map((i) => i.id),
            })
        })
    }

    return (
        <div className="flex flex-col gap-4">

            {/* ADD */}
            <div className="flex gap-2">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Adicionar item..."
                    className="
                        flex-1 h-11 px-4
                        rounded-2xl border border-border
                        bg-background
                    "
                />

                <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={isPending}
                    className="
                        h-11 px-4
                        rounded-2xl
                        bg-primary
                        text-primary-foreground
                        font-bold
                        flex items-center gap-2
                        disabled:opacity-50
                    "
                >
                    <Plus size={16} />
                    Add
                </button>
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        className="
                            flex items-center justify-between
                            gap-3 p-3
                            rounded-2xl
                            border border-border
                            bg-card
                            cursor-grab active:cursor-grabbing
                        "
                    >
                        <div className="flex items-center gap-3">
                            <GripVertical size={18} className="text-muted-foreground" />

                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {item.title}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    {item.required ? "Obrigatório" : "Opcional"}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={isPending}
                            className="
                                h-9 w-9
                                rounded-xl
                                border border-border
                                flex items-center justify-center
                                text-destructive
                                hover:bg-destructive/10
                                transition
                            "
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* EMPTY */}
            {items.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-6">
                    Nenhum item adicionado ainda
                </div>
            )}
        </div>
    )
}