"use client"

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import DashboardLayout from "@/components/dashboard-layout";
import { Shield, Info, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepositModal } from "./components/DepositModal";
import { BorrowModal } from "./components/BorrowModal";
import { RepayModal } from "./components/RepayModal";
import { WithdrawModal } from "./components/WithdrawModal";
import { LiquidateModal } from "./components/LiquidateModal";
import { useVault } from "@/lib/hooks/useVault";
import { formatEther } from "viem";

// Real supported assets on Base Sepolia
const supportedAssets = [
  { address: "0x4200000000000000000000000000000000000006", symbol: "WETH" },
  { address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", symbol: "USDC" },
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
    isPending,
    vaultAddress,
    tokenAddress,
    getMaxBorrowAmount,
    useUserCollateral,
    useUserCdpBorrowed,
    usePoolCollateral,
    useUserHealthFactor
  } = useVault();
  
  // Modal states
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [liquidateModalOpen, setLiquidateModalOpen] = useState(false);
  
  // Selected CDP for actions
  const [selectedCdp, setSelectedCdp] = useState<string | null>(null);
  const [maxBorrowAmount, setMaxBorrowAmount] = useState("0");
  const [userAssets, setUserAssets] = useState<{ address: string; symbol: string; balance: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Get user's CDP borrowed amount
  const { data: cdpBorrowed } = useUserCdpBorrowed();
  
  // Get user health factor
  const { data: healthFactor } = useUserHealthFactor();

  // Fetch user collateral for each supported asset
  const wethCollateral = useUserCollateral(supportedAssets[0].address as `0x${string}`);
  const usdcCollateral = useUserCollateral(supportedAssets[1].address as `0x${string}`);
  
  // Fetch pool collateral for each supported asset
  const poolWethCollateral = usePoolCollateral(supportedAssets[0].address as `0x${string}`);

  // Fetch max borrow amount and user assets when connected
  const fetchUserData = async () => {
    if (!isConnected) return;
    
    setIsLoadingData(true);
    try {
      const amount = await getMaxBorrowAmount();
      setMaxBorrowAmount(amount);
      
      // Update user assets with actual balances from contracts
      const updatedAssets = [
        { 
          address: supportedAssets[0].address, 
          symbol: supportedAssets[0].symbol, 
          balance: wethCollateral.data ? formatEther(wethCollateral.data as bigint) : "0" 
        },
        { 
          address: supportedAssets[1].address, 
          symbol: supportedAssets[1].symbol, 
          balance: usdcCollateral.data ? formatEther(usdcCollateral.data as bigint) : "0" 
        }
      ];
      setUserAssets(updatedAssets);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [
    isConnected, 
    wethCollateral.data, 
    usdcCollateral.data
  ]);

  // Calculate total collateral value (mock price data for demo)
  const calculateCollateralValue = () => {
    if (!wethCollateral.data && !usdcCollateral.data) return "$0.00";
    
    // Mock prices - in a real app, these would come from oracles
    const ethPrice = 3500;
    const usdcPrice = 1;
    
    const wethValue = wethCollateral.data ? 
      Number(formatEther(wethCollateral.data as bigint)) * ethPrice : 0;
    
    const usdcValue = usdcCollateral.data ? 
      Number(formatEther(usdcCollateral.data as bigint)) * usdcPrice : 0;
    
    const totalValue = wethValue + usdcValue;
    return `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate CDP value
  const calculateCdpValue = () => {
    if (!cdpBorrowed) return "$0.00";
    
    // Mock CDP price - in a real app, this would be calculated from the contract
    const cdpPrice = 1; // 1:1 with USD for simplicity
    
    const cdpValue = Number(formatEther(cdpBorrowed as bigint)) * cdpPrice;
    return `$${cdpValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate liquidation risk
  const calculateLiquidationRisk = () => {
    if (!healthFactor) return "0%";
    
    // Mock calculation - in a real app, this would be more complex
    const risk = 100 - (Number(healthFactor) / 2);
    return `${Math.max(0, Math.min(100, risk)).toFixed(0)}%`;
  };

  // Calculate collateral ratio
  const calculateCollateralRatio = () => {
    if (!healthFactor) return "0%";
    return `${healthFactor}%`;
  };

  // Vault products with real contract addresses
  const vaultProduct = {
    id: "eth-a",
    name: "ETH-A",
    apy: "8.5%",
    risk: "Low",
    lockPeriod: "30 days",
    minDeposit: "$500",
    totalLocked: poolWethCollateral.data ? 
      `$${(Number(formatEther(poolWethCollateral.data as bigint)) * 3500).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 
      "$0.00",
    icon: <Shield className="h-10 w-10 text-primary" />,
    description: "Earn yield on ETH with minimal risk exposure",
    vaultAddress: vaultAddress,
    tokenAddress: tokenAddress
  };

  // Check if user has any active CDPs
  const hasActiveCdps = () => {
    // Check if user has borrowed CDP tokens
    const hasBorrowed = cdpBorrowed && Number(formatEther(cdpBorrowed as bigint)) > 0;
    
    // Check if user has deposited collateral
    const hasCollateral = 
      (wethCollateral.data && Number(formatEther(wethCollateral.data as bigint)) > 0) || 
      (usdcCollateral.data && Number(formatEther(usdcCollateral.data as bigint)) > 0);
    
    return hasBorrowed || hasCollateral;
  };

  // User CDPs based on contract data
  const userCdps = isConnected && hasActiveCdps() ? [
    {
      id: "1",
      type: "ETH-A",
      collateralValue: calculateCollateralValue(),
      cdpValue: calculateCdpValue(),
      liquidationRisk: calculateLiquidationRisk(),
      collateralRatio: calculateCollateralRatio(),
      icon: <Shield className="h-4 w-4 text-primary" />,
      asset: "Ethereum"
    }
  ] : [];

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

      {isConnected && (
        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1">
            {isLoadingData && (
              <div className="p-4 border border-blue-500 bg-blue-500/10 rounded-lg flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                <p className="text-sm">Loading your vault data...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="stats-label">AVAILABLE CDP TYPE</p>
          <Button 
            onClick={() => setDepositModalOpen(true)}
            disabled={!isConnected || loading || isPending}
          >
            Deposit Collateral
          </Button>
        </div>
        <div className="dashboard-card">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              {vaultProduct.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{vaultProduct.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{vaultProduct.description}</p>
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">STABILITY FEE</p>
                  <p className="font-semibold text-primary">{vaultProduct.apy}</p>
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
                  <p className="font-medium">{vaultProduct.minDeposit}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">TOTAL LOCKED</p>
                  <p className="font-medium">{vaultProduct.totalLocked}</p>
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
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <p className="stats-label">
            {isConnected ? 
              userCdps.length > 0 ? "YOUR ACTIVE CDPs" : "NO ACTIVE CDPs" 
              : "CONNECT WALLET TO VIEW CDPs"
            }
          </p>
          {isConnected && (
            <Button 
              variant="outline" 
              onClick={() => setLiquidateModalOpen(true)}
              disabled={loading || isPending}
            >
              Liquidate Position
            </Button>
          )}
        </div>
        {isConnected && userCdps.length > 0 ? (
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
          <div className="text-center py-12">
            {isConnected ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Active CDPs Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You don&apos;t have any active CDPs yet. Start by depositing collateral and creating your first CDP.
                </p>
                <Button 
                  onClick={() => setDepositModalOpen(true)}
                  disabled={loading || isPending}
                >
                  Create Your First CDP
                </Button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Wallet Not Connected</h3>
                <p className="text-muted-foreground">
                  Connect your wallet to view and manage your CDPs.
                </p>
              </>
            )}
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
        maxBorrowAmount={maxBorrowAmount}
      />

      <RepayModal 
        isOpen={repayModalOpen}
        onClose={() => setRepayModalOpen(false)}
        onRepay={handleRepay}
        currentDebt={cdpBorrowed ? formatEther(cdpBorrowed as bigint) : "0"}
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