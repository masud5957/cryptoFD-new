import { OurWorksContent } from "@/components/dashboard/our-works-content"
import { getTradingStats, getMonthlyTradingRecords, getTodayProfit, getTradingActivities } from "@/lib/trading-stats"

export const metadata = {
  title: "Our Works - CryptoFD",
  description: "See how CryptoFD generates returns through cryptocurrency trading",
}

export const revalidate = 30 // Revalidate every 30 seconds to show admin updates quickly

export default async function OurWorksPage() {
  const [stats, monthlyRecords, todayProfit, activities] = await Promise.all([
    getTradingStats(),
    getMonthlyTradingRecords(),
    getTodayProfit(),
    getTradingActivities(20),
  ])
  
  return (
    <OurWorksContent 
      initialStats={stats}
      monthlyRecords={monthlyRecords}
      todayProfit={todayProfit}
      tradingActivities={activities}
    />
  )
}
