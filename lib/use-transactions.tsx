"use client"

import { useEffect, useState } from "react"
import { format, subDays, startOfWeek, subWeeks, subMonths } from "date-fns"
import type { Transaction } from "./transactions"

type ChartData = {
  name: string
  amount: number
}

type CategoryData = {
  name: string
  value: number
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [dailyData, setDailyData] = useState<ChartData[]>([])
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([])
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])

  useEffect(() => {
    // In a real app, this would be a fetch call to an API
    const storedTransactions = localStorage.getItem("transactions")
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }))
      setTransactions(parsedTransactions)
    }

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      const updatedTransactions = localStorage.getItem("transactions")
      if (updatedTransactions) {
        const parsedTransactions = JSON.parse(updatedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }))
        setTransactions(parsedTransactions)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Check for cookie changes every second (not ideal, but works for demo)
    const interval = setInterval(() => {
      const cookieTransactions = document.cookie.split("; ").find((row) => row.startsWith("transactions="))

      if (cookieTransactions) {
        const value = cookieTransactions.split("=")[1]
        if (value) {
          try {
            const parsedTransactions = JSON.parse(decodeURIComponent(value)).map((t: any) => ({
              ...t,
              date: new Date(t.date),
            }))

            // Only update if different
            if (JSON.stringify(parsedTransactions) !== JSON.stringify(transactions)) {
              setTransactions(parsedTransactions)
              localStorage.setItem("transactions", JSON.stringify(parsedTransactions))
            }
          } catch (e) {
            console.error("Failed to parse transactions from cookie", e)
          }
        }
      }
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (transactions.length === 0) {
      setDailyData([])
      setWeeklyData([])
      setMonthlyData([])
      setCategoryData([])
      return
    }

    // Prepare daily data (last 7 days)
    const daily: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, "MMM d")
      daily[dateStr] = 0
    }

    // Prepare weekly data (last 4 weeks)
    const weekly: Record<string, number> = {}
    for (let i = 3; i >= 0; i--) {
      const date = subWeeks(new Date(), i)
      const weekStart = startOfWeek(date)
      const weekStr = `Week ${format(weekStart, "w")}`
      weekly[weekStr] = 0
    }

    // Prepare monthly data (last 6 months)
    const monthly: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStr = format(date, "MMM")
      monthly[monthStr] = 0
    }

    // Prepare category data
    const categories: Record<string, number> = {}

    // Process transactions
    transactions.forEach((transaction) => {
      // Daily data
      const transactionDate = new Date(transaction.date)
      const dateStr = format(transactionDate, "MMM d")
      if (daily[dateStr] !== undefined) {
        daily[dateStr] += transaction.amountInSGD
      }

      // Weekly data
      const weekStart = startOfWeek(transactionDate)
      const weekStr = `Week ${format(weekStart, "w")}`
      if (weekly[weekStr] !== undefined) {
        weekly[weekStr] += transaction.amountInSGD
      }

      // Monthly data
      const monthStr = format(transactionDate, "MMM")
      if (monthly[monthStr] !== undefined) {
        monthly[monthStr] += transaction.amountInSGD
      }

      // Category data
      const categoryName = getCategoryLabel(transaction.category)
      if (!categories[categoryName]) {
        categories[categoryName] = 0
      }
      categories[categoryName] += transaction.amountInSGD
    })

    // Convert to chart data format
    setDailyData(Object.entries(daily).map(([name, amount]) => ({ name, amount })))
    setWeeklyData(Object.entries(weekly).map(([name, amount]) => ({ name, amount })))
    setMonthlyData(Object.entries(monthly).map(([name, amount]) => ({ name, amount })))
    setCategoryData(Object.entries(categories).map(([name, value]) => ({ name, value })))
  }, [transactions])

  return {
    transactions,
    dailyData,
    weeklyData,
    monthlyData,
    categoryData,
  }
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

