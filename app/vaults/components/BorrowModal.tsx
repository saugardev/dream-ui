"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  onBorrow: (amount: string) => Promise<void>
  maxBorrowAmount: string
}

export function BorrowModal({ isOpen, onClose, onBorrow, maxBorrowAmount }: BorrowModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleBorrow = async () => {
    if (!amount) return
    
    try {
      setIsLoading(true)
      await onBorrow(amount)
      setAmount("")
      onClose()
    } catch (error) {
      console.error("Borrow error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow CDP</DialogTitle>
          <DialogDescription>
            Borrow CDP tokens against your collateral.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount</Label>
              <span className="text-xs text-muted-foreground">
                Max: {maxBorrowAmount}
              </span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              max={maxBorrowAmount}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBorrow} disabled={!amount || isLoading}>
            {isLoading ? "Borrowing..." : "Borrow"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 