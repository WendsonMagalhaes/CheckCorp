"use client"

import {
    useEffect,
    useState,
    useTransition,
} from "react"

import { useSession } from "next-auth/react"
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

interface Checklist {
    id: string
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

    const userId = session?.user?.id
    const userRole = session?.user?.role

    const [items, setItems] = useState<ChecklistItem[]>([])
    const [title, setTitle] = useState("")
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [isPending, startTransition] = useTransition()

    // 🔐 REGRA FINAL DE ACESSO
    const canManage = (() => {
        if (userRole === "ADMIN") return true

        if (userRole === "SUPERVISOR") {
            return checklist.createdById === userId
        }

        // EMPREGADO
        return checklist.createdById === userId
    })()

    // LOAD ITEMS
    useEffect(() => {
        async function loadItems() {
            const data = await getChecklistItemsAction(checklistId)
            setItems(data || [])
        }

        loadItems()
    }, [checklistId])

    // ➕ ADD ITEM
    function handleAddItem() {
        if (!canManage) {
            toast.error("Você não tem permissão para editar este checklist")
            return
        }

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

    // 🗑 DELETE
    function handleDelete(id: string) {
        if (!canManage) {
            toast.error("Sem permissão")
            return
        }

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
                orderedIds: reordered.map((i) => i.id),
            })
        })
    }

    return (
        <div className="flex flex-col gap-4">

            {/* ADD ITEM */}
            {canManage && (
                <div className="flex gap-2">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Adicionar item..."
                        className="flex-1 h-11 px-4 rounded-2xl border border-border bg-background"
                    />

                    <button
                        onClick={handleAddItem}
                        disabled={isPending}
                        className="h-11 px-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={16} />
                        Adicionar
                    </button>
                </div>
            )}

            {/* LIST */}
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        draggable={canManage}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card"
                    >

                        <div className="flex items-center gap-3">

                            {canManage && (
                                <GripVertical size={18} className="text-muted-foreground" />
                            )}

                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {item.title}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    {item.required ? "Obrigatório" : "Opcional"}
                                </span>
                            </div>

                        </div>

                        {canManage && (
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-destructive hover:bg-destructive/10"
                            >
                                <Trash size={16} />
                            </button>
                        )}

                    </div>
                ))}
            </div>

            {/* EMPTY */}
            {!items.length && (
                <div className="text-sm text-muted-foreground text-center py-6">
                    Nenhum item adicionado ainda
                </div>
            )}
        </div>
    )
}