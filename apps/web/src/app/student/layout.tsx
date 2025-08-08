"use client";
import MainNav from "@/components/own/Nav/MainNav";
import StudentSidebar from "@/components/own/StudentSidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useMediaQuery } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "PlaceNext",}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex flex-row w-full h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-50 lg:relative lg:block">
        <StudentSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-col w-full h-full">
        {/* Navigation Bar */}
        <header className="fixed top-0 z-30 w-full lg:w-[calc(100%-240px)] lg:left-[240px]">
          <MainNav />
        </header>

        {/* Page Content */}
        <section className="flex-1 pt-20 lg:pt-16 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="lg:ml-0 w-full">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
