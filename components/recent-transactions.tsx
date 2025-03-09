import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentTransactions } from "@/lib/transactions"
import { Badge } from "@/components/ui/badge"

export default async function RecentTransactions() {
  const transactions = await getRecentTransactions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No transactions yet</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{transaction.description || getCategoryLabel(transaction.category)}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(transaction.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </p>
                  {transaction.currency === "USD" && (
                    <p className="text-xs text-muted-foreground">≈ SGD {transaction.amountInSGD.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    food: "Food & Dining",
    transportation: "Transportation",
    shopping: "Shopping",
    entertainment: "Entertainment",
    utilities: "Utilities",
    health: "Health",
    travel: "Travel",
    other: "Other",
  }

  return categories[category] || "Other"
}

