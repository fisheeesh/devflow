import tickets from "@/app/database";
import { NextResponse } from "next/server";

//* /api/tickets
export async function GET() {
    return NextResponse.json(tickets)
}

//* From request, we can extract what we pass into the body
export async function POST(request: Request) {
    const ticket = await request.json()

    tickets.push({ id: tickets.length + 1, ...ticket })

    return NextResponse.json(tickets)
}

