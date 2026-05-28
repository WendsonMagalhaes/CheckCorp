export default function DashboardPage() {
    return (
        <div className="space-y-2">
            <h1
                className="
                    text-3xl
                    lg:text-4xl
                    font-black
                    text-foreground
                    tracking-tight
                "
            >
                Dashboard
            </h1>

            <p
                className="
                    text-sm
                    lg:text-base
                    text-muted-foreground
                "
            >
                Visão geral dos checklists e atividades da empresa.
            </p>
        </div>
    )
}