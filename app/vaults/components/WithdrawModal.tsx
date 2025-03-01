"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onWithdraw: (asset: string, amount: string) => Promise<void>
  userAssets: { address: string; symbol: string; balance: string }[]
}

export function WithdrawModal({ isOpen, onClose, onWithdraw, userAssets }: WithdrawModalProps) {
  const [selectedAsset, setSelectedAsset] = useState(userAssets[0]?.address || "")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedAssetData = userAssets.find(asset => asset.address === selectedAsset)
  
  const handleWithdraw = async () => {
    if (!selectedAsset || !amount) return
    
    try {
      setIsLoading(true)
      await onWithdraw(selectedAsset, amount)
      setAmount("")
      onClose()
    } catch (error) {
      console.error("Withdraw error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Collateral</DialogTitle>
          <DialogDescription>
            Withdraw your collateral assets from the vault.
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
                {userAssets.map((asset) => (
                  <SelectItem key={asset.address} value={asset.address}>
                    {asset.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount</Label>
              {selectedAssetData && (
                <span className="text-xs text-muted-foreground">
                  Available: {selectedAssetData.balance}
                </span>
              )}
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              max={selectedAssetData?.balance}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleWithdraw} disabled={!selectedAsset || !amount || isLoading}>
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 