import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// Get recent trading activities
export async function GET() {
  try {
    const activities = await prisma.tradingActivity.findMany({
      orderBy: { timestamp: "desc" },
      take: 20,
    })

    return NextResponse.json(activities.map(a => ({
      id: a.id,
      crypto: a.crypto,
      action: a.action,
      amount: Number(a.amount),
      profit: a.profit ? Number(a.profit) : null,
      timestamp: a.timestamp,
    })))
  } catch (error) {
    console.error("Error fetching trading activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

// Create new trading activity
export async function POST(request: NextRequest) {
  try {
    const { crypto, action, amount, profit } = await request.json()

    if (!crypto || !action || amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const activity = await prisma.tradingActivity.create({
      data: {
        crypto,
        action,
        amount: parseFloat(amount),
        profit: profit !== undefined ? parseFloat(profit) : null,
      },
    })

    return NextResponse.json({
      id: activity.id,
      crypto: activity.crypto,
      action: activity.action,
      amount: Number(activity.amount),
      profit: activity.profit ? Number(activity.profit) : null,
      timestamp: activity.timestamp,
    })
  } catch (error) {
    console.error("Error creating trading activity:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}

// Delete trading activity
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing activity ID" }, { status: 400 })
    }

    await prisma.tradingActivity.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting trading activity:", error)
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 })
  }
}
