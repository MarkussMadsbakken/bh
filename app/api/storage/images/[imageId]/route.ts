
export async function POST(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}

export async function GET(req, ctx) {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
}