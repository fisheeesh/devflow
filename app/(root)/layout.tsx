import Navbar from '@/components/navigation/navbar'
import React, { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}
