import { prisma } from "@/lib/prisma"
import { getCycleKey } from "@/lib/cycle-key"

export async function generateChecklistExecutions() {
    const today = new Date()

    const checklists = await prisma.checklist.findMany({
        where: {
            active: true,
        },
        include: {
            items: true,
            assignedUser: true,
        },
    })

    for (const checklist of checklists) {
        const userId = checklist.assignedUserId

        if (!userId) continue

        const cycleKey = getCycleKey(
            today,
            checklist.frequency
        )

        const exists =
            await prisma.checklistExecution.findFirst({
                where: {
                    checklistId: checklist.id,
                    userId,
                    cycleKey,
                },
            })

        if (exists) continue

        await prisma.checklistExecution.create({
            data: {
                checklistId: checklist.id,
                userId,
                cycleKey,
                startedAt: today,

                items: {
                    create: checklist.items.map((item) => ({
                        itemId: item.id,
                        checked: false,
                    })),
                },
            },
        })
    }
}