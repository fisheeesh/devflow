import ROUTES from '@/constants/routes'
import Link from 'next/link'

import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { cn, getInitials } from '@/lib/utils'

interface Props {
    id: string,
    name: string,
    imageUrl?: string | null,
    className?: string,
    fallbackClassName?: string
}

export default function UserAvatar(
    { id, name, imageUrl, className = 'h-9 w-9', fallbackClassName }: Props
) {

    return (
        <Link href={ROUTES.PROFILE(id)}>
            <Avatar className={cn('relative', className)}>
                {
                    imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            className='object-cover'
                            fill
                            quality={100}
                        />
                    ) : (
                        <AvatarFallback className={cn(fallbackClassName, 'primary-gradient font-space-grotesk font-bold tracking-wider text-white')}>
                            {getInitials(name)}
                        </AvatarFallback>
                    )
                }
            </Avatar>
        </Link>
    )
}
