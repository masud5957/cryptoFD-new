import { PrismaClient } from "@prisma/client"

// Force new instance with current DATABASE_URL - timestamp: 2026-06-02T12:00:00Z
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Always create a fresh instance to pick up new DATABASE_URL
// Don't reuse cached instance when environment changes
if (process.env.NODE_ENV === "development") {
  // In development, always use a fresh instance
  if (globalForPrisma.prisma) {
    globalForPrisma.prisma.$disconnect()
  }
  globalForPrisma.prisma = undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

// Helper function to increment balance with proper connection handling
export async function incrementBalance(userId: string, amount: number) {
  return prisma.profile.update({
    where: { id: userId },
    data: { walletBalance: { increment: amount } },
  })
}
