"use client"

import {
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react"

import {
    CheckCircle2,
    Circle,
    ClipboardCheck,
    Sparkles,
} from "lucide-react"

import { toast } from "sonner"

import {
    startChecklistExecutionAction,
    toggleExecutionItemAction,
    finishChecklistExecutionAction,
} from "@/app/(dashboard)/checklists/checklist-execution/actions"

interface ChecklistItem {
    id: string
    title: string
    required: boolean
    order: number
}

interface ExecutionItem {
    id: string
    checked: boolean
    itemId: string
}

interface Props {
    checklistId: string
    checklistTitle?: string
    items: ChecklistItem[]
}

export function ExecuteChecklist({
    checklistId,
    checklistTitle,
    items,
}: Props) {

    const [executionId, setExecutionId] = useState("")
    const [executionItems, setExecutionItems] =
        useState<ExecutionItem[]>([])

    const [isPending, startTransition] = useTransition()

    /* =========================================================
       START EXECUTION
    ========================================================= */
    useEffect(() => {
        let mounted = true

        async function startExecution() {
            const response =
                await startChecklistExecutionAction(checklistId)

            if (!mounted) return

            if (!response.success || !response.execution) {
                toast.error(
                    response.message ||
                    "Erro ao iniciar checklist"
                )
                return
            }

            setExecutionId(response.execution.id)
            setExecutionItems(response.execution.items)
        }

        startExecution()

        return () => {
            mounted = false
        }
    }, [checklistId])

    /* =========================================================
       TOGGLE ITEM
    ========================================================= */
    function handleToggle(executionItemId: string) {
        setExecutionItems((prev) =>
            prev.map((item) =>
                item.id === executionItemId
                    ? { ...item, checked: !item.checked }
                    : item
            )
        )

        startTransition(async () => {
            await toggleExecutionItemAction(executionItemId)
        })
    }

    /* =========================================================
       STATS
    ========================================================= */
    const total = executionItems.length

    const completed = executionItems.filter(
        (item) => item.checked
    ).length

    const pending = total - completed

    const progress =
        total > 0
            ? Math.round((completed / total) * 100)
            : 0

    /* =========================================================
       GREETING
    ========================================================= */
    const greeting = useMemo(() => {
        const hour = new Date().getHours()

        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }, [])

    /* =========================================================
       FINISH EXECUTION
    ========================================================= */
    function handleFinish() {
        if (!executionId) {
            toast.error("Execução não iniciada")
            return
        }

        startTransition(async () => {
            const response =
                await finishChecklistExecutionAction(
                    executionId
                )

            if (!response.success) {
                toast.error(response.message)
                return
            }

            toast.success("Checklist finalizado")
        })
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">

            {/* HEADER */}
            <div className="relative overflow-hidden rounded-3xl border bg-card p-6 mb-6">

                <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative z-10">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div className="flex items-start gap-4">

                            <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                                <ClipboardCheck size={26} />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {greeting}
                                </p>

                                <h1 className="text-2xl font-black">
                                    {checklistTitle ||
                                        "Execução do Checklist"}
                                </h1>

                                <p className="text-sm text-muted-foreground mt-1">
                                    Marque os itens concluídos
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">

                            <div className="px-4 py-3 rounded-xl border bg-background/60">
                                <p className="text-xs text-muted-foreground">
                                    Progresso
                                </p>
                                <h3 className="text-xl font-black">
                                    {progress}%
                                </h3>
                            </div>

                            <div className="px-4 py-3 rounded-xl border bg-background/60">
                                <p className="text-xs text-muted-foreground">
                                    Itens
                                </p>
                                <h3 className="text-xl font-black">
                                    {completed}/{total}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mt-6">
                        <div className="flex justify-between mb-2 text-sm">
                            <span>Andamento</span>
                            <span>{pending} pendentes</span>
                        </div>

                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-3">
                {items.map((item) => {
                    const executionItem =
                        executionItems.find(
                            (e) => e.itemId === item.id
                        )

                    const checked = executionItem?.checked

                    return (
                        <button
                            key={item.id}
                            onClick={() =>
                                executionItem &&
                                handleToggle(executionItem.id)
                            }
                            className={`flex justify-between items-center p-4 rounded-2xl border transition ${checked
                                    ? "bg-primary/10 border-primary/30"
                                    : "bg-card hover:border-primary/30"
                                }`}
                        >

                            <div className="flex items-center gap-4">

                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl ${checked
                                            ? "bg-primary text-white"
                                            : "bg-muted"
                                        }`}
                                >
                                    {checked ? (
                                        <CheckCircle2 size={20} />
                                    ) : (
                                        <Circle size={20} />
                                    )}
                                </div>

                                <div className="text-left">
                                    <h3
                                        className={`font-bold ${checked
                                                ? "line-through text-muted-foreground"
                                                : ""
                                            }`}
                                    >
                                        {item.title}
                                    </h3>

                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${item.required
                                                ? "bg-primary/15 text-primary"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {item.required
                                            ? "Obrigatório"
                                            : "Opcional"}
                                    </span>
                                </div>
                            </div>

                            {checked && (
                                <span className="text-green-500 text-sm font-bold">
                                    Concluído
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex justify-center">
                <button
                    disabled={isPending || completed !== total}
                    onClick={handleFinish}
                    className="px-8 h-12 rounded-xl bg-primary text-white font-bold disabled:opacity-50"
                >
                    Finalizar checklist
                </button>
            </div>

        </div>
    )
}