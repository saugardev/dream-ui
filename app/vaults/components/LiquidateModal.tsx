"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LiquidateModalProps {
  isOpen: boolean
  onClose: () => void
  onLiquidate: (userAddress: string) => Promise<void>
}

export function LiquidateModal({ isOpen, onClose, onLiquidate }: LiquidateModalProps) {
  const [userAddress, setUserAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLiquidate = async () => {
    if (!userAddress) return
    
    try {
      setIsLoading(true)
      await onLiquidate(userAddress)
      setUserAddress("")
      onClose()
    } catch (error) {
      console.error("Liquidate error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Liquidate Position</DialogTitle>
          <DialogDescription>
            Liquidate an undercollateralized position.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="userAddress">User Address</Label>
            <Input
              id="userAddress"
              placeholder="0x..."
              value={userAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleLiquidate} 
            disabled={!userAddress || isLoading}
          >
            {isLoading ? "Liquidating..." : "Liquidate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 