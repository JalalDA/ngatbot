
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Star, 
  ArrowRight,
  CheckCircle,
  Users,
  Activity
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Bots",
      description: "Create intelligent Telegram bots with advanced AI capabilities"
    },
    {
      icon: MessageSquare,
      title: "Smart Conversations",
      description: "Natural language processing for meaningful interactions"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Deploy your bot in minutes with our intuitive interface"
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Handle multiple users and conversations simultaneously"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "Rp 0",
      period: "/month",
      features: [
        "1 Bot",
        "100 Messages/month",
        "Basic AI responses",
        "Community support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "Rp 50,000",
      period: "/month",
      features: [
        "5 Bots",
        "5,000 Messages/month",
        "Advanced AI features",
        "Priority support",
        "Custom knowledge base"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "Rp 150,000",
      period: "/month",
      features: [
        "Unlimited Bots",
        "25,000 Messages/month",
        "Enterprise AI features",
        "24/7 support",
        "API access",
        "Custom integrations"
      ],
      popular: false
    }
  ]

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Powered by AI
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Intelligent 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}Telegram Bots
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create AI-powered Telegram bots that understand and respond naturally to your users. 
              No coding required - just configure and deploy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
                onClick={() => router.push('/auth')}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3"
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to create, deploy, and manage intelligent Telegram bots
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600">
                Choose the plan that fits your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      onClick={() => router.push('/auth')}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Your First Bot?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of developers who trust our platform for their Telegram bot needs
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              onClick={() => router.push('/auth')}
            >
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
