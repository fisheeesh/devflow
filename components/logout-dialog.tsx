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
import { LogOut } from "lucide-react"
import { useTransition } from "react"
import Spinner from "./spinner"

export default function LogoutDialog() {
    const [isPending, startTrnasition] = useTransition()
    const handleSignOut = () => {
        startTrnasition(async () => await signOutUser())
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="small-medium cursor-pointer btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                >
                    <LogOut className='size-5 text-black dark:text-white' />
                    <span className='text-dark300_light900'>Logout</span>
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
                        <Button disabled={isPending} type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant='destructive'
                        onClick={handleSignOut}
                        disabled={isPending}
                        type="submit">
                        {isPending ? <Spinner label="Logging out" /> : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
