
"use client"

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bot, 
  ShoppingCart, 
  Coins, 
  TrendingUp, 
  Activity,
  Crown,
  Star,
  Zap,
  BarChart3,
  Brain,
  Cpu
} from "lucide-react";
import { useState } from "react";

export default function OverviewDashboard() {
  const { user } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCreateBotModal, setShowCreateBotModal] = useState(false);

  // Mock data for now
  const activeBots = 0;
  const totalBots = 0;
  const totalSmmServices = 0;
  const activeProviders = 0;

  // Credit usage percentage
  const maxCredits = user?.maxCredits || 1000;
  const currentCredits = user?.credits || 1000;
  const usedCredits = maxCredits - currentCredits;
  const creditUsagePercentage = (usedCredits / maxCredits) * 100;

  // Account status
  const getAccountStatus = () => {
    if (user?.isPro) return { text: "Pro Account", color: "bg-blue-500", icon: Crown };
    if (user?.isBusiness) return { text: "Business Account", color: "bg-purple-500", icon: Star };
    return { text: "Free Account", color: "bg-gray-500", icon: User };
  };

  const accountStatus = getAccountStatus();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Selamat datang kembali! Kelola bot Telegram dan layanan SMM Anda dengan mudah.</p>
        </div>

        {/* Account Status Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${accountStatus.color} rounded-full flex items-center justify-center`}>
                  <accountStatus.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{user?.fullName || user?.username || "User"}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {accountStatus.text}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-2xl font-bold text-foreground">{currentCredits.toLocaleString()}</span>
                  <span className="text-muted-foreground">credits</span>
                </div>
                <Button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Bots */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bots</CardTitle>
              <Bot className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeBots}</div>
              <p className="text-xs text-muted-foreground">dari {totalBots} total bot</p>
            </CardContent>
          </Card>

          {/* SMM Services */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">SMM Services</CardTitle>
              <ShoppingCart className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalSmmServices}</div>
              <p className="text-xs text-muted-foreground">layanan tersedia</p>
              <div className="mt-2 flex items-center text-xs text-green-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Ready to use</span>
              </div>
            </CardContent>
          </Card>

          {/* Credit Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit Usage</CardTitle>
              <Zap className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{creditUsagePercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">{usedCredits.toLocaleString()} / {maxCredits} used</p>
            </CardContent>
          </Card>

          {/* Active Providers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">SMM Providers</CardTitle>
              <Activity className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeProviders}</div>
              <p className="text-xs text-muted-foreground">provider aktif</p>
              <div className="mt-2 flex items-center text-xs text-purple-400">
                <Activity className="w-3 h-3 mr-1" />
                <span>Connected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Bot Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <span>Bot Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Create New Bot</h4>
                  <p className="text-sm text-muted-foreground">Set up a new Telegram bot with AI</p>
                </div>
                <Button size="sm" onClick={() => setShowCreateBotModal(true)}>
                  <Bot className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick SMM Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                <span>SMM Panel</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Add Provider</h4>
                  <p className="text-sm text-muted-foreground">Connect new SMM service provider</p>
                </div>
                <Button size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
