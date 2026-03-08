import { FrontendNavbar } from "@/components/FrontendNavbar"
import { FrontendFooter } from "@/components/FrontendFooter"
import { AgeVerification } from "@/components/AgeVerification"

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col">
            <FrontendNavbar />
            <AgeVerification />
            <main className="flex-1 pt-[80px]">
                {children}
            </main>
            <FrontendFooter />
        </div>
    )
}
