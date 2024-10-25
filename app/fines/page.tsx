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
    return (
        <div>
            fines
        </div>
    )
}