'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Shield, Zap, Users, Star, ChevronRight } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Bots",
    description: "Create intelligent Telegram bots with advanced AI capabilities"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Deploy your bots instantly with our optimized infrastructure"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team to build amazing bots"
  }
]

const testimonials = [
  {
    name: "Ahmad Rizki",
    role: "Startup Founder",
    content: "BotBuilder AI helped us create a customer service bot that increased our response rate by 300%.",
    rating: 5
  },
  {
    name: "Sarah Lestari",
    role: "Digital Marketer",
    content: "The ease of use is incredible. I built my first bot in just 10 minutes!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Developer",
    content: "The API integration capabilities are outstanding. Perfect for complex workflows.",
    rating: 5
  }
]

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    setIsLoading(true)
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-purple-500/10 text-purple-300 border-purple-500/20">
                🚀 Powered by Advanced AI
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Build Powerful
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {" "}Telegram Bots{" "}
                </span>
                in Minutes
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Create intelligent, automated Telegram bots with our AI-powered platform. 
                No coding required - just drag, drop, and deploy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isLoading ? "Loading..." : "Start Building Free"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open('https://t.me/your_demo_bot', '_blank')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need to Build Amazing Bots
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to create, deploy, and manage your Telegram bots.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Loved by Developers and Businesses
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who have built successful bots with our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-slate-300">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your First Bot?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and businesses who trust BotBuilder AI to power their Telegram automation.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? "Loading..." : "Get Started Now"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}