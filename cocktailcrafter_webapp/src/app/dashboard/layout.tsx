import { DashboardSidebar } from "@/components/DashboardSidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#0b0c10] text-white">
            <DashboardSidebar />
            <main className="flex-1 md:ml-64 relative">
                {/* Decorative glows shared across dashboard */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00d2ff] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>
                {children}
            </main>
        </div>
    )
}
