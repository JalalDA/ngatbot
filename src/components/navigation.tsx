
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { 
  Bot, 
  Home, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wrench,
  Shield,
  CreditCard
} from "lucide-react"

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navigationItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/bots", icon: Bot, label: "My Bots" },
    { path: "/digitalproduct", icon: ShoppingCart, label: "SMM Services" },
    { path: "/auto-bot-builder", icon: Wrench, label: "Auto Bot Builder" },
    { path: "/api-provider", icon: Shield, label: "API Provider" },
    { path: "/payment-method", icon: CreditCard, label: "Payment Method" },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  if (user?.role === "admin") {
    navigationItems.push({ path: "/admin", icon: Settings, label: "Admin Panel" })
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <Card className="hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-card/95 backdrop-blur-sm border shadow-lg">
        <nav className="flex items-center space-x-1 p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`nav-item ${isActive(item.path) ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">{item.label}</span>
                </Button>
              </Link>
            )
          })}
          
          <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
            {user && (
              <Badge variant="secondary" className="hidden lg:inline-flex">
                {user.level} • {user.credits} credits
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">Logout</span>
            </Button>
          </div>
        </nav>
      </Card>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <Card className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-semibold">Bot Platform</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </Card>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
            <Card className="fixed top-16 left-4 right-4 bg-card shadow-lg">
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={`w-full justify-start ${isActive(item.path) ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
                
                <div className="pt-4 border-t">
                  {user && (
                    <div className="mb-4">
                      <Badge variant="secondary" className="w-full justify-center">
                        {user.level} • {user.credits} credits
                      </Badge>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </nav>
            </Card>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <Card className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm">
          <nav className="flex justify-around p-2">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`nav-item ${isActive(item.path) ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              )
            })}
          </nav>
        </Card>
      </div>

      {/* Spacer for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  )
}
