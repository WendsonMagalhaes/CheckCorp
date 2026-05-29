export function ChecklistEmptyState() {
    return (
        <div className="bg-card border border-border rounded-3xl p-10 text-center">
            <div className="text-lg font-bold">
                Nenhum item criado ainda
            </div>

            <p className="text-muted-foreground mt-2">
                Adicione o primeiro item para começar a estruturar o checklist
            </p>
        </div>
    )
}