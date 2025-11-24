import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { FirstTimeModal } from "@/components/features/FirstTimeModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Nexora Learn | Adaptive Coding",
  description: "AI-Powered Offline Coding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} bg-background text-text-main antialiased selection:bg-primary/30`}>
        <Navbar />
        <FirstTimeModal />
        <main className="pt-20 min-h-screen">
            {children}
        </main>
        <Toaster 
            position="bottom-right"
            toastOptions={{
                style: {
                    background: '#1E2738',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }}
        />
      </body>
    </html>
  );
}
