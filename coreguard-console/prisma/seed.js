const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.note.deleteMany();
  await prisma.timeline.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.riskEvent.deleteMany();

  const severities = ["Critical", "High", "Medium", "Low"];
  const statuses = ["Open", "Reviewed", "Escalated"];
  const suppliers = [
    "NexTek",
    "Volt Systems",
    "Apex Components",
    "Orion Manufacturing",
    "SkyShield",
  ];

  for (let i = 1; i <= 25; i++) {
    await prisma.riskEvent.create({
      data: {
        supplier: suppliers[i % suppliers.length],
        part: `Asset-${i}`,
        severity: severities[i % severities.length],
        status: statuses[i % statuses.length],
        owner: i % 2 === 0 ? "Alice" : "Bob",
        summary: `Risk event ${i} detected in supply chain`,
        detectedAt: new Date(Date.now() - i * 3600000),
        source: i % 2 === 0 ? "Vendor Feed" : "Threat Intel",
        recommendedAction: "Investigate and review supplier activity",

        evidence: {
          create: [
            {
              title: "Security Report",
              text: "Suspicious supplier activity detected",
              link: "https://example.com/report",
            },
          ],
        },

        notes: {
          create: [
            {
              author: "System",
              text: "Initial event created",
            },
          ],
        },

        timelines: {
          create: [
            {
              title: "Event Detected",
              detail: "Risk detected by monitoring system",
            },
          ],
        },

        audits: {
          create: [
            {
              actor: "System",
              field: "status",
              oldValue: "None",
              newValue: "Open",
            },
          ],
        },
      },
    });
  }

  console.log("Seeded 25 risk events");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });