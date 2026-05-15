import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const body = await req.json();

    const note = await prisma.note.create({
      data: {
        eventId: params.id,
        author: "Operator",
        text: body.text,
      },
    });

    return Response.json(note);
  } catch (error) {
    return Response.json(
      { error: "Failed to add note" },
      { status: 500 }
    );
  }
}