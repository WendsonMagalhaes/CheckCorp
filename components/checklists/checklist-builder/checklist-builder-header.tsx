interface Props {
    title: string
    description?: string | null
}

export function ChecklistBuilderHeader({
    title,
    description,
}: Props) {
    return (
        <div className="bg-card border border-border rounded-3xl p-6">
            <h1 className="text-2xl font-black">
                {title}
            </h1>

            <p className="text-muted-foreground mt-1">
                {description || "Sem descrição"}
            </p>

            <span className="text-xs text-muted-foreground mt-3 block">
                Editor de itens do checklist
            </span>
        </div>
    )
}