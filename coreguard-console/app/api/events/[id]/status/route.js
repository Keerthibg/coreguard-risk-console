import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();

    const updated = await prisma.riskEvent.update({
      where: {
        id: params.id,
      },
      data: {
        status: body.status,
      },
    });

    await prisma.auditLog.create({
      data: {
        eventId: params.id,
        actor: "Operator",
        field: "status",
        oldValue: "Previous",
        newValue: body.status,
      },
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}