import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Premium modern fonts
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CocktailCrafter | Professional Mixology Tools",
  description: "Craft premium cocktails with precision using our advanced mixology patterns and database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" defer></script>
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[#0b0c10] text-white selection:bg-[#00d2ff]/30`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-15%] right-[-5%] w-[40%] h-[40%] bg-[#00d2ff]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-[#3a7bd5]/5 blur-[100px] rounded-full"></div>
        </div>
        <div className="relative z-10">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
