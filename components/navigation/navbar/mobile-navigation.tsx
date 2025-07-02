import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import ROUTES from "@/constants/routes"
import Image from "next/image"
import Link from "next/link"
import NavLinks from "./nav-links"
import { auth, signOut } from "@/auth"
import { LogOut } from "lucide-react"

export default async function MobileNavigation() {
    const session = await auth()
    const userId = session?.user?.id

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image src='/icons/hamburger.svg' alt="Menu" width={36} height={36} className="invert-colors sm:hidden cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left" className="background-light900_dark200 border-none p-6">
                <SheetTitle className="hidden">Navigation</SheetTitle>
                <SheetClose asChild>
                    <Link href={'/'} className="flex items-center gap-1">
                        <Image src={'/images/site-logo.svg'} width={23} height={23} alt="DevFlow Logo" />

                        <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900'>
                            Dev<span className='text-primary-500'>Flow</span>
                        </p>
                    </Link>
                </SheetClose>
                <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
                    <section className="h-full gap-3 pt-8 flex flex-col">
                        <NavLinks isMobileNav />
                    </section>

                    <div className="flex flex-col gap-3">
                        {userId ? (
                            <SheetClose asChild>
                                <form action={async () => {
                                    "use server"
                                    await signOut()
                                }}>
                                    <Button
                                        type='submit'
                                        className="small-medium cursor-pointer btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                                    >
                                        <LogOut className='size-5 text-black dark:text-white' />
                                        <span className='text-dark300_light900'>Logout</span>
                                    </Button>
                                </form>
                            </SheetClose>
                        ) : (
                            <>
                                <SheetClose asChild>
                                    <Link href={ROUTES.SIGN_IN}>
                                        <Button className="small-medium cursor-pointer btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                            <span className="primary-text-gradient">Log In</span>
                                        </Button>
                                    </Link>
                                </SheetClose>

                                <SheetClose asChild>
                                    <Link href={ROUTES.SIGN_UP}>
                                        <Button className="small-medium cursor-pointer light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
