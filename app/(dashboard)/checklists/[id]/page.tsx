import ChecklistBuilder from "@/components/checklists/checklist-builder/ChecklistBuilder"
import { getChecklistByIdAction } from "@/app/(dashboard)/checklists/actions"
import { notFound } from "next/navigation"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const checklist = await getChecklistByIdAction(id)

    if (!checklist) {
        notFound()
    }

    return (
        <ChecklistBuilder
            checklistId={id}
            checklist={checklist}
        />
    )
}