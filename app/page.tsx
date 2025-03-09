import { Suspense } from "react"
import TransactionForm from "@/components/transaction-form"
import SpendingSummary from "@/components/spending-summary"
import SpendingCharts from "@/components/spending-charts"
import RecentTransactions from "@/components/recent-transactions"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#333333] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Personal Finance</h1>
            <p className="text-muted-foreground mt-1">Track your daily expenses with ease</p>
          </div>
          <TransactionForm />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
            <SpendingSummary />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <SpendingCharts />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <RecentTransactions />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

