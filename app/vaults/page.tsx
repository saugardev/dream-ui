"use client"

import DashboardLayout from "@/components/dashboard-layout";
import { Lock, ArrowUp, Clock, Shield } from "lucide-react";

export default function VaultsPage() {
  const vaultProducts = [
    {
      name: "Stablecoin Yield",
      apy: "8.5%",
      risk: "Low",
      lockPeriod: "30 days",
      minDeposit: "$500",
      totalLocked: "$12.4M",
      icon: <Shield className="h-10 w-10 text-primary" />,
      description: "Earn yield on stablecoins with minimal risk exposure"
    },
    {
      name: "BTC Hodler",
      apy: "4.2%",
      risk: "Medium",
      lockPeriod: "90 days",
      minDeposit: "$1000",
      totalLocked: "$45.8M",
      icon: <Lock className="h-10 w-10 text-primary" />,
      description: "Earn yield while holding Bitcoin for the long term"
    },
    {
      name: "ETH 2.0 Staking",
      apy: "5.8%",
      risk: "Medium",
      lockPeriod: "180 days",
      minDeposit: "$1500",
      totalLocked: "$67.2M",
      icon: <Clock className="h-10 w-10 text-primary" />,
      description: "Participate in ETH 2.0 staking with automated rewards"
    },
    {
      name: "DeFi Yield Aggregator",
      apy: "12.4%",
      risk: "High",
      lockPeriod: "45 days",
      minDeposit: "$2000",
      totalLocked: "$23.9M",
      icon: <ArrowUp className="h-10 w-10 text-primary" />,
      description: "Algorithmically optimized yield farming across DeFi protocols"
    }
  ];

  return (
    <DashboardLayout title="Yield Vaults">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="dashboard-card card-gradient">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="stats-label">TOTAL STAKED</p>
              <h3 className="stats-value">$45,672.39</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-full">
              <Lock className="text-primary h-5 w-5" />
            </div>
          </div>
          <div className="positive-change text-sm mt-2">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>6.24%</span>
            <span className="text-muted-foreground ml-1">return this month</span>
          </div>
        </div>

        <div className="dashboard-card card-gradient">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="stats-label">EARNED REWARDS</p>
              <h3 className="stats-value">$3,854.28</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-full">
              <ArrowUp className="text-primary h-5 w-5" />
            </div>
          </div>
          <div className="positive-change text-sm mt-2">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>2.14%</span>
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Available Vaults</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vaultProducts.map((vault, index) => (
            <div className="dashboard-card" key={index}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  {vault.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{vault.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{vault.description}</p>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">APY</p>
                      <p className="font-bold text-primary">{vault.apy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">RISK</p>
                      <p className="font-medium">{vault.risk}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">LOCK PERIOD</p>
                      <p className="font-medium">{vault.lockPeriod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MIN DEPOSIT</p>
                      <p className="font-medium">{vault.minDeposit}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">TOTAL LOCKED</p>
                      <p className="font-medium">{vault.totalLocked}</p>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md">
                      Deposit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="text-lg font-bold mb-4">Your Active Vaults</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-medium text-muted-foreground">Vault</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Staked</th>
                <th className="text-right py-3 font-medium text-muted-foreground">APY</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Earned</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Unlock Date</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Stablecoin Yield</p>
                      <p className="text-xs text-muted-foreground">USDC/USDT</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$12,500.00</p>
                </td>
                <td className="text-right py-4">
                  <p className="text-primary font-medium">8.5%</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$176.43</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">Jun 15, 2023</p>
                </td>
                <td className="text-right py-4">
                  <button className="px-3 py-1 text-xs bg-secondary text-foreground rounded-md">Withdraw</button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">BTC Hodler</p>
                      <p className="text-xs text-muted-foreground">BTC</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$33,172.39</p>
                </td>
                <td className="text-right py-4">
                  <p className="text-primary font-medium">4.2%</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$3,677.85</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">Aug 24, 2023</p>
                </td>
                <td className="text-right py-4">
                  <button className="px-3 py-1 text-xs bg-secondary text-foreground rounded-md">Withdraw</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 