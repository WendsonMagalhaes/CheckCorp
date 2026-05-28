import ChecklistBuilder from "@/components/checklists/items/checklist-builder"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return <ChecklistBuilder checklistId={id} />
}