"use client"

import { Plus } from "lucide-react"

interface Props {
    value: string
    onChange: (v: string) => void
    onAdd: () => void
    disabled?: boolean
}

export function ChecklistItemInput({
    value,
    onChange,
    onAdd,
    disabled,
}: Props) {
    return (
        <div className="bg-card border border-border rounded-3xl p-4 flex gap-2 items-center">

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Digite um item e pressione Enter..."
                className="flex-1 bg-transparent outline-none text-sm"
                onKeyDown={(e) => {
                    if (e.key === "Enter") onAdd()
                }}
            />

            <button
                onClick={onAdd}
                disabled={disabled}
                className="h-10 px-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center gap-2"
            >
                <Plus size={16} />
                Add
            </button>

        </div>
    )
}