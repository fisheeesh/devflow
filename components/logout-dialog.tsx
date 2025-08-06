"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { signOutUser } from "@/lib/actions/auth.actions"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"
import { useTransition } from "react"
import Spinner from "./spinner"

export default function LogoutDialog({ isMobileNav = false }: { isMobileNav?: boolean }) {
    const [isPending, startTransition] = useTransition()
    const handleSignOut = () => {
        startTransition(async () => await signOutUser())
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="small-medium cursor-pointer btn-secondary min-h-[42px] w-full rounded-lg p-4 shadow-none"
                >
                    <LogOut className='size-5 text-black dark:text-white' />
                    <span className={cn(!isMobileNav && 'max-lg:hidden', 'text-dark300_light900')}>Logout</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] background-light700_dark300 border-none">
                <DialogHeader>
                    <DialogTitle className="text-primary-500 text-2xl font-bold">Logout Confirmation.</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to logout?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isPending} type="button" variant="outline" className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button
                        className="cursor-pointer"
                        variant='destructive'
                        onClick={handleSignOut}
                        disabled={isPending}
                        type="submit">
                        <Spinner isLoading={isPending} label="Logging out...">
                            Confirm
                        </Spinner>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
