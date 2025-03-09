"use server"

import { cookies } from "next/headers"

export type Transaction = {
  id: string
  amount: number
  amountInSGD: number
  currency: "SGD" | "USD"
  date: Date
  category: string
  description: string
}

// This is a mock implementation that uses cookies for storage
// In a real app, you would use a database like Supabase

export async function addTransaction(transaction: Omit<Transaction, "id">): Promise<void> {
  const store = cookies()
  const existingData = store.get("transactions")?.value

  const transactions: Transaction[] = existingData ? JSON.parse(existingData) : []

  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    date: new Date(transaction.date),
  }

  transactions.push(newTransaction)

  // Store in cookies (limited storage, just for demo)
  store.set("transactions", JSON.stringify(transactions), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
}

export async function getTransactions(): Promise<Transaction[]> {
  const store = cookies()
  const existingData = store.get("transactions")?.value

  if (!existingData) {
    return []
  }

  return JSON.parse(existingData).map((t: any) => ({
    ...t,
    date: new Date(t.date),
  }))
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const transactions = await getTransactions()

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
}

export async function getDailySpending(): Promise<number> {
  const transactions = await getTransactions()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return transactions
    .filter((t) => {
      const date = new Date(t.date)
      date.setHours(0, 0, 0, 0)
      return date.getTime() === today.getTime()
    })
    .reduce((sum, t) => sum + t.amountInSGD, 0)
}

export async function getWeeklySpending(): Promise<number> {
  const transactions = await getTransactions()
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  return transactions
    .filter((t) => {
      const date = new Date(t.date)
      return date >= startOfWeek
    })
    .reduce((sum, t) => sum + t.amountInSGD, 0)
}

export async function getMonthlySpending(): Promise<number> {
  const transactions = await getTransactions()
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  return transactions
    .filter((t) => {
      const date = new Date(t.date)
      return date >= startOfMonth
    })
    .reduce((sum, t) => sum + t.amountInSGD, 0)
}

