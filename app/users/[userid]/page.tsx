
export default async function User({ params }: { params: { userid: string } }) {
    const p = await params

    return (
        <div className="">
            {p.userid}
        </div>
    );
}