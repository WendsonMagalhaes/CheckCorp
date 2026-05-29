import { GripVertical, Trash } from "lucide-react"

interface Props {
    title: string
    required: boolean
    canManage: boolean
    onDelete: () => void
    dragProps?: any
}

export function ChecklistItemCard({
    title,
    required,
    canManage,
    onDelete,
    dragProps,
}: Props) {
    return (
        <div
            {...dragProps}
            className="
                group
                flex items-center justify-between
                gap-4 p-4
                rounded-3xl
                border border-border
                bg-card
                hover:shadow-sm
                transition
            "
        >

            <div className="flex items-center gap-4">

                {canManage && (
                    <div className="opacity-40 group-hover:opacity-100 transition cursor-grab">
                        <GripVertical size={18} />
                    </div>
                )}

                <div className="flex flex-col">
                    <span className="font-semibold">
                        {title}
                    </span>

                    <span className="text-xs text-muted-foreground">
                        {required ? "Obrigatório" : "Opcional"}
                    </span>
                </div>

            </div>

            {canManage && (
                <button
                    onClick={onDelete}
                    className="
                        opacity-0 group-hover:opacity-100
                        transition
                        h-9 w-9
                        rounded-xl
                        border border-border
                        flex items-center justify-center
                        text-destructive
                        hover:bg-destructive/10
                    "
                >
                    <Trash size={16} />
                </button>
            )}

        </div>
    )
}