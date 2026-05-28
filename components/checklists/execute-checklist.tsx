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
    finishChecklistExecutionAction,
    startChecklistExecutionAction,
    toggleExecutionItemAction,
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

    const [
        executionId,
        setExecutionId,
    ] = useState("")

    const [
        executionItems,
        setExecutionItems,
    ] = useState<ExecutionItem[]>([])

    const [
        isPending,
        startTransition,
    ] = useTransition()

    // 🚀 START EXECUTION

    useEffect(() => {

        async function startExecution() {

            const response =
                await startChecklistExecutionAction(
                    checklistId
                )

            if (
                !response.success ||
                !response.execution
            ) {

                toast.error(
                    response.message ||
                    "Erro ao iniciar checklist"
                )

                return
            }

            setExecutionId(
                response.execution.id
            )

            setExecutionItems(
                response.execution.items
            )
        }

        startExecution()

    }, [checklistId])

    // ✅ TOGGLE

    function handleToggle(
        executionItemId: string
    ) {

        setExecutionItems((prev) =>
            prev.map((item) =>
                item.id === executionItemId
                    ? {
                        ...item,
                        checked: !item.checked,
                    }
                    : item
            )
        )

        startTransition(async () => {

            await toggleExecutionItemAction(
                executionItemId
            )
        })
    }

    // 📊 STATS

    const total =
        executionItems.length

    const completed =
        executionItems.filter(
            (item) => item.checked
        ).length

    const pending =
        total - completed

    const progress =
        total > 0
            ? Math.round(
                (completed / total) * 100
            )
            : 0

    // 👋 GREETING

    const greeting =
        useMemo(() => {

            const hour =
                new Date().getHours()

            if (hour < 12) {
                return "Bom dia"
            }

            if (hour < 18) {
                return "Boa tarde"
            }

            return "Boa noite"

        }, [])

    // 🏁 FINISH

    function handleFinish() {

        startTransition(async () => {

            const response =
                await finishChecklistExecutionAction(
                    executionId
                )

            if (!response.success) {

                toast.error(
                    response.message
                )

                return
            }

            toast.success(
                "Checklist finalizado"
            )
        })
    }

    return (
        <div className="
            w-full
            max-w-6xl
            mx-auto

            px-4
            py-4

            sm:px-6
            sm:py-6

            lg:px-8
            lg:py-8
        ">

            {/* HEADER */}

            <div className="
                relative
                overflow-hidden

                rounded-[32px]
                border
                border-border

                bg-card

                p-5
                sm:p-7

                mb-5
            ">

                {/* BG EFFECT */}

                <div className="
                    absolute
                    top-0
                    right-0

                    w-72
                    h-72

                    rounded-full
                    bg-primary/10

                    blur-3xl
                " />

                <div className="
                    relative
                    z-10
                ">

                    {/* TOP */}

                    <div className="
                        flex
                        flex-col
                        gap-5

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    ">

                        {/* LEFT */}

                        <div className="
                            flex
                            items-start
                            gap-4
                        ">

                            <div className="
                                min-w-[56px]
                                w-14
                                h-14

                                rounded-2xl

                                bg-primary/15
                                text-primary

                                flex
                                items-center
                                justify-center
                            ">
                                <ClipboardCheck
                                    size={28}
                                />
                            </div>

                            <div>
                                <p className="
                                    text-sm
                                    text-muted-foreground
                                    mb-1
                                ">
                                    {greeting}
                                </p>

                                <h1 className="
                                    text-2xl
                                    sm:text-3xl
                                    font-black
                                    leading-tight
                                ">
                                    {
                                        checklistTitle ||
                                        "Execução do Checklist"
                                    }
                                </h1>

                                <p className="
                                    text-sm
                                    text-muted-foreground
                                    mt-2
                                ">
                                    Marque os itens concluídos
                                    para finalizar a execução.
                                </p>
                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                rounded-2xl
                                border
                                border-border

                                bg-background/60
                                backdrop-blur

                                px-4
                                py-3
                            ">
                                <p className="
                                    text-xs
                                    text-muted-foreground
                                ">
                                    Progresso
                                </p>

                                <h3 className="
                                    text-2xl
                                    font-black
                                ">
                                    {progress}%
                                </h3>
                            </div>

                            <div className="
                                rounded-2xl
                                border
                                border-border

                                bg-background/60
                                backdrop-blur

                                px-4
                                py-3
                            ">
                                <p className="
                                    text-xs
                                    text-muted-foreground
                                ">
                                    Itens
                                </p>

                                <h3 className="
                                    text-2xl
                                    font-black
                                ">
                                    {completed}/{total}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="
                        mt-6
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            mb-3
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">
                                <Sparkles
                                    size={15}
                                    className="
                                        text-primary
                                    "
                                />

                                <span className="
                                    text-sm
                                    font-semibold
                                ">
                                    Andamento da execução
                                </span>
                            </div>

                            <span className="
                                text-sm
                                font-bold
                            ">
                                {pending} pendentes
                            </span>

                        </div>

                        <div className="
                            h-3
                            rounded-full
                            overflow-hidden
                            bg-muted
                        ">
                            <div
                                style={{
                                    width: `${progress}%`,
                                }}
                                className="
                                    h-full
                                    rounded-full
                                    bg-primary
                                    transition-all
                                    duration-300
                                "
                            />
                        </div>

                    </div>

                </div>

            </div>

            {/* ITEMS */}

            <div className="
                flex
                flex-col
                gap-3
            ">

                {
                    items.map((item) => {

                        const executionItem =
                            executionItems.find(
                                (exec) =>
                                    exec.itemId === item.id
                            )

                        const checked =
                            executionItem?.checked

                        return (
                            <button
                                key={item.id}
                                onClick={() =>
                                    executionItem &&
                                    handleToggle(
                                        executionItem.id
                                    )
                                }
                                className={`
                                    group
                                    relative

                                    flex
                                    items-center
                                    justify-between

                                    gap-4

                                    rounded-3xl
                                    border

                                    p-4
                                    sm:p-5

                                    text-left

                                    transition-all

                                    ${checked
                                        ? `
                                            border-primary/30
                                            bg-primary/10
                                        `
                                        : `
                                            border-border
                                            bg-card
                                            hover:border-primary/30
                                            hover:bg-muted/40
                                        `
                                    }
                                `}
                            >

                                {/* LEFT */}

                                <div className="
                                    flex
                                    items-center
                                    gap-4
                                    min-w-0
                                ">

                                    <div className={`
                                        min-w-[48px]
                                        w-12
                                        h-12

                                        rounded-2xl

                                        flex
                                        items-center
                                        justify-center

                                        transition

                                        ${checked
                                            ? `
                                                bg-primary
                                                text-primary-foreground
                                            `
                                            : `
                                                bg-muted
                                                text-muted-foreground
                                            `
                                        }
                                    `}>
                                        {
                                            checked ? (
                                                <CheckCircle2
                                                    size={24}
                                                />
                                            ) : (
                                                <Circle
                                                    size={24}
                                                />
                                            )
                                        }
                                    </div>

                                    <div className="
                                        min-w-0
                                    ">

                                        <h3 className={`
                                            text-sm
                                            sm:text-base
                                            font-bold

                                            ${checked
                                                ? `
                                                    line-through
                                                    text-muted-foreground
                                                `
                                                : ""
                                            }
                                        `}>
                                            {item.title}
                                        </h3>

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                            mt-2
                                            flex-wrap
                                        ">

                                            <span className={`
                                                px-2.5
                                                py-1

                                                rounded-full

                                                text-xs
                                                font-bold

                                                ${item.required
                                                    ? `
                                                        bg-primary/15
                                                        text-primary
                                                    `
                                                    : `
                                                        bg-muted
                                                        text-muted-foreground
                                                    `
                                                }
                                            `}>
                                                {
                                                    item.required
                                                        ? "Obrigatório"
                                                        : "Opcional"
                                                }
                                            </span>

                                            {
                                                checked && (
                                                    <span className="
                                                        px-2.5
                                                        py-1

                                                        rounded-full

                                                        text-xs
                                                        font-bold

                                                        bg-green-500/15
                                                        text-green-500
                                                    ">
                                                        Concluído
                                                    </span>
                                                )
                                            }

                                        </div>

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div className="
                                    hidden
                                    md:flex
                                    items-center
                                ">
                                    <div className={`
                                        w-3
                                        h-3
                                        rounded-full

                                        ${checked
                                            ? "bg-primary"
                                            : "bg-muted-foreground/30"
                                        }
                                    `} />
                                </div>

                            </button>
                        )
                    })
                }

            </div>

            {/* FOOTER ACTION */}

            <div className="
                sticky
                bottom-4

                mt-6

                flex
                justify-center
            ">

                <button
                    disabled={
                        isPending ||
                        completed !== total
                    }
                    onClick={handleFinish}
                    className="
                        w-full
                        sm:w-auto

                        h-14
                        px-8

                        rounded-2xl

                        bg-primary
                        text-primary-foreground

                        font-black

                        shadow-lg
                        shadow-primary/20

                        transition

                        hover:opacity-90

                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    Finalizar checklist
                </button>

            </div>

        </div>
    )
}