"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ROUTES from "@/constants/routes"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Props {
    type: string,
    itemId: string
}

export default function EditDeleteAction({ type, itemId }: Props) {
    const router = useRouter()

    const handleEdit = async () => {
        router.push(ROUTES.EDIT_QUESTION(itemId))
    }

    const handleDelete = async () => {
        if (type === 'Question') {
            // @TODO: Call API to delete question

            toast.success('Question deleted', {
                description: "Your question has been deleted successfully."
            })
        } else if (type === 'Answer') {
            // @TODO: Call API to delete answer

            toast.success("Answer deleted", {
                description: "Your answer has been deleted successfully."
            })
        }

    }

    return (
        <div className={`${type === 'Answer' && "gap-0 justify-center"} flex items-center justify-end gap-3 max-sm:w-full`}>
            {type === 'Question' && (
                <Image
                    src='/icons/edit.svg'
                    alt="Edit"
                    width={14}
                    height={14}
                    className="cursor-pointer object-contain"
                    onClick={handleEdit}
                />
            )}
            <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer">
                    <Image
                        src='/icons/trash.svg'
                        alt="Trash"
                        width={14}
                        height={14}
                    />
                </AlertDialogTrigger>
                <AlertDialogContent className="background-light800_dark300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your <b>{type === "Question" ? "question " : "answer "} </b>
                            and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="!border-primary-100 !bg-primary-500 !text-light-800">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
