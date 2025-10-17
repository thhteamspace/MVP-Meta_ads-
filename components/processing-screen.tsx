"use client"

import React, { useEffect, useState } from "react"
import { Brain, Search, Target, TrendingUp } from "lucide-react"
import type { FormData } from "@/app/page"

interface ProcessingScreenProps {
  formData: FormData
  isLoading?: boolean
}

export function ProcessingScreen({ formData, isLoading }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { icon: Search, text: "Connecting to Meta Ad Database", desc: "Establishing secure connection to webhook" },
    { icon: Target, text: "Filtering by Audience", desc: `Searching for ${formData.audience} in ${formData.country}` },
    { icon: TrendingUp, text: "Analyzing Performance", desc: "Processing ad performance metrics and engagement data" },
    { icon: Brain, text: "AI Analysis Complete", desc: "Generating personalized ad recommendations" },
  ]

  useEffect(() => {
    if (!isLoading) {
      // If not loading, show completion
      setProgress(100)
      setCurrentStep(steps.length - 1)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 80)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev: number) => {
        if (prev >= steps.length - 1) return steps.length - 1
        return prev + 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [isLoading, steps.length])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/30 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-thin text-white text-balance">
              AI is analyzing your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-light">
                perfect ads
              </span>
            </h1>
            <p className="text-gray-300 text-lg font-light">
              Searching for {formData.productName} ads targeting {formData.audience} in {formData.country}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm font-light">{progress}% Complete</p>
          </div>

          {/* Processing Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-white/10 backdrop-blur-sm border border-white/20 scale-105"
                      : isCompleted
                        ? "bg-white/5 backdrop-blur-sm border border-white/10 opacity-60"
                        : "opacity-30"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
                        : isCompleted
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-white/10"
                    }`}
                  >
                    <step.icon
                      className={`w-6 h-6 ${
                        isActive ? "text-white" : isCompleted ? "text-green-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`font-medium ${
                        isActive ? "text-white" : isCompleted ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {step.text}
                    </h3>
                    <p className={`text-sm font-light ${isActive ? "text-gray-300" : "text-gray-500"}`}>{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
