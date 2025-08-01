"use client"

import cat from '@/app/lottie/cat.json';
import Lottie from "lottie-react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error() {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push('/')
        }, 3000)
    }, [router])

    return (
        <div className='min-h-screen flex items-center text-sm px-8 md:text-base justify-center text-center flex-col'>
            <Lottie
                animationData={cat}
                loop={true}
                autoplay={true}
                style={{ width: '480px', height: '280px' }}
            />
            <p className='font-medium text-7xl'>500</p>
            <h1 className='mb-3 max-w-sm mx-auto text-dark100_light900'>Something went wrong on our end. Please try refreshing the page or come back later.</h1>
        </div>
    );
}
;



