"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"

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
  const [step, setStep] = useState<"approve" | "deposit">("approve")
  const [error, setError] = useState<string | null>(null)

  const handleDeposit = async () => {
    if (!selectedAsset || !amount) return
    
    try {
      setIsLoading(true)
      setError(null)
      setStep("approve")
      
      // The approval is handled inside the onDeposit function in useVault
      await onDeposit(selectedAsset, amount)
      
      setAmount("")
      onClose()
    } catch (error) {
      console.error("Deposit error:", error)
      setError("Failed to deposit. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedAssetSymbol = supportedAssets.find(asset => asset.address === selectedAsset)?.symbol || ""

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
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
          
          {error && (
            <div className="p-3 border border-red-500 bg-red-500/10 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>This process requires two transactions:</p>
            <ol className="list-decimal pl-5 mt-2">
              <li className={step === "approve" ? "text-primary font-medium" : ""}>
                Approve the vault to use your {selectedAssetSymbol}
              </li>
              <li className={step === "deposit" ? "text-primary font-medium" : ""}>
                Deposit {selectedAssetSymbol} into the vault
              </li>
            </ol>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDeposit} disabled={!selectedAsset || !amount || isLoading}>
            {isLoading ? "Processing..." : "Deposit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 