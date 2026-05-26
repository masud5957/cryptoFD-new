import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Profile, Transaction, FDPlan, UserFD } from "@/lib/types"

// Type for FD with relations
export type UserFdWithRelations = UserFD & {
  plan: FDPlan
  user?: {
    id: string
    name: string | null
    walletBalance: number
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.isAdmin === true
}

export async function getAdminDashboardStats() {
  // Get total users
  const totalUsers = await prisma.profile.count()
  
  // Get total deposits (completed)
  const deposits = await prisma.transaction.findMany({
    where: { type: "deposit", status: "completed" },
    select: { amount: true }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalDeposits = deposits.reduce((acc: number, d: any) => acc + Math.abs(Number(d.amount)), 0)
  
  // Get total withdrawals (completed)
  const withdrawals = await prisma.transaction.findMany({
    where: { type: "withdrawal", status: "completed" },
    select: { amount: true }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalWithdrawals = withdrawals.reduce((acc: number, w: any) => acc + Math.abs(Number(w.amount)), 0)
  
  // Get active FDs
  const activeFDs = await prisma.userFd.findMany({
    where: { status: "active" },
    select: { amount: true }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalActiveInvestment = activeFDs.reduce((acc: number, fd: any) => acc + Number(fd.amount), 0)
  const activeFDCount = activeFDs.length
  
  // Get pending withdrawals
  const pendingWithdrawals = await prisma.transaction.count({
    where: { type: "withdrawal", status: "pending" }
  })
  
  // Get pending deposits
  const pendingDeposits = await prisma.transaction.count({
    where: { type: "deposit", status: "pending" }
  })
  
  return {
    totalUsers,
    totalDeposits,
    totalWithdrawals,
    totalActiveInvestment,
    activeFDCount,
    pendingWithdrawals,
    pendingDeposits,
  }
}

export async function getAllUsers(limit?: number): Promise<Profile[]> {
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    take: limit || undefined
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return users.map((u: any) => ({
    ...u,
    walletBalance: Number(u.walletBalance),
    lockedBalance: Number(u.lockedBalance),
    totalEarnings: Number(u.totalEarnings),
    referralEarnings: Number(u.referralEarnings),
  }))
}

export async function getAllTransactions(limit?: number, status?: string, type?: string): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(type ? { type } : {})
    },
    orderBy: { createdAt: "desc" },
    take: limit || undefined
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transactions.map((t: any) => ({
    ...t,
    amount: Number(t.amount),
  }))
}

export async function getAllFDs(status?: string): Promise<UserFdWithRelations[]> {
  const fds = await prisma.userFd.findMany({
    where: status ? { status } : {},
    include: {
      plan: true,
      user: {
        select: { id: true, name: true, walletBalance: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fds.map((fd: any) => ({
    ...fd,
    amount: Number(fd.amount),
    dailyEarning: Number(fd.dailyEarning),
    totalEarned: Number(fd.totalEarned),
    plan: {
      ...fd.plan,
      minAmount: Number(fd.plan.minAmount),
      maxAmount: Number(fd.plan.maxAmount),
      dailyRoi: Number(fd.plan.dailyRoi),
    },
    user: fd.user ? {
      ...fd.user,
      walletBalance: Number(fd.user.walletBalance)
    } : undefined
  }))
}

export async function getUserById(userId: string): Promise<Profile | null> {
  const user = await prisma.profile.findUnique({
    where: { id: userId }
  })
  if (!user) return null
  return {
    ...user,
    walletBalance: Number(user.walletBalance),
    lockedBalance: Number(user.lockedBalance),
    totalEarnings: Number(user.totalEarnings),
    referralEarnings: Number(user.referralEarnings),
  }
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transactions.map((t: any) => ({
    ...t,
    amount: Number(t.amount),
  }))
}

export async function getUserFDs(userId: string): Promise<UserFdWithRelations[]> {
  const fds = await prisma.userFd.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fds.map((fd: any) => ({
    ...fd,
    amount: Number(fd.amount),
    dailyEarning: Number(fd.dailyEarning),
    totalEarned: Number(fd.totalEarned),
    plan: {
      ...fd.plan,
      minAmount: Number(fd.plan.minAmount),
      maxAmount: Number(fd.plan.maxAmount),
      dailyRoi: Number(fd.plan.dailyRoi),
    }
  }))
}

export async function getAdminFDPlans(): Promise<FDPlan[]> {
  const plans = await prisma.fdPlan.findMany({
    orderBy: { minAmount: "asc" }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return plans.map((p: any) => ({
    ...p,
    minAmount: Number(p.minAmount),
    maxAmount: Number(p.maxAmount),
    dailyRoi: Number(p.dailyRoi),
  }))
}

// Analytics: Top depositors by total deposits
export async function getTopDepositors(limit: number = 10) {
  const deposits = await prisma.transaction.groupBy({
    by: ['userId'],
    where: { 
      type: 'deposit', 
      status: 'completed' 
    },
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: limit
  })
  
  // Get user details
  const userIds = deposits.map(d => d.userId)
  const users = await prisma.profile.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, createdAt: true, walletBalance: true, lockedBalance: true }
  })
  
  const userMap = new Map(users.map(u => [u.id, u]))
  
  return deposits.map(d => ({
    userId: d.userId,
    totalDeposits: Number(d._sum.amount) || 0,
    depositCount: d._count.id,
    user: userMap.get(d.userId) ? {
      name: userMap.get(d.userId)!.name,
      email: userMap.get(d.userId)!.email,
      createdAt: userMap.get(d.userId)!.createdAt,
      walletBalance: Number(userMap.get(d.userId)!.walletBalance),
      lockedBalance: Number(userMap.get(d.userId)!.lockedBalance),
    } : null
  }))
}

// Analytics: Top team leaders by referral count and earnings
export async function getTopTeamLeaders(limit: number = 10) {
  // Get referral counts for each referrer (level 1 direct referrals)
  const referralCounts = await prisma.referral.groupBy({
    by: ['referrerId'],
    where: { level: 1 },
    _count: { id: true }
  })
  
  // Get all referrals for team size calculation (all levels)
  const allReferrals = await prisma.referral.groupBy({
    by: ['referrerId'],
    _count: { id: true }
  })
  
  // Get user details with referral earnings
  const referrerIds = [...new Set([...referralCounts.map(r => r.referrerId), ...allReferrals.map(r => r.referrerId)])]
  const users = await prisma.profile.findMany({
    where: { id: { in: referrerIds } },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      referralEarnings: true, 
      createdAt: true,
      walletBalance: true
    }
  })
  
  const userMap = new Map(users.map(u => [u.id, u]))
  const directReferralMap = new Map(referralCounts.map(r => [r.referrerId, r._count.id]))
  const totalTeamMap = new Map(allReferrals.map(r => [r.referrerId, r._count.id]))
  
  // Build the result array sorted by referral earnings
  const result = users
    .map(user => ({
      userId: user.id,
      name: user.name,
      email: user.email,
      directReferrals: directReferralMap.get(user.id) || 0,
      totalTeamSize: totalTeamMap.get(user.id) || 0,
      referralEarnings: Number(user.referralEarnings),
      walletBalance: Number(user.walletBalance),
      createdAt: user.createdAt
    }))
    .sort((a, b) => b.referralEarnings - a.referralEarnings)
    .slice(0, limit)
  
  return result
}

// Analytics: Get overall platform referral stats
export async function getReferralStats() {
  const totalReferrals = await prisma.referral.count()
  const level1Referrals = await prisma.referral.count({ where: { level: 1 } })
  const level2Referrals = await prisma.referral.count({ where: { level: 2 } })
  const level3Referrals = await prisma.referral.count({ where: { level: 3 } })
  
  // Total referral earnings paid out
  const referralTransactions = await prisma.transaction.findMany({
    where: { type: 'referral_commission', status: 'completed' },
    select: { amount: true }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalReferralEarnings = referralTransactions.reduce((acc: number, t: any) => acc + Number(t.amount), 0)
  
  // Users with at least one referral
  const usersWithReferrals = await prisma.referral.groupBy({
    by: ['referrerId'],
    _count: { id: true }
  })
  
  return {
    totalReferrals,
    level1Referrals,
    level2Referrals,
    level3Referrals,
    totalReferralEarnings,
    usersWithReferrals: usersWithReferrals.length
  }
}

// Get all withdrawal requests
export async function getWithdrawalRequests() {
  const requests = await prisma.withdrawalRequest.findMany({
    orderBy: { createdAt: "desc" }
  })
  return requests
}
