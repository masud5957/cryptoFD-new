"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface QuickAction {
  label: string
  icon: React.ReactNode
  query: string
}

const quickActions: QuickAction[] = [
  { label: "How to earn?", icon: <MessageCircle className="w-3 h-3" />, query: "How do I earn money?" },
  { label: "Withdrawals", icon: <MessageCircle className="w-3 h-3" />, query: "How do I withdraw?" },
  { label: "FD Plans", icon: <MessageCircle className="w-3 h-3" />, query: "What are the FD plans?" },
  { label: "Fees", icon: <MessageCircle className="w-3 h-3" />, query: "What are the fees?" },
  { label: "Referrals", icon: <MessageCircle className="w-3 h-3" />, query: "How does referral work?" },
  { label: "Is it safe?", icon: <MessageCircle className="w-3 h-3" />, query: "Is my money safe?" },
]

const getResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase()

  if (lower.includes("earn") || lower.includes("roi") || lower.includes("return")) {
    return `**Daily Earnings with CryptoFD:**

- Starter Plan: 2% daily ROI
- Bronze Plan: 2.2% daily ROI
- Silver Plan: 2.5% daily ROI
- Gold Plan: 2.75% daily ROI
- Platinum Plan: 3% daily ROI
- Diamond Plan: 3.3% daily ROI

**How it works:**
1. Invest your USDT in any plan
2. Earn daily returns automatically
3. Withdraw earnings anytime
4. Principal returns after 30 days

Example: Invest $1,000 in Gold (2.75% daily)
- Day 1 earning: $27.50
- Day 30 total: ~$825

All earnings are 100% withdrawable!`
  }

  if (lower.includes("withdraw") || lower.includes("cash") || lower.includes("payout")) {
    return `**How to Withdraw:**

1. Go to Wallet > Withdraw
2. Enter your BEP-20 wallet address
3. Choose amount (minimum $10)
4. Confirm withdrawal request

**Withdrawal Details:**
- Processing time: ~1 hour
- Network: BSC (BEP-20)
- Platform fee: 3% of amount
- Example: Withdraw $1000 = $30 fee, receive $970

**Important:**
- FD principal unlocks after 30 days
- Daily earnings are always available
- Check wallet address before confirming`
  }

  if (lower.includes("plan") || lower.includes("investment")) {
    return `**6 CryptoFD Investment Plans (30-day duration):**

1. **Starter** - $50-$499 | 2% daily ROI
2. **Bronze** - $500-$1,999 | 2.2% daily ROI  
3. **Silver** - $2,000-$4,999 | 2.5% daily ROI
4. **Gold** - $5,000-$9,999 | 2.75% daily ROI
5. **Platinum** - $10,000-$49,999 | 3% daily ROI
6. **Diamond** - $50,000-$500,000 | 3.3% daily ROI

**All plans include:**
- Daily automatic earnings
- Withdrawable returns anytime
- 30-day lock-in for principal
- Full capital return on maturity
- No hidden fees`
  }

  if (lower.includes("fee") || lower.includes("cost") || lower.includes("charge")) {
    return `**CryptoFD Fee Structure:**

**Deposit:** FREE
- Network gas: ~$0.10 (paid to blockchain)

**Withdrawal:** 3% Platform Fee
- Deducted from withdrawal amount
- Includes network costs
- Example: Withdraw $1000 → $30 fee → Receive $970

**Investment:** FREE
- No fees to create FD
- No monthly charges
- All earnings go to you

**Referral:** 100% Commission
- Refer friends and earn
- Up to 10% of their daily earnings
- No fees on referral income`
  }

  if (lower.includes("referral") || lower.includes("refer") || lower.includes("commission")) {
    return `**CryptoFD Referral Program:**

**Earn Commission:**
- Up to 10% of referred user's daily earnings
- Unlimited earning potential
- Payments added to your wallet daily

**How to earn:**
1. Get your unique referral code
2. Share with friends
3. They invest using your code
4. You earn commissions automatically

**Example:**
- Friend invests $1,000 in Gold (2.75% daily)
- Their daily earning: $27.50
- Your 10% referral commission: $2.75/day
- Monthly: ~$82.50

**Referral Benefits:**
- Immediate earnings
- Lifetime commissions
- No limits on referrals
- 100% transparent tracking`
  }

  if (lower.includes("safe") || lower.includes("secure") || lower.includes("trust") || lower.includes("risk")) {
    return `**CryptoFD Security & Safety:**

**Platform Security:**
- Blockchain verified transactions
- Cold storage for funds
- Advanced encryption
- Regular security audits

**Your Protection:**
- 100% capital return guaranteed
- On-chain transaction verification
- Transparent smart contracts
- No hidden terms

**Risk Disclosure:**
- Crypto market volatility
- Platform operational risks
- Due diligence recommended

**Best Practices:**
- Use strong passwords
- Enable 2FA when available
- Keep wallet private
- Verify addresses carefully

For security concerns: support@cryptofd.com`
  }

  if (lower.includes("start") || lower.includes("begin") || lower.includes("new user")) {
    return `**Getting Started with CryptoFD:**

**Step 1: Sign Up (2 minutes)**
- Email and password
- Verify your email
- Done!

**Step 2: Deposit (5 minutes)**
- Go to Wallet > Deposit
- Copy your BEP-20 address
- Send USDT from exchange (min $10)
- Wait 2-5 minutes for confirmation

**Step 3: Invest (1 minute)**
- Click 'New Investment'
- Select a plan
- Enter amount
- Click Invest
- Start earning!

**Step 4: Earn & Withdraw (Daily)**
- Check Dashboard daily
- See your earnings grow
- Withdraw anytime
- Reinvest if you want

Everything takes less than 30 minutes!`
  }

  return `Hello! I'm CryptoFD Support Assistant. I can help you with:

**Popular topics:**
- 💰 How to earn money (2%-3.3% daily)
- 🏦 Investment plans (6 different options)
- 💳 Deposits & withdrawals
- 📊 Fee structure
- 👥 Referral program
- 🔒 Security & safety
- 🚀 Getting started

Ask me anything about CryptoFD! 👇`
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! I'm CryptoFD Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (userMessage?: string) => {
    const message = userMessage || input.trim()
    if (!message) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")

    // Simulate response delay
    setTimeout(() => {
      const response = getResponse(message)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date()
      }])
    }, 300)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background rounded-2xl shadow-2xl flex flex-col z-50 border border-border">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">CryptoFD Support</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.type === "bot" && (
              <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            )}
            <div
              className={cn(
                "px-3 py-2 rounded-lg max-w-xs break-words text-sm",
                message.type === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-secondary text-foreground rounded-bl-none"
              )}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {message.content.split('\n').map((line, idx) => (
                  line.startsWith('**') ? (
                    <strong key={idx}>{line.replace(/\*\*/g, '')}</strong>
                  ) : line.startsWith('-') || line.startsWith('1.') ? (
                    <div key={idx} className="ml-2">• {line.replace(/^[-\d.]+\s*/, '')}</div>
                  ) : (
                    <div key={idx}>{line}</div>
                  )
                ))}
              </div>
            </div>
            {message.type === "user" && (
              <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - Collapsible */}
      <div className="border-t border-border bg-secondary/30 flex-shrink-0">
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-full px-4 py-2 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <p className="text-xs font-medium text-muted-foreground">Quick questions</p>
          {showQuickActions ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showQuickActions && (
          <div className="px-4 pb-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs gap-1 h-7 rounded-full"
                onClick={() => handleSend(action.query)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border rounded-b-2xl flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your question..."
          className="text-sm"
        />
        <Button
          onClick={() => handleSend()}
          size="icon"
          className="h-9 w-9"
          disabled={!input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
