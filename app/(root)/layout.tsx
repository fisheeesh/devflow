import LeftSideBar from '@/components/navigation/left-sidebar'
import Navbar from '@/components/navigation/navbar'
import RightSideBar from '@/components/navigation/right-sidebar'
import React, { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <main className="background-light850_dark100 realtive">
            <Navbar />

            <div className="flex">
                <LeftSideBar />

                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-32 max-md:pb-14 sm:px-14">
                    <div className="mx-auto w-full max-w-5xl">{children}</div>
                </section>

                <RightSideBar />
            </div>
        </main>
    )
}
