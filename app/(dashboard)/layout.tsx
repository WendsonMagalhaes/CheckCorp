import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthProvider } from "@/components/providers/session-provider"

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <AuthProvider>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </AuthProvider>
    )
}