import { prisma } from "@/lib/db"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  try {
    let stats = await prisma.siteStats.findUnique({
      where: { id: "main" }
    })
    
    if (!stats) {
      stats = await prisma.siteStats.create({
        data: {
          id: "main",
          activeUsers: "10,000+",
          totalInvested: "$5M+",
          countries: "50+",
          yearsExp: "3+",
          supportEmail: "support@cryptofdforever.com"
        }
      })
    }
    
    return Response.json(stats)
  } catch (error) {
    console.error("[SiteStats] Error fetching stats:", error)
    return Response.json({ error: "Failed to fetch site stats" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthenticated = await isAdminAuthenticated()
    if (!isAuthenticated) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const stats = await prisma.siteStats.upsert({
      where: { id: "main" },
      update: {
        activeUsers: data.activeUsers,
        totalInvested: data.totalInvested,
        countries: data.countries,
        yearsExp: data.yearsExp,
        supportEmail: data.supportEmail,
      },
      create: {
        id: "main",
        activeUsers: data.activeUsers || "10,000+",
        totalInvested: data.totalInvested || "$5M+",
        countries: data.countries || "50+",
        yearsExp: data.yearsExp || "3+",
        supportEmail: data.supportEmail || "support@cryptofdforever.com"
      }
    })

    return Response.json({ success: true, data: stats })
  } catch (error) {
    console.error("[SiteStats] Error updating stats:", error)
    return Response.json({ error: "Failed to update site stats" }, { status: 500 })
  }
}
