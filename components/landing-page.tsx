"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-light text-white tracking-wide">Meta Ads Automation</span>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-thin text-white leading-tight text-balance">
              Discover
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-light">
                Top-Performing
              </span>
              Meta Ads
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed text-pretty">
              Analyze the best-performing ads in your category and create campaigns that convert with AI-powered
              insights
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Target, title: "Smart Targeting", desc: "AI-powered audience analysis" },
              { icon: TrendingUp, title: "Performance Insights", desc: "Real-time metrics & analytics" },
              { icon: Zap, title: "Instant Results", desc: "Get top ads in seconds" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm font-light">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
