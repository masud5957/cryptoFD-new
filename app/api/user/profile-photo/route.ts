import { prisma } from "@/lib/db"
import { requireAuthSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await requireAuthSession()
    const formData = await request.formData()
    const file = formData.get("photo") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "Invalid file type. Only JPG, PNG, and WebP allowed" }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json({ error: "File too large. Maximum 5MB allowed" }, { status: 400 })
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Update user profile with photo
    const profile = await prisma.profile.update({
      where: { email: session.user?.email! },
      data: {
        profilePhoto: dataUrl,
      },
    })

    return Response.json({
      success: true,
      message: "Photo uploaded successfully",
      photo: profile.profilePhoto,
    })
  } catch (error) {
    console.error("Photo upload error:", error)
    return Response.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuthSession()

    const profile = await prisma.profile.findUnique({
      where: { email: session.user?.email! },
      select: { profilePhoto: true },
    })

    return Response.json({
      photo: profile?.profilePhoto || null,
    })
  } catch (error) {
    console.error("Photo fetch error:", error)
    return Response.json({ error: "Failed to fetch photo" }, { status: 500 })
  }
}
