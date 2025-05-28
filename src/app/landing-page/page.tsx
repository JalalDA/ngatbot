
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Bot, MessageSquare, Settings, Zap, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">TeleBot AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Build Powerful Telegram Bots with
            <span className="text-blue-600"> AI Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create, deploy, and manage intelligent Telegram bots without coding. 
            Integrate with SMM panels, payment systems, and AI features effortlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything You Need to Build Amazing Bots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Bot className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>AI Bot Builder</CardTitle>
                <CardDescription>
                  Create intelligent bots with OpenAI integration and natural language processing
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Auto Bot Builder</CardTitle>
                <CardDescription>
                  Build bots with inline menus, automated responses, and custom workflows
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Settings className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>SMM Panel Integration</CardTitle>
                <CardDescription>
                  Connect with social media marketing services and automate order processing
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>
                  Integrate Midtrans payment system for seamless transactions
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>API Provider</CardTitle>
                <CardDescription>
                  Offer reseller services with comprehensive API management
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive management panel for all your bots and services
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for beginners</CardDescription>
                <div className="text-3xl font-bold">$9<span className="text-lg">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ Up to 3 bots</li>
                  <li>✓ Basic AI features</li>
                  <li>✓ Email support</li>
                </ul>
                <Button className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-600">
              <CardHeader>
                <Badge className="mb-2">Most Popular</Badge>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="text-3xl font-bold">$29<span className="text-lg">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ Unlimited bots</li>
                  <li>✓ Advanced AI features</li>
                  <li>✓ SMM Panel integration</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="text-3xl font-bold">$99<span className="text-lg">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ Everything in Professional</li>
                  <li>✓ White-label solution</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ 24/7 phone support</li>
                </ul>
                <Button className="w-full mt-4">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6" />
                <span className="text-xl font-bold">TeleBot AI</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for building intelligent Telegram bots.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/community">Community</Link></li>
                <li><Link href="/status">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TeleBot AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
