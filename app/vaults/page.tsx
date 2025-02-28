"use client"

import DashboardLayout from "@/components/dashboard-layout";
import { Lock, Shield, Info } from "lucide-react";

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
    }
  ];

  return (
    <DashboardLayout title="Yield Vaults">


      <div className="mb-6">
        <p className="stats-label mb-4">AVAILABLE CDP TYPES</p>
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
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md">
                      Create CDP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <p className="stats-label mb-4">YOUR ACTIVE CDPs</p>
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
              <tr className="border-b border-border">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">ETH-A CDP #1294</p>
                      <p className="text-xs text-muted-foreground">Ethereum</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$12,500.00</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$8,750.00</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">25%</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">175%</p>
                </td>
                <td className="text-right py-4">
                  <div className="flex justify-end gap-1">
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Add</button>
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Remove</button>
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Generate</button>
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Payback</button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">BTC-B CDP #876</p>
                      <p className="text-xs text-muted-foreground">Bitcoin</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$33,172.39</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">$19,903.43</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">42%</p>
                </td>
                <td className="text-right py-4">
                  <p className="font-medium">167%</p>
                </td>
                <td className="text-right py-4">
                  <div className="flex justify-end gap-1">
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Add</button>
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Remove</button>
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Generate</button>
                    <button className="px-2 py-1 text-xs bg-secondary text-foreground rounded-md">Payback</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 