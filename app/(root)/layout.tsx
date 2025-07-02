import LeftSideBar from '@/components/navigation/left-sidebar'
import Navbar from '@/components/navigation/navbar'
import RightSideBar from '@/components/navigation/right-sidebar'
import React, { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <main className="relative h-screen overflow-hidden">
            <Navbar />

            <div className="flex h-full pt-20">
                <LeftSideBar />

                <section className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 pt-12 max-md:pb-14 sm:px-14">
                    <div className="mx-auto w-full max-w-5xl">{children}</div>
                </section>

                <RightSideBar />
            </div>
        </main>
    )
}
