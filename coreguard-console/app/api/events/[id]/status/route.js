import { prisma } from "@/lib/prisma";

export async function PATCH(req, context) {
    const params = await context.params;
  try {
    const body = await req.json();
    const newStatus = body.status;
    const role = body.role || "operator";

    if (newStatus === "Resolved" && role !== "manager") {
      return Response.json(
        { error: "Operators cannot resolve events" },
        { status: 403 }
      );
    }

    const existing = await prisma.riskEvent.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return Response.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.riskEvent.update({
      where: { id: params.id },
      data: { status: newStatus },
    });

    await prisma.auditLog.create({
      data: {
        eventId: params.id,
        actor: role,
        field: "status",
        oldValue: existing.status,
        newValue: newStatus,
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