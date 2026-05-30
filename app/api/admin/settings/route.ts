import { NextRequest, NextResponse } from "next/server"

// Simple in-memory settings (in production, store in database)
let platformSettings = {
  minDeposit: 50,
  minWithdraw: 10,
  withdrawalFee: 0,
  referralCommission: 15,
  mlmEnabled: true,
  tradingAutoUpdate: false,
}

export async function GET() {
  try {
    return NextResponse.json(platformSettings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validate settings
    if (data.minDeposit < 1) data.minDeposit = 1
    if (data.minWithdraw < 1) data.minWithdraw = 1
    if (data.withdrawalFee < 0) data.withdrawalFee = 0
    if (data.referralCommission < 0) data.referralCommission = 0
    
    platformSettings = { ...platformSettings, ...data }
    
    // In production, save to database here
    console.log("[Settings] Updated platform settings:", platformSettings)
    
    return NextResponse.json({ success: true, settings: platformSettings })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
