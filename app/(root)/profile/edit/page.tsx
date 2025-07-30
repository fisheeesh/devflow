import { auth } from "@/auth"
import ProfileForm from "@/components/forms/profile-form"
import ROUTES from "@/constants/routes"
import { getUser } from "@/lib/actions/user.actions"
import { User } from "@/types/global"
import { redirect } from "next/navigation"

export default async function ProfileEditPage() {
    const session = await auth()

    if (!session?.user?.id) redirect(ROUTES.SIGN_IN)

    const { success, data } = await getUser({ userId: session?.user?.id })
    if (!success) redirect(ROUTES.SIGN_IN)

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

            <ProfileForm user={data?.user as User} />
        </div>
    )
}
