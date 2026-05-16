import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  const events = await prisma.riskEvent.findMany({
    orderBy: {
      detectedAt: "desc",
    },
    include: {
      evidence: true,
      notes: true,
      audits: true,
      timelines: true,
    },
  });

  return Response.json(events);
}