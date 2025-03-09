import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDailySpending, getWeeklySpending, getMonthlySpending } from "@/lib/transactions"

export default async function SpendingSummary() {
  const dailyTotal = await getDailySpending()
  const weeklyTotal = await getWeeklySpending()
  const monthlyTotal = await getMonthlySpending()

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">SGD {dailyTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {dailyTotal > 0
              ? `${dailyTotal > weeklyTotal / 7 ? "↑" : "↓"} ${Math.abs(((dailyTotal / (weeklyTotal / 7)) * 100 - 100).toFixed(0))}% vs. daily average`
              : "No spending recorded today"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">SGD {weeklyTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {weeklyTotal > 0
              ? `${weeklyTotal > monthlyTotal / 4 ? "↑" : "↓"} ${Math.abs(((weeklyTotal / (monthlyTotal / 4)) * 100 - 100).toFixed(0))}% vs. weekly average`
              : "No spending recorded this week"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">SGD {monthlyTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {monthlyTotal > 0 ? `${new Date().getDate()} days so far` : "No spending recorded this month"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

