"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Copy, 
  Share2, 
  Gift, 
  Users, 
  DollarSign,
  Award,
  CheckCircle
} from "lucide-react"

interface LevelEarning {
  level: number
  referrals: number
  earnings: number
  commission: number
}

interface ReferralClientProps {
  referralCode: string
  totalEarnings: number
  totalReferrals: number
  levelEarnings: LevelEarning[]
}

const howItWorks = [
  { step: 1, title: "Share Your Link", description: "Share your unique referral link with friends and family" },
  { step: 2, title: "They Join & Invest", description: "When they sign up and create a fixed deposit" },
  { step: 3, title: "You Earn Commission", description: "Earn up to 5% commission on their investments" },
]

const levelColors: Record<number, string> = {
  1: "bg-primary/10 text-primary",
  2: "bg-blue-500/10 text-blue-500",
  3: "bg-cyan-500/10 text-cyan-500",
  4: "bg-purple-500/10 text-purple-500",
  5: "bg-orange-500/10 text-orange-500",
}

export function ReferralClient({ 
  referralCode, 
  totalEarnings, 
  totalReferrals,
  levelEarnings 
}: ReferralClientProps) {
  const [copied, setCopied] = useState(false)
  const referralLink = typeof window !== "undefined" 
    ? `${window.location.origin}/auth/sign-up?ref=${referralCode}`
    : `/auth/sign-up?ref=${referralCode}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join CryptoFD",
          text: `Join CryptoFD using my referral code ${referralCode} and start earning daily interest!`,
          url: referralLink,
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      handleCopy(referralLink)
    }
  }

  // Fill in default levels if not present (all 5 levels for MLM)
  const displayLevels = Array.from({ length: 5 }, (_, i) => {
    const level = i + 1
    const found = levelEarnings.find((l) => l.level === level)
    const commissionRates = [15, 10, 8, 5, 2]
    return found || { level, referrals: 0, earnings: 0, commission: commissionRates[i] }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Referral Program</h1>
        <p className="mt-1 text-muted-foreground">
          Invite friends and earn up to 5% commission on their investments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
              <p className="text-xl font-bold text-green-500">
                ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
              <p className="text-xl font-bold text-foreground">{totalReferrals}</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Gift className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Direct Referrals</p>
              <p className="text-xl font-bold text-foreground">
                {displayLevels[0]?.referrals || 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <Award className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Commission Rate</p>
              <p className="text-xl font-bold text-foreground">Up to 5%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Your Referral Link</h3>
            <p className="text-sm text-muted-foreground">Share this link to invite new users</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Referral Code</label>
            <div className="mt-2 flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="bg-secondary/50 font-mono text-lg font-bold"
              />
              <Button variant="secondary" onClick={() => handleCopy(referralCode)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Referral Link</label>
            <div className="mt-2 flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-secondary/50 text-muted-foreground"
              />
              <Button variant="secondary" onClick={() => handleCopy(referralLink)}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => handleCopy(referralLink)} className="flex-1 gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="secondary" onClick={handleShare} className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Level-wise Earnings */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Earnings by Level (5-Tier System)</h3>
        
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {displayLevels.map((level) => (
            <div key={level.level} className="rounded-xl bg-secondary/30 p-4 border border-border/50 hover:border-primary/50 transition">
              <div className="flex items-center justify-between mb-2">
                <Badge className={levelColors[level.level]}>L{level.level}</Badge>
                <span className="text-xs font-bold text-green-500">{level.commission}%</span>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  ${level.earnings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {level.referrals} referrals
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Commission Structure Explanation */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <h4 className="font-semibold text-foreground mb-3">MLM Commission Structure</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Level 1 (Direct Referrals):</span>
              <span className="font-bold text-foreground">15% commission</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Level 2 (2nd Generation):</span>
              <span className="font-bold text-foreground">10% commission</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Level 3 (3rd Generation):</span>
              <span className="font-bold text-foreground">8% commission</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Level 4 (4th Generation):</span>
              <span className="font-bold text-foreground">5% commission</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Level 5 (5th Generation):</span>
              <span className="font-bold text-foreground">2% commission</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">How It Works</h3>
        
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {howItWorks.map((item) => (
            <div key={item.step} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-green-500/10 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-500">No limits on referral earnings!</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The more you refer, the more you earn. There&apos;s no cap on your referral income.
          </p>
        </div>
      </Card>
    </div>
  )
}
