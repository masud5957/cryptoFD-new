"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, AlertCircle, CheckCircle, Plus, Minus, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    minDeposit: 50,
    minWithdraw: 10,
    withdrawalFee: 0,
    referralCommission: 15,
    mlmEnabled: true,
    tradingAutoUpdate: false,
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Configure platform parameters and features</p>
      </div>

      {message && (
        <Alert className={message.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}>
          {message.type === "success" ? 
            <CheckCircle className="h-4 w-4 text-green-500" /> :
            <AlertCircle className="h-4 w-4 text-red-500" />
          }
          <AlertDescription className={message.type === "success" ? "text-green-500" : "text-red-500"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Deposits Settings */}
        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Configuration</CardTitle>
              <CardDescription>Set minimum deposit amount and related parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum Deposit (USDT)</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, minDeposit: Math.max(1, settings.minDeposit - 10) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={settings.minDeposit}
                    onChange={(e) => setSettings({ ...settings, minDeposit: parseInt(e.target.value) || 0 })}
                    className="flex-1 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, minDeposit: settings.minDeposit + 10 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Current: ${settings.minDeposit} USDT</p>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-500 text-sm">
                  Minimum deposit affects new user onboarding. Users cannot deposit less than this amount.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals Settings */}
        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Configuration</CardTitle>
              <CardDescription>Set minimum withdrawal and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum Withdrawal (USDT)</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, minWithdraw: Math.max(1, settings.minWithdraw - 5) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={settings.minWithdraw}
                    onChange={(e) => setSettings({ ...settings, minWithdraw: parseInt(e.target.value) || 0 })}
                    className="flex-1 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, minWithdraw: settings.minWithdraw + 5 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Withdrawal Fee (%)</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, withdrawalFee: Math.max(0, settings.withdrawalFee - 1) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={settings.withdrawalFee}
                    onChange={(e) => setSettings({ ...settings, withdrawalFee: parseFloat(e.target.value) || 0 })}
                    className="flex-1 text-center"
                    step="0.1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, withdrawalFee: settings.withdrawalFee + 1 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referral Settings */}
        <TabsContent value="referral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral & MLM Configuration</CardTitle>
              <CardDescription>Manage commission rates and MLM program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Referral Commission Level 1 (%)</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, referralCommission: Math.max(0, settings.referralCommission - 1) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={settings.referralCommission}
                    onChange={(e) => setSettings({ ...settings, referralCommission: parseFloat(e.target.value) || 0 })}
                    className="flex-1 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettings({ ...settings, referralCommission: settings.referralCommission + 1 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Current: {settings.referralCommission}% commission on first level</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">MLM Program Status</label>
                <Button
                  variant={settings.mlmEnabled ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSettings({ ...settings, mlmEnabled: !settings.mlmEnabled })}
                >
                  {settings.mlmEnabled ? "MLM Program: ENABLED" : "MLM Program: DISABLED"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Auto Trading Updates</p>
                  <p className="text-sm text-muted-foreground">Automatically update trading stats</p>
                </div>
                <Button
                  variant={settings.tradingAutoUpdate ? "default" : "outline"}
                  onClick={() => setSettings({ ...settings, tradingAutoUpdate: !settings.tradingAutoUpdate })}
                >
                  {settings.tradingAutoUpdate ? "ON" : "OFF"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button
          size="lg"
          onClick={saveSettings}
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
