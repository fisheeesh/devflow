"use client"

import cat from '@/app/lottie/cat.json';
import Lottie from "lottie-react";
import Link from "next/link";

function NotFound() {
    return (
        <div className='min-h-screen flex items-center text-sm px-8 md:text-base justify-center text-center flex-col'>
            <Lottie
                animationData={cat}
                loop={true}
                autoplay={true}
                style={{ width: '500px', height: '280px' }}
            />
            <p className='font-medium text-7xl'>404</p>
            <p className='max-w-sm mx-auto mb-5 text-dark100_light900'>The page you are looking for doesn&apos;t exist. Please return to the homepage.</p>
            <Link href='/' className='font-medium primary-text-gradient'>
                &larr; Go Back
            </Link>
        </div>
    );
}

export default NotFound;



