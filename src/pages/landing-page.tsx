
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Zap, Shield, Users, ChevronRight, Star, CheckCircle, MessageSquare, Settings, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const features = [
    {
      icon: Bot,
      title: "Bot Builder",
      description: "Buat bot Telegram dengan mudah tanpa coding",
      color: "text-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Auto Response",
      description: "Respon otomatis dengan AI dan keyword matching",
      color: "text-green-500"
    },
    {
      icon: Settings,
      title: "Custom Keyboard",
      description: "Keyboard inline yang dapat dikustomisasi",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Pantau performa bot dengan analytics real-time",
      color: "text-orange-500"
    }
  ]

  const testimonials = [
    {
      name: "Ahmad Rahman",
      role: "Digital Marketer",
      content: "Platform ini sangat membantu bisnis saya untuk automasi customer service.",
      rating: 5
    },
    {
      name: "Sari Indah",
      role: "Online Shop Owner",
      content: "Bot yang dibuat mudah digunakan dan customer respond positif.",
      rating: 5
    },
    {
      name: "Budi Santoso",
      role: "IT Consultant",
      content: "Interface yang user-friendly dan fitur yang lengkap.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="outline" className="mb-8 bg-blue-50 text-blue-700 border-blue-200">
              🚀 Platform Bot Telegram Terdepan
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Buat Bot Telegram
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Tanpa Coding
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Platform all-in-one untuk membuat, mengelola, dan mengoptimalkan bot Telegram Anda. 
              Dari customer service hingga marketing automation.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Mulai Gratis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Bot className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Lihat Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Fitur Lengkap untuk Bot Anda
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Semua yang Anda butuhkan untuk membuat bot Telegram yang powerful
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  isHovered === feature.title ? 'border-blue-300 shadow-lg' : ''
                }`}
                onMouseEnter={() => setIsHovered(feature.title)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Mengapa Memilih Platform Kami?
              </h2>
              
              <div className="space-y-4">
                {[
                  "Setup dalam hitungan menit, tidak perlu coding",
                  "Template bot siap pakai untuk berbagai industri", 
                  "Integrasi dengan payment gateway dan SMM panel",
                  "Analytics dan reporting real-time",
                  "Support 24/7 dari tim expert kami",
                  "Scalable untuk bisnis kecil hingga enterprise"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-75"></div>
                <Card className="relative bg-white">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>Bot Dashboard</CardTitle>
                        <CardDescription>Real-time monitoring</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Active Users</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          +1,234
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Messages Today</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          5,678
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">Response Rate</span>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          98.5%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Apa Kata Pengguna Kami
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Siap Memulai Bot Telegram Anda?
          </h2>
          <p className="mt-6 text-lg text-blue-100">
            Bergabung dengan ribuan bisnis yang sudah menggunakan platform kami untuk 
            mengotomatisasi customer service dan meningkatkan engagement.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Mulai Trial Gratis
              <Zap className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Hubungi Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">TeleBot Platform</span>
              </div>
              <p className="text-gray-400 mb-4">
                Platform terdepan untuk membuat dan mengelola bot Telegram dengan mudah. 
                Tanpa coding, maksimal hasil.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Bot Builder</li>
                <li>Templates</li>
                <li>Analytics</li>
                <li>Integrations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TeleBot Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
