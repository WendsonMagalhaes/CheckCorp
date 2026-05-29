export function getCycleKey(date: Date, frequency: string) {
    const d = new Date(date)

    if (frequency === "DAILY") {
        return d.toISOString().split("T")[0]
    }

    if (frequency === "MONTHLY") {
        return `${d.getFullYear()}-${String(
            d.getMonth() + 1
        ).padStart(2, "0")}`
    }

    if (frequency === "WEEKLY") {
        const year = d.getFullYear()
        const week = getWeekNumber(d)
        return `${year}-W${week}`
    }

    return "ONCE"
}

function getWeekNumber(date: Date) {
    const firstJan = new Date(date.getFullYear(), 0, 1)
    const pastDays =
        (date.getTime() - firstJan.getTime()) / 86400000

    return Math.ceil((pastDays + firstJan.getDay() + 1) / 7)
}