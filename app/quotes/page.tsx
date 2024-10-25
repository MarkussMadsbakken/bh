import { permission } from "@/types/permissions";
import { auth } from "@/util/auth";

export default async function FinesPage() {
    const session = await auth();

    // Check if user has access
    if (!session?.user.role.permissions.includes(permission.viewquotes)) {
        return (
            <div className="h-96 flex flex-col justify-center">
                <div className="text-center">
                    <h1 className="text-2xl">Her har du ikke tilgang 😬</h1>
                    <p className="text-lg font-light">Logg deg inn og prøv på nytt</p>
                </div>
            </div>
        )
    }


    return (
        <div>
            quotes
        </div>
    )
}