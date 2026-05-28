import { prisma } from "@/lib/prisma"

import {
    ExecuteChecklist,
} from "@/components/checklists/execute-checklist"

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function Page({
    params,
}: Props) {

    const { id } =
        await params

    const checklist =
        await prisma.checklist.findUnique({

            where: {
                id,
            },

            include: {
                items: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        })

    if (!checklist) {

        return (
            <div className="
                p-6
            ">
                Checklist não encontrado
            </div>
        )
    }

    return (
        <ExecuteChecklist
            checklistId={checklist.id}

            // ✅ PASSA O TITULO
            checklistTitle={checklist.title}

            items={checklist.items}
        />
    )
}