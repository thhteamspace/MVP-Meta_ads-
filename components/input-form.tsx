"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Search } from "lucide-react"
import type { FormData } from "@/app/page"

interface InputFormProps {
  onSubmit: (data: FormData) => void
  onBack: () => void
  error?: string | null
}

export function InputForm({ onSubmit, onBack, error }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    country: "",
    audience: "",
    status: "",
    mediaType: "",
    startDate: "",
    endDate: "",
    maxItems: 10,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Button variant="ghost" onClick={onBack} className="absolute top-8 left-8 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <h1 className="text-4xl md:text-5xl font-thin text-white mb-4 text-balance">Campaign Parameters</h1>
            <p className="text-gray-300 text-lg font-light text-pretty">
              Tell us about your product and target audience
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Form Card */}
          <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-gray-200 font-medium">
                    Product Name / Keywords
                  </Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => updateField("productName", e.target.value)}
                    placeholder="e.g., Fitness App, Organic Skincare"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-200 font-medium">
                    Country
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-blue-400">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="IN">India (IN)</SelectItem>
                      <SelectItem value="US">United States (US)</SelectItem>
                      <SelectItem value="UK">United Kingdom (UK)</SelectItem>
                      <SelectItem value="CA">Canada (CA)</SelectItem>
                      <SelectItem value="AU">Australia (AU)</SelectItem>
                      <SelectItem value="DE">Germany (DE)</SelectItem>
                      <SelectItem value="FR">France (FR)</SelectItem>
                      <SelectItem value="BR">Brazil (BR)</SelectItem>
                      <SelectItem value="JP">Japan (JP)</SelectItem>
                      <SelectItem value="CN">China (CN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-gray-200 font-medium">
                    Audience
                  </Label>
                  <Select value={formData.audience} onValueChange={(value) => updateField("audience", value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-blue-400">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Tech Enthusiasts">Tech Enthusiasts</SelectItem>
                      <SelectItem value="Fashion Lovers">Fashion Lovers</SelectItem>
                      <SelectItem value="Food & Lifestyle">Food & Lifestyle</SelectItem>
                      <SelectItem value="Sports Fans">Sports Fans</SelectItem>
                      <SelectItem value="Business Professionals">Business Professionals</SelectItem>
                      <SelectItem value="General Audience">General Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-medium">
                    Status
                  </Label>
                  <div className="space-y-3">
                    {[
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                      { value: "Both", label: "Both" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`status-${option.value}`}
                          name="status"
                          value={option.value}
                          checked={formData.status === option.value}
                          onChange={(e) => updateField("status", e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500 focus:ring-2"
                        />
                        <Label htmlFor={`status-${option.value}`} className="text-gray-200 font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-medium">
                    Media Type
                  </Label>
                  <div className="space-y-3">
                    {[
                      { value: "Video", label: "Video" },
                      { value: "Image", label: "Image" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`media-${option.value}`}
                          checked={formData.mediaType.includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateField("mediaType", formData.mediaType ? `${formData.mediaType}, ${option.value}` : option.value)
                            } else {
                              updateField("mediaType", formData.mediaType.replace(option.value, "").replace(/^,\s*|,\s*$/g, "").replace(/,\s*,/g, ","))
                            }
                          }}
                          className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor={`media-${option.value}`} className="text-gray-200 font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-200 font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    className="bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-200 font-medium">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                    className="bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/20"
                    required
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-medium rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
                >
                  <Search className="mr-2 w-5 h-5" />
                  Find Top Performing Ads
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
