import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

export default async function Home() {
  const session = await auth()

  console.log(session)
  return (
    <>
      <form action={async () => {
        "use server"
        await signOut({
          redirectTo: ROUTES.SIGN_IN
        })
      }} className="px-10 pt-[100px]">
        <Button type="submit">Log Out</Button>
      </form>
    </>
  );
}
