"use client"

import DashboardLayout from "@/components/dashboard-layout";
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp,
  Wallet,
  BarChart
} from "lucide-react";
import SketchyChart from "@/components/sketchy-chart";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card card-gradient">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="stats-label">TOTAL BALANCE</p>
              <h3 className="stats-value">$214,356.78</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-full">
              <Wallet className="text-primary h-5 w-5" />
            </div>
          </div>
          <div className="positive-change text-sm mt-2">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>8.74%</span>
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>

        <div className="dashboard-card card-gradient">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="stats-label">TRADING VOLUME</p>
              <h3 className="stats-value">$45,672.39</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-full">
              <BarChart className="text-primary h-5 w-5" />
            </div>
          </div>
          <div className="positive-change text-sm mt-2">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>12.38%</span>
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>

        <div className="dashboard-card card-gradient">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="stats-label">PROFIT/LOSS</p>
              <h3 className="stats-value">+$23,409.16</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-full">
              <TrendingUp className="text-primary h-5 w-5" />
            </div>
          </div>
          <div className="positive-change text-sm mt-2">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>5.21%</span>
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Portfolio Performance</h3>
          </div>
          <div className="h-80">
            <SketchyChart 
              data={[
                {name: 'Mon', value: 4000},
                {name: 'Tue', value: 3000},
                {name: 'Wed', value: 6000},
                {name: 'Thu', value: 2780},
                {name: 'Fri', value: 7890},
                {name: 'Sat', value: 9390},
                {name: 'Sun', value: 9900}
              ]}
              professional={true}
            />
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-bold text-lg mb-4">Top Assets</h3>
          <div className="space-y-4">
            {[
              { name: "Bitcoin", symbol: "BTC", value: "$128,456.32", change: "+3.45%", isPositive: true },
              { name: "Ethereum", symbol: "ETH", value: "$53,672.09", change: "+5.18%", isPositive: true },
              { name: "Solana", symbol: "SOL", value: "$19,345.87", change: "-1.24%", isPositive: false },
              { name: "Cardano", symbol: "ADA", value: "$7,209.54", change: "+2.78%", isPositive: true },
              { name: "Polkadot", symbol: "DOT", value: "$5,672.96", change: "-0.32%", isPositive: false }
            ].map((asset, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{asset.value}</p>
                  <p className={asset.isPositive ? "positive-change text-xs" : "negative-change text-xs"}>
                    {asset.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {asset.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 