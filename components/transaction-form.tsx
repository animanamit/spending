"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { addTransaction } from "@/lib/transactions"

const formSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" }),
  currency: z.enum(["SGD", "USD"]),
  date: z.date(),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
})

export default function TransactionForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      currency: "SGD",
      date: new Date(),
      category: "food",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Convert amount to number
      const amountNum = Number.parseFloat(values.amount)

      // Convert USD to SGD if needed (using a fixed rate of 1.35 for demo)
      const amountInSGD = values.currency === "USD" ? amountNum * 1.35 : amountNum

      await addTransaction({
        amount: amountNum,
        amountInSGD,
        currency: values.currency,
        date: values.date,
        category: values.category,
        description: values.description || "",
      })

      // Reset form
      form.reset({
        amount: "",
        currency: "SGD",
        date: new Date(),
        category: "food",
        description: "",
      })

      // Close form
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to add transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="bg-[#4a6741] hover:bg-[#3a5331] text-white">
        <Plus className="mr-2 h-4 w-4" /> Add Transaction
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false)
            }}
          >
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input id="amount" type="number" step="0.01" placeholder="0.00" {...form.register("amount")} />
                      </div>
                      <RadioGroup
                        defaultValue="SGD"
                        className="flex"
                        {...form.register("currency")}
                        onValueChange={(value) => form.setValue("currency", value as "SGD" | "USD")}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="SGD" id="sgd" className="sr-only" />
                          <Label
                            htmlFor="sgd"
                            className={cn(
                              "cursor-pointer rounded-l-md border px-3 py-2 text-sm",
                              form.watch("currency") === "SGD"
                                ? "border-[#4a6741] bg-[#4a6741] text-white"
                                : "border-input bg-background",
                            )}
                          >
                            SGD
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="USD" id="usd" className="sr-only" />
                          <Label
                            htmlFor="usd"
                            className={cn(
                              "cursor-pointer rounded-r-md border px-3 py-2 text-sm",
                              form.watch("currency") === "USD"
                                ? "border-[#4a6741] bg-[#4a6741] text-white"
                                : "border-input bg-background",
                            )}
                          >
                            USD
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {form.watch("currency") === "USD" && (
                      <p className="text-xs text-muted-foreground">
                        ≈ SGD {(Number.parseFloat(form.watch("amount") || "0") * 1.35).toFixed(2)} (1 USD = 1.35 SGD)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("date") ? format(form.watch("date"), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("date")}
                          onSelect={(date) => form.setValue("date", date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      defaultValue={form.watch("category")}
                      onValueChange={(value) => form.setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" placeholder="Coffee, lunch, etc." {...form.register("description")} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#4a6741] hover:bg-[#3a5331] text-white"
                    >
                      {isSubmitting ? "Saving..." : "Save Transaction"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

