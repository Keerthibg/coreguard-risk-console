import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await prisma.riskEvent.count();

    return Response.json({
      status: "ok",
      database: "connected",
    });
  } catch {
    return Response.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 500 }
    );
  }
}