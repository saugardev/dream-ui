"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RepayModalProps {
  isOpen: boolean
  onClose: () => void
  onRepay: (amount: string) => Promise<void>
  currentDebt: string
}

export function RepayModal({ isOpen, onClose, onRepay, currentDebt }: RepayModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRepay = async () => {
    if (!amount) return
    
    try {
      setIsLoading(true)
      await onRepay(amount)
      setAmount("")
      onClose()
    } catch (error) {
      console.error("Repay error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Repay CDP Debt</DialogTitle>
          <DialogDescription>
            Repay your CDP debt to reduce risk and free up collateral.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount</Label>
              <span className="text-xs text-muted-foreground">
                Current Debt: {currentDebt}
              </span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              max={currentDebt}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRepay} disabled={!amount || isLoading}>
            {isLoading ? "Repaying..." : "Repay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 