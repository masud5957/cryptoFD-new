import { prisma } from "@/lib/db"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { revalidateTag } from "next/cache"

export async function GET() {
  try {
    console.log("[SiteStats API] GET request started")
    let stats = await prisma.siteStats.findUnique({
      where: { id: "main" }
    })
    
    if (!stats) {
      console.log("[SiteStats API] No stats found, creating defaults")
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
    
    console.log("[SiteStats API] Returning stats:", stats)
    return Response.json(stats)
  } catch (error) {
    console.error("[SiteStats API] Error fetching stats:", error)
    return Response.json({ error: "Failed to fetch site stats" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    console.log("[SiteStats API] PUT request started")
    const isAuthenticated = await isAdminAuthenticated()
    if (!isAuthenticated) {
      console.log("[SiteStats API] Unauthorized access attempt")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("[SiteStats API] Updating with data:", data)

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

    console.log("[SiteStats API] Updated successfully, revalidating cache")
    // Revalidate the about page to show new stats
    revalidateTag("site-stats", "max")
    
    return Response.json({ success: true, data: stats })
  } catch (error) {
    console.error("[SiteStats API] Error updating stats:", error)
    return Response.json({ error: "Failed to update site stats" }, { status: 500 })
  }
}
