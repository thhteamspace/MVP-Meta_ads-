"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Bot, User, Sparkles, Wand2, Download, Image, Video } from "lucide-react"
import type { AdData } from "@/app/page"

interface FeedbackPageProps {
  selectedAds: AdData[]
  onBack: () => void
  onContentCreation: (userFeedback: string) => void
  isLoading?: boolean
  generatedContent?: AdData[]
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function FeedbackPage({ selectedAds, onBack, onContentCreation, isLoading, generatedContent = [] }: FeedbackPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Welcome to your AI Strategy Session! I'm here to help you create amazing ad content. Based on high-performing patterns, I recommend creating ads with:\n\n• Strong emotional hooks in the first 3 seconds\n• Clear value propositions with specific benefits\n• User-generated content style for authenticity\n• Call-to-action buttons with urgency ("Start Free Trial")\n\nWhat specific aspect of your product would you like to highlight most?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userFeedback = inputValue
    setInputValue("")

    // Trigger content creation pipeline
    onContentCreation(userFeedback)

    // Show AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Perfect! I'm analyzing your feedback and the selected ads to create personalized content. This will combine the best elements from the high-performing ads with your specific requirements. The content creation pipeline is now processing your request...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-light text-white">AI Strategy Session</h1>
                <p className="text-gray-400 text-sm">Get personalized recommendations for your campaign</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => onContentCreation("Generate content based on selected ads")}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Go Through
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">AI Expert Active</span>
              </div>
            </div>
          </div>
        </div>


        {/* Chat Messages */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "ai" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <Card
                  className={`max-w-2xl p-4 ${
                    message.type === "user"
                      ? "bg-blue-600/20 border-blue-600/30 text-white"
                      : "bg-white/10 border-white/20 text-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </Card>

                {message.type === "user" && (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generated Content Display */}
        {isLoading && generatedContent.length === 0 && (
          <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-6">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-white/10 rounded-lg px-6 py-4">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white font-medium">Generating AI content...</span>
                </div>
                <p className="text-gray-400 text-sm mt-3">Please wait while we create personalized content based on your feedback</p>
              </div>
            </div>
          </div>
        )}

        {/* Local Video Content - Always Visible */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-semibold text-white mb-3">🎥 Your Content Library</h3>
              <p className="text-gray-300 text-lg">Video and image content from your local video folder</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Video from Google Drive */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                    <span className="text-2xl">🎥</span>
                    <span className="font-medium">Video Content</span>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 shadow-2xl">
                  <div className="aspect-video bg-gray-900">
                    <video 
                      src="/sample-video.mp4" 
                      className="w-full h-full object-cover" 
                      controls
                      preload="metadata"
                      poster="/sample-image.png"
                      onError={(e) => {
                        console.log('Local video failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold text-lg mb-3">Video Content</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    High-quality video content from your local video folder. Click play to view the full video.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Format: MP4 Video</span>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/sample-video.mp4';
                        link.download = 'sample-video.mp4';
                        link.click();
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image from Google Drive */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
                    <span className="text-2xl">🖼️</span>
                    <span className="font-medium">Image Content</span>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 shadow-2xl">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <img 
                      src="/sample-image.png" 
                      alt="Sample image content" 
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Local image loaded successfully')}
                      onError={(e) => {
                        console.log('Local image failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold text-lg mb-3">Image Content</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    High-resolution image content from your local video folder. Click to view full size.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Format: PNG Image</span>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/sample-image.png';
                        link.download = 'sample-image.png';
                        link.click();
                      }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {generatedContent.length > 0 && (
          <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-6">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">🎉 AI Generated Content</h3>
                <p className="text-gray-300 text-sm">Your personalized content is ready!</p>
                {generatedContent.length > 1 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      ✨ Generated both video and image content based on your feedback and selected ads
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {generatedContent.map((content, index) => {
                  return (
                    <div key={content.ad_archive_id || index} className="space-y-4">
                      {/* Content Type Badge */}
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          content.snapshot_display_format === 'video' 
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {content.snapshot_display_format === 'video' ? '🎥 Video' : '🖼️ Image'}
                        </div>
                        <span className="text-gray-400 text-sm">{content.snapshot_page_name}</span>
                      </div>

                      {/* Media Display */}
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                        <div className="aspect-video bg-gray-800 flex items-center justify-center">
                          {content.adURL ? (
                            content.snapshot_display_format === 'video' ? (
                              <video 
                                src={content.adURL} 
                                className="w-full h-full object-cover" 
                                controls
                                poster={content.adURL}
                                onError={(e) => {
                                  console.log('Video failed to load, falling back to image');
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <img 
                                src={content.adURL} 
                                alt="Generated content" 
                                className="w-full h-full object-cover"
                                onLoad={() => console.log('Generated content loaded successfully')}
                                onError={(e) => {
                                  console.log('Image failed to load:', content.adURL);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )
                          ) : (
                            <div className="text-gray-400 text-center p-8">
                              <Image className="w-12 h-12 mx-auto mb-2" />
                              <p>No content available</p>
                              <p className="text-xs mt-1">adURL: {content.adURL || 'undefined'}</p>
                            </div>
                          )}
                        </div>
                      </div>

                    {/* Description */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm">
                          {content.post_title || "AI Generated Content"}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {content.snapshot_caption || "Generated content based on your selected ads and feedback"}
                        </p>
                        {content.snapshot_additional_info && (
                          <p className="text-gray-400 text-xs">
                            {content.snapshot_additional_info}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Download Button */}
                    <Button
                      onClick={() => {
                        if (content.adURL) {
                          const link = document.createElement('a');
                          link.href = content.adURL;
                          
                          // Determine file extension based on MIME type or display format
                          let extension = 'jpg';
                          if (content.snapshot_display_format?.toLowerCase() === 'video') {
                            extension = 'mp4';
                          } else if (content.snapshot_additional_info?.includes('image/png')) {
                            extension = 'png';
                          } else if (content.snapshot_additional_info?.includes('image/gif')) {
                            extension = 'gif';
                          }
                          
                          link.download = `generated-content-${index + 1}.${extension}`;
                          link.click();
                        }
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      disabled={!content.adURL}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {content.snapshot_display_format?.toLowerCase() === 'video' ? 'Download Video' : 'Download Image'}
                    </Button>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts about the selected ads or ask for specific recommendations..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
