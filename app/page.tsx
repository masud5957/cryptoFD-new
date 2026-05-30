import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, TrendingUp, Zap, Shield, Gift, BarChart3 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "CryptoFD - Cryptocurrency Trading & Passive Income",
  description: "Generate passive income through crypto trading and referral program. Up to 5 levels of earnings.",
}

export default async function LandingPage() {
  const user = await getCurrentUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">C</div>
            <span className="font-bold text-lg">CryptoFD</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="w-fit">🚀 Crypto Trading Powered by AI</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Grow Your Wealth with <span className="text-blue-600">CryptoFD</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Generate passive income through algorithmic cryptocurrency trading. Earn 5-10% monthly returns plus unlimited referral commissions.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Start Earning Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#referral-program">
                <Button size="lg" variant="outline">
                  Learn About Referrals
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-2xl font-bold text-emerald-500">12,478+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">$1.24M+</p>
                <p className="text-sm text-muted-foreground">Trading Profit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">76.5%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 rounded-2xl p-8 border border-blue-600/20">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <BarChart3 className="w-32 h-32 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MLM Referral Program Section */}
      <section id="referral-program" className="bg-secondary/50 border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mx-auto">Multi-Level Income</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Unlimited Earning Potential</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build your network and earn from 5 levels of referrals. Passive income that grows with your team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Referral Commission Structure */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  Commission Structure
                </CardTitle>
                <CardDescription>Earn from every level of your referral network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { level: "Level 1", rate: "15%", desc: "Direct referrals" },
                  { level: "Level 2", rate: "10%", desc: "Secondary referrals" },
                  { level: "Level 3", rate: "8%", desc: "Tertiary referrals" },
                  { level: "Level 4", rate: "5%", desc: "Quaternary referrals" },
                  { level: "Level 5", rate: "2%", desc: "Quinary referrals" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-semibold">{item.level}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-500">{item.rate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  How It Works
                </CardTitle>
                <CardDescription>Simple steps to start earning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, title: "Join CryptoFD", desc: "Create account and make initial deposit" },
                  { step: 2, title: "Get Your Link", desc: "Share your unique referral code" },
                  { step: 3, title: "Invite Friends", desc: "Build your referral network" },
                  { step: 4, title: "Earn Passive Income", desc: "Receive commissions automatically" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Earning Example */}
          <Card className="border-emerald-600/20 bg-emerald-600/5">
            <CardHeader>
              <CardTitle className="text-emerald-600">Earning Example</CardTitle>
              <CardDescription>Potential monthly income from referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { level: "L1", referrals: 10, commission: "15%", monthly: "$1,500" },
                  { level: "L2", referrals: 20, commission: "10%", monthly: "$1,000" },
                  { level: "L3", referrals: 30, commission: "8%", monthly: "$960" },
                  { level: "L4", referrals: 40, commission: "5%", monthly: "$400" },
                  { level: "L5", referrals: 50, commission: "2%", monthly: "$200" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-secondary/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">{item.level}</p>
                    <p className="text-sm"><span className="font-bold">{item.referrals}</span> referrals</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.commission}</p>
                    <p className="text-lg font-bold text-emerald-600 mt-2">{item.monthly}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-emerald-600 mt-4 font-semibold">Total: $4,060/month potential</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto">Why Choose CryptoFD</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Complete Trading & Earning Solution</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "AI-Powered Trading", desc: "Algorithmic trading with 76.5% win rate" },
            { icon: TrendingUp, title: "5-10% Monthly Returns", desc: "Consistent passive income from trading" },
            { icon: Shield, title: "Secure & Regulated", desc: "Enterprise-grade security for your funds" },
            { icon: Users, title: "5-Level Referral", desc: "Unlimited network earning potential" },
            { icon: Gift, title: "Instant Payouts", desc: "Weekly withdrawal processing" },
            { icon: BarChart3, title: "Real-Time Dashboard", desc: "Track earnings and performance live" },
          ].map((item, i) => (
            <Card key={i} className="border-border">
              <CardHeader>
                <item.icon className="w-6 h-6 text-blue-600 mb-2" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Grow Your Wealth?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of investors earning passive income through trading and referrals.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="gap-2">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">C</div>
                <span className="font-bold">CryptoFD</span>
              </div>
              <p className="text-sm text-muted-foreground">Crypto trading made simple and profitable</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/dashboard/our-works" className="hover:text-foreground">Our Works</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><a href="mailto:support@cryptofd.com" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 CryptoFD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
