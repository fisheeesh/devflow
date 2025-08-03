'use client'

import cat from '@/app/lottie/cat.json';
import Lottie from "lottie-react"

export default function CatLottie({ width = "480px", height = "280px" }: { width?: string, height?: string }) {
    return (
        <Lottie
            animationData={cat}
            loop={true}
            autoplay={true}
            style={{ width, height }}
        />
    )
}
