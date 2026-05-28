"use client"

import {
    useEffect,
    useState,
    useTransition,
} from "react"

import { GripVertical, Trash } from "lucide-react"
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

export function ChecklistItemsList({
    checklistId,
}: Props) {

    const [items, setItems] = useState<ChecklistItem[]>([])
    const [newItem, setNewItem] = useState("")
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [isPending, startTransition] = useTransition()

    // 🔥 LOAD DO BANCO
    useEffect(() => {
        async function loadItems() {
            const data = await getChecklistItemsAction(checklistId)
            setItems(data || [])
        }

        loadItems()
    }, [checklistId])

    // ➕ ADD ITEM (BANCO)
    async function handleAddItem() {
        if (!newItem.trim()) {
            toast.error("Digite um item")
            return
        }

        startTransition(async () => {
            const response = await createChecklistItemAction({
                checklistId,
                title: newItem,
                required: true,
            })

            if (!response.success) {
                toast.error(response.message)
                return
            }

            const data = await getChecklistItemsAction(checklistId)
            setItems(data)

            setNewItem("")
        })
    }

    // 🗑 DELETE ITEM (BANCO)
    async function handleDelete(id: string) {
        startTransition(async () => {
            const response = await deleteChecklistItemAction(id)

            if (!response.success) {
                toast.error(response.message)
                return
            }

            const data = await getChecklistItemsAction(checklistId)
            setItems(data)
        })
    }

    // 🔄 DRAG START
    function handleDragStart(index: number) {
        setDragIndex(index)
    }

    // 🔄 DROP + SALVA NO BANCO
    async function handleDrop(index: number) {
        if (dragIndex === null) return

        const updated = [...items]
        const draggedItem = updated[dragIndex]

        updated.splice(dragIndex, 1)
        updated.splice(index, 0, draggedItem)

        const reordered = updated.map((item, index) => ({
            ...item,
            order: index,
        }))

        setItems(reordered)
        setDragIndex(null)

        // 🔥 PERSISTE ORDEM NO BANCO
        startTransition(async () => {
            const response = await reorderChecklistItemsAction({
                checklistId,
                orderedIds: reordered.map((i) => i.id),
            })

            if (!response.success) {
                toast.error(response.message)
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">

            {/* ADD ITEM */}
            <div className="flex gap-2">
                <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
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
                        disabled:opacity-50
                    "
                >
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
                        {/* LEFT */}
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

                        {/* DELETE */}
                        <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={isPending}
                            className="
                                h-9 w-9
                                rounded-xl
                                border border-border
                                flex items-center justify-center
                                hover:bg-destructive/10
                                text-destructive
                                transition
                            "
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {items.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-6">
                    Nenhum item adicionado ainda
                </div>
            )}
        </div>
    )
}