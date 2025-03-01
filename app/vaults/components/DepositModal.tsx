"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onDeposit: (asset: string, amount: string) => Promise<void>
  supportedAssets: { address: string; symbol: string }[]
}

export function DepositModal({ isOpen, onClose, onDeposit, supportedAssets }: DepositModalProps) {
  const [selectedAsset, setSelectedAsset] = useState(supportedAssets[0]?.address || "")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    if (!selectedAsset || !amount) return
    
    try {
      setIsLoading(true)
      await onDeposit(selectedAsset, amount)
      setAmount("")
      onClose()
    } catch (error) {
      console.error("Deposit error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Collateral</DialogTitle>
          <DialogDescription>
            Deposit assets as collateral to borrow against.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="asset">Asset</Label>
            <Select
              value={selectedAsset}
              onValueChange={setSelectedAsset}
            >
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {supportedAssets.map((asset) => (
                  <SelectItem key={asset.address} value={asset.address}>
                    {asset.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDeposit} disabled={!selectedAsset || !amount || isLoading}>
            {isLoading ? "Depositing..." : "Deposit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 