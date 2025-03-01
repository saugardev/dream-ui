"use client"

import { useState } from "react";
import { useAccount } from "wagmi";
import DashboardLayout from "@/components/dashboard-layout";
import { Lock, Shield, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepositModal } from "./components/DepositModal";
import { BorrowModal } from "./components/BorrowModal";
import { RepayModal } from "./components/RepayModal";
import { WithdrawModal } from "./components/WithdrawModal";
import { LiquidateModal } from "./components/LiquidateModal";
import { useVault } from "@/lib/hooks/useVault";

// Mock data - replace with actual data from contract
const supportedAssets = [
  { address: "0x1111111111111111111111111111111111111111", symbol: "ETH" },
  { address: "0x2222222222222222222222222222222222222222", symbol: "BTC" },
  { address: "0x3333333333333333333333333333333333333333", symbol: "USDC" },
];

const userAssets = [
  { address: "0x1111111111111111111111111111111111111111", symbol: "ETH", balance: "5.0" },
  { address: "0x2222222222222222222222222222222222222222", symbol: "BTC", balance: "0.25" },
];

export default function VaultsPage() {
  const { isConnected } = useAccount();
  const { 
    deposit, 
    borrow, 
    repay, 
    withdraw, 
    liquidate, 
    loading, 
    isPending 
  } = useVault();
  
  // Modal states
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [liquidateModalOpen, setLiquidateModalOpen] = useState(false);
  
  // Selected CDP for actions
  const [selectedCdp, setSelectedCdp] = useState<string | null>(null);

  // Mock CDP data - replace with actual data from contract
  const vaultProducts = [
    {
      id: "eth-a",
      name: "ETH-A",
      apy: "8.5%",
      risk: "Low",
      lockPeriod: "30 days",
      minDeposit: "$500",
      totalLocked: "$12.4M",
      icon: <Shield className="h-10 w-10 text-primary" />,
      description: "Earn yield on ETH with minimal risk exposure"
    },
    {
      id: "btc-b",
      name: "BTC-B",
      apy: "4.2%",
      risk: "Medium",
      lockPeriod: "90 days",
      minDeposit: "$1000",
      totalLocked: "$45.8M",
      icon: <Lock className="h-10 w-10 text-primary" />,
      description: "Earn yield while holding Bitcoin for the long term"
    }
  ];

  // Mock user CDPs - replace with actual data from contract
  const userCdps = [
    {
      id: "1294",
      type: "ETH-A",
      collateralValue: "$12,500.00",
      cdpValue: "$8,750.00",
      liquidationRisk: "25%",
      collateralRatio: "175%",
      icon: <Shield className="h-4 w-4 text-primary" />,
      asset: "Ethereum"
    },
    {
      id: "876",
      type: "BTC-B",
      collateralValue: "$33,172.39",
      cdpValue: "$19,903.43",
      liquidationRisk: "42%",
      collateralRatio: "167%",
      icon: <Lock className="h-4 w-4 text-primary" />,
      asset: "Bitcoin"
    }
  ];

  // Contract interaction handlers
  const handleDeposit = async (asset: string, amount: string) => {
    try {
      await deposit(asset as `0x${string}`, amount);
      console.log(`Successfully deposited ${amount} of asset ${asset}`);
    } catch (error) {
      console.error("Deposit error:", error);
    }
  };

  const handleBorrow = async (amount: string) => {
    try {
      await borrow(amount);
      console.log(`Successfully borrowed ${amount} CDP`);
    } catch (error) {
      console.error("Borrow error:", error);
    }
  };

  const handleRepay = async (amount: string) => {
    try {
      await repay(amount);
      console.log(`Successfully repaid ${amount} CDP for CDP ${selectedCdp}`);
    } catch (error) {
      console.error("Repay error:", error);
    }
  };

  const handleWithdraw = async (asset: string, amount: string) => {
    try {
      await withdraw(asset as `0x${string}`, amount);
      console.log(`Successfully withdrew ${amount} of asset ${asset}`);
    } catch (error) {
      console.error("Withdraw error:", error);
    }
  };

  const handleLiquidate = async (userAddress: string) => {
    try {
      await liquidate(userAddress as `0x${string}`);
      console.log(`Successfully liquidated position for user ${userAddress}`);
    } catch (error) {
      console.error("Liquidate error:", error);
    }
  };

  // Helper function to open modals with selected CDP
  const openActionModal = (cdpId: string, action: 'borrow' | 'repay' | 'withdraw') => {
    setSelectedCdp(cdpId);
    
    if (action === 'borrow') {
      setBorrowModalOpen(true);
    } else if (action === 'repay') {
      setRepayModalOpen(true);
    } else if (action === 'withdraw') {
      setWithdrawModalOpen(true);
    }
  };

  return (
    <DashboardLayout title="Yield Vaults">
      {!isConnected && (
        <div className="mb-6 p-4 border border-dream-orange-500 bg-orange-500/10 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-dream--500" />
          <p className="text-sm">Connect your wallet to interact with vaults and manage your positions.</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="stats-label">AVAILABLE CDP TYPES</p>
          <Button 
            onClick={() => setDepositModalOpen(true)}
            disabled={!isConnected || loading || isPending}
          >
            Deposit Collateral
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vaultProducts.map((vault, index) => (
            <div className="dashboard-card" key={index}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  {vault.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{vault.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">Create a collateralized debt position with {vault.name}</p>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">STABILITY FEE</p>
                      <p className="font-semibold text-primary">{vault.apy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">LIQUIDATION FEE</p>
                      <p className="font-medium">13%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MIN COLLATERAL RATIO</p>
                      <p className="font-medium">150%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MAX DEBT</p>
                      <p className="font-medium">{vault.minDeposit}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">TOTAL DEBT ISSUED</p>
                      <p className="font-medium">{vault.totalLocked}</p>
                    </div>
                    <Button 
                      onClick={() => setBorrowModalOpen(true)}
                      disabled={!isConnected || loading || isPending}
                    >
                      Create CDP
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <p className="stats-label">YOUR ACTIVE CDPs</p>
          <Button 
            variant="outline" 
            onClick={() => setLiquidateModalOpen(true)}
            disabled={!isConnected || loading || isPending}
          >
            Liquidate Position
          </Button>
        </div>
        {userCdps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium text-muted-foreground">CDP</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Collateral Value</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">CDP Value</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <span>Liquidation Risk</span>
                      <button className="text-muted-foreground hover:text-primary info-button">
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Collateral Ratio</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userCdps.map((cdp) => (
                  <tr className="border-b border-border" key={cdp.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                          {cdp.icon}
                        </div>
                        <div>
                          <p className="font-medium">{cdp.type} CDP #{cdp.id}</p>
                          <p className="text-xs text-muted-foreground">{cdp.asset}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4">
                      <p className="font-medium">{cdp.collateralValue}</p>
                    </td>
                    <td className="text-right py-4">
                      <p className="font-medium">{cdp.cdpValue}</p>
                    </td>
                    <td className="text-right py-4">
                      <p className="font-medium">{cdp.liquidationRisk}</p>
                    </td>
                    <td className="text-right py-4">
                      <p className="font-medium">{cdp.collateralRatio}</p>
                    </td>
                    <td className="text-right py-4">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => setDepositModalOpen(true)}
                          disabled={loading || isPending}
                        >
                          Add
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openActionModal(cdp.id, 'withdraw')}
                          disabled={loading || isPending}
                        >
                          Remove
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openActionModal(cdp.id, 'borrow')}
                          disabled={loading || isPending}
                        >
                          Generate
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openActionModal(cdp.id, 'repay')}
                          disabled={loading || isPending}
                        >
                          Payback
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You don&apos;t have any active CDPs yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => setDepositModalOpen(true)}
              disabled={!isConnected || loading || isPending}
            >
              Create Your First CDP
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <DepositModal 
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDeposit={handleDeposit}
        supportedAssets={supportedAssets}
      />

      <BorrowModal 
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
        onBorrow={handleBorrow}
        maxBorrowAmount="10000"
      />

      <RepayModal 
        isOpen={repayModalOpen}
        onClose={() => setRepayModalOpen(false)}
        onRepay={handleRepay}
        currentDebt={selectedCdp === "1294" ? "8750" : "19903.43"}
      />

      <WithdrawModal 
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        userAssets={userAssets}
      />

      <LiquidateModal 
        isOpen={liquidateModalOpen}
        onClose={() => setLiquidateModalOpen(false)}
        onLiquidate={handleLiquidate}
      />
    </DashboardLayout>
  );
} 