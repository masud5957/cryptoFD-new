import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
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

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", file)
    cloudinaryFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "")
    cloudinaryFormData.append("folder", "cryptofd-profiles")
    cloudinaryFormData.append("resource_type", "auto")

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    )

    if (!cloudinaryResponse.ok) {
      throw new Error("Cloudinary upload failed")
    }

    const cloudinaryData = await cloudinaryResponse.json()
    const imageUrl = cloudinaryData.secure_url

    // Update user profile with Cloudinary URL
    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: {
        profilePhoto: imageUrl,
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
    const user = await requireAuth()

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
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
