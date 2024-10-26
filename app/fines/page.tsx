import Fine, { FineProps } from "@/components/fines/fine";
import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";

export default async function FinesPage() {

    const session = await auth();

    // Check if user has access
    if (!session?.user.role.permissions.includes(permission.viewquotes)) {
        return (
            <div className="h-96 flex flex-col justify-center">
                <div className="text-center">
                    <h1 className="text-2xl">Du må være medlem for å kunne se dette sjef!</h1>
                    <p className="text-lg font-light">Bli medlem ved å... (husker ikke)</p>
                </div>
            </div>
        )
    }

    // Get all fines
    const fines = await fetch(`https://api.tihlde.org/groups/tihldebh/fines/`,
        {
            headers: {
                "method": "GET",
                "X-Csrf-Token": session.user.token
            }
        }
    )
        .then(res => res.json());

    return (
        <div className="w-screen flex flex-col">
            <div className="w-5/6 self-center">
                {fines.results.map((fine: any) => {
                    return (
                        <div className="m-4" key={fine.id}>
                            <Fine {...fine} user={fine.user} />
                        </div>
                    )
                })}
            </div>
        </div >
    )
}