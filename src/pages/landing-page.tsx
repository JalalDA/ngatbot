
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGetStarted = () => {
    router.push('/auth')
  }

  const handleLearnMore = () => {
    router.push('/dashboard')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Navigation */}
      <nav className="w-full px-6 py-4 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">BotBuilder AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push('/auth')}>
              Sign In
            </Button>
            <Button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            🚀 AI-Powered Bot Builder
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build Smart
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Telegram Bots
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create AI-powered Telegram bots that understand your business and provide intelligent responses to your customers. No coding required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Building Now
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleLearnMore}
              className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <i className="fas fa-play mr-2"></i>
              See Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Build Amazing Bots
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to create, deploy, and manage intelligent Telegram bots.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <i className={`${feature.icon} text-white text-xl`}></i>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Trusted by Businesses Worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your First Bot?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using BotBuilder AI to automate customer support and boost engagement.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
            <i className="fas fa-rocket ml-2"></i>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold">BotBuilder AI</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 BotBuilder AI. All rights reserved.</p>
              <p className="text-sm mt-1">Building the future of AI-powered communication.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: "fas fa-magic",
    title: "AI-Powered Responses",
    description: "Advanced GPT integration provides intelligent, context-aware responses to your customers automatically.",
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    icon: "fas fa-cog",
    title: "Easy Setup",
    description: "Create and deploy your bot in minutes with our intuitive drag-and-drop interface. No coding required.",
    color: "bg-gradient-to-r from-blue-500 to-indigo-500"
  },
  {
    icon: "fas fa-database",
    title: "Knowledge Base",
    description: "Upload your business documents and let your bot learn from your specific content and policies.",
    color: "bg-gradient-to-r from-green-500 to-emerald-500"
  },
  {
    icon: "fas fa-chart-line",
    title: "Analytics Dashboard",
    description: "Track conversations, user engagement, and bot performance with detailed analytics and insights.",
    color: "bg-gradient-to-r from-orange-500 to-red-500"
  },
  {
    icon: "fas fa-shield-alt",
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected and accessible.",
    color: "bg-gradient-to-r from-indigo-500 to-purple-500"
  },
  {
    icon: "fas fa-users",
    title: "Multi-User Support",
    description: "Handle thousands of simultaneous conversations with advanced queue management and response optimization.",
    color: "bg-gradient-to-r from-teal-500 to-cyan-500"
  }
]

const stats = [
  { value: "10K+", label: "Active Bots" },
  { value: "1M+", label: "Messages Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "500+", label: "Happy Customers" }
]
