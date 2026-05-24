import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Users, 
  DollarSign, 
  TrendingUp,
  Crown,
  Medal,
  Award,
  ArrowDownToLine,
  Network,
  UserPlus
} from "lucide-react"
import { getTopDepositors, getTopTeamLeaders, getReferralStats, getAdminDashboardStats } from "@/lib/admin-queries"

export default async function AdminAnalyticsPage() {
  const [topDepositors, topTeamLeaders, referralStats, dashboardStats] = await Promise.all([
    getTopDepositors(10),
    getTopTeamLeaders(10),
    getReferralStats(),
    getAdminDashboardStats(),
  ])

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-amber-500" />
    if (index === 1) return <Medal className="h-5 w-5 text-slate-400" />
    if (index === 2) return <Award className="h-5 w-5 text-amber-700" />
    return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
  }

  const getRankColor = (index: number) => {
    if (index === 0) return "border-amber-500/50 bg-amber-500/5"
    if (index === 1) return "border-slate-400/50 bg-slate-400/5"
    if (index === 2) return "border-amber-700/50 bg-amber-700/5"
    return "border-border bg-card"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Top depositors and team leaders overview</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <ArrowDownToLine className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deposits</p>
              <p className="text-2xl font-bold text-green-500">
                ${dashboardStats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Network className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold text-foreground">{referralStats.totalReferrals}</p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Referral Earnings Paid</p>
              <p className="text-2xl font-bold text-foreground">
                ${referralStats.totalReferralEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Users with Referrals</p>
              <p className="text-2xl font-bold text-foreground">{referralStats.usersWithReferrals}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Level Breakdown */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Network className="h-5 w-5 text-violet-500" />
          Referral Network Breakdown
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <p className="text-sm text-muted-foreground">Level 1 (Direct)</p>
            <p className="text-2xl font-bold text-emerald-500">{referralStats.level1Referrals}</p>
            <p className="text-xs text-muted-foreground mt-1">5% commission</p>
          </div>
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <p className="text-sm text-muted-foreground">Level 2</p>
            <p className="text-2xl font-bold text-blue-500">{referralStats.level2Referrals}</p>
            <p className="text-xs text-muted-foreground mt-1">2% commission</p>
          </div>
          <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
            <p className="text-sm text-muted-foreground">Level 3</p>
            <p className="text-2xl font-bold text-violet-500">{referralStats.level3Referrals}</p>
            <p className="text-xs text-muted-foreground mt-1">1% commission</p>
          </div>
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Depositors */}
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-foreground">Top Depositors</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Users with highest total deposits</p>
          
          <div className="mt-4 space-y-3">
            {topDepositors.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No deposits yet</p>
            ) : (
              topDepositors.map((depositor, index) => (
                <div 
                  key={depositor.userId} 
                  className={`flex items-center justify-between rounded-xl border p-4 ${getRankColor(index)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {depositor.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {depositor.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">
                      ${depositor.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {depositor.depositCount} deposits
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top Team Leaders */}
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-500" />
            <h3 className="text-lg font-semibold text-foreground">Top Team Leaders</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Users with highest referral earnings</p>
          
          <div className="mt-4 space-y-3">
            {topTeamLeaders.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No referrals yet</p>
            ) : (
              topTeamLeaders.map((leader, index) => (
                <div 
                  key={leader.userId} 
                  className={`flex items-center justify-between rounded-xl border p-4 ${getRankColor(index)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {leader.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-xs">
                          {leader.directReferrals} direct
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {leader.totalTeamSize} total team
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-violet-500">
                      ${leader.referralEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      earned
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Combined Leaderboard */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Top Depositors - Detailed View</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Complete breakdown of top depositors</p>
        
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Rank</th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">User</th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Total Deposits</th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Deposits</th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Current Balance</th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Locked</th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {topDepositors.map((depositor, index) => (
                <tr key={depositor.userId} className="border-b border-border/50">
                  <td className="py-3">
                    <div className="flex h-8 w-8 items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="py-3">
                    <p className="font-medium text-foreground">{depositor.user?.name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">{depositor.user?.email}</p>
                  </td>
                  <td className="py-3 text-right font-bold text-green-500">
                    ${depositor.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-right text-foreground">{depositor.depositCount}</td>
                  <td className="py-3 text-right text-foreground">
                    ${depositor.user?.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </td>
                  <td className="py-3 text-right text-amber-500">
                    ${depositor.user?.lockedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </td>
                  <td className="py-3 text-right text-muted-foreground text-sm">
                    {depositor.user?.createdAt ? new Date(depositor.user.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
