"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Heart, MessageCircle, Share, MoreHorizontal, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import type { AdData } from "@/app/page"

interface ResultsPageProps {
  adsData: AdData[]
  onAdsSelected: (ads: AdData[]) => void
  onBack: () => void
  onContentCreation?: (userFeedback: string) => void
}


export function ResultsPage({ adsData, onAdsSelected, onBack, onContentCreation }: ResultsPageProps) {
  const [ads, setAds] = useState<AdData[]>(adsData)
  const [selectedCount, setSelectedCount] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Update ads when adsData changes and filter out blank posts
  useEffect(() => {
    const filteredAds = adsData.filter(ad => {
      // Check if ad has essential data
      const hasValidId = ad.ad_archive_id && ad.ad_archive_id.trim() !== ''
      const hasValidPageName = ad.snapshot_page_name && ad.snapshot_page_name.trim() !== ''
      const hasValidMedia = (ad.video_hd_url && ad.video_hd_url.trim() !== '') || 
                           (ad.adURL && ad.adURL.trim() !== '')
      const hasValidFormat = ad.snapshot_display_format && ad.snapshot_display_format.trim() !== ''
      
      // Additional checks to ensure content is not just placeholders
      const pageName = ad.snapshot_page_name || ''
      const isNotPlaceholder = !pageName.toLowerCase().includes('sponsored') &&
                              !pageName.toLowerCase().includes('loading') &&
                              !pageName.toLowerCase().includes('placeholder')
      
      // Check if media URLs are not just placeholders
      const videoUrl = ad.video_hd_url || ''
      const imageUrl = ad.adURL || ''
      const hasRealMedia = (videoUrl && !videoUrl.includes('placeholder') && !videoUrl.includes('loading')) ||
                          (imageUrl && !imageUrl.includes('placeholder') && !imageUrl.includes('loading'))
      
      return hasValidId && hasValidPageName && hasValidMedia && hasValidFormat && isNotPlaceholder && hasRealMedia
    })
    setAds(filteredAds)
  }, [adsData])

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim() || !onContentCreation) return
    
    setIsSubmitting(true)
    try {
      await onContentCreation(feedback)
      setFeedback("")
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToVideo = (index: number) => {
    if (scrollRef.current) {
      const videoElement = scrollRef.current.children[index] as HTMLElement
      if (videoElement) {
        videoElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'center'
        })
        setCurrentVideoIndex(index)
      }
    }
  }

  const scrollLeft = () => {
    if (currentVideoIndex > 0) {
      scrollToVideo(currentVideoIndex - 1)
    }
  }

  const scrollRight = () => {
    if (currentVideoIndex < ads.length - 1) {
      scrollToVideo(currentVideoIndex + 1)
    }
  }

  const toggleAdSelection = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.ad_archive_id === adId) {
          const newSelected = !ad.selected
          setSelectedCount((current) => (newSelected ? current + 1 : current - 1))
          return { ...ad, selected: newSelected }
        }
        return ad
      }),
    )
  }

  const handleContinue = () => {
    const selectedAds = ads.filter((ad) => ad.selected)
    onAdsSelected(selectedAds)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const renderInstagramAd = (ad: AdData) => {
    const maxLength = 100;
    const shouldTruncate = ad.post_title && ad.post_title.length > maxLength;
    const displayText = shouldTruncate 
      ? ad.post_title.substring(0, maxLength) + '...' 
      : ad.post_title;

    return (
      <div className="bg-black rounded-2xl overflow-hidden w-full h-[500px] flex flex-col">
        {/* Video ID Header */}
        {ad.ad_archive_id && (
          <div className="bg-gray-800 px-3 py-1 text-xs text-gray-300">
            VIDEO ID: {ad.ad_archive_id}
          </div>
        )}

        {/* Instagram Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <img src={ad.snapshot_page_profile_picture_url || "/placeholder.svg"} alt={ad.snapshot_page_name || "Unknown"} className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm truncate">{ad.snapshot_page_name || "Unknown Page"}</div>
            <div className="text-gray-400 text-xs">instagram.com</div>
          </div>
          <div className="ml-auto">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Media Content */}
        <div className="relative flex-1">
          {ad.video_hd_url && ad.video_hd_url.trim() !== '' ? (
            <video 
              src={ad.video_hd_url} 
              className="w-full h-full object-cover" 
              controls
              poster={ad.adURL}
              onError={(e) => {
                console.log('Video failed to load, falling back to image');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : ad.adURL && ad.adURL.trim() !== '' ? (
            <img 
              src={ad.adURL} 
              alt="Ad content" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-gray-400 text-sm">No media available</div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        {ad.snapshot_cta_text && (
          <div className="p-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
              {ad.snapshot_cta_text}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-white" />
            <MessageCircle className="w-6 h-6 text-white" />
            <Share className="w-6 h-6 text-white" />
          </div>
          {ad.post_title && (
            <div className="text-white text-sm leading-relaxed">
              {displayText}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderFacebookAd = (ad: AdData) => {
    const maxLength = 100;
    const shouldTruncate = ad.post_title && ad.post_title.length > maxLength;
    const displayText = shouldTruncate 
      ? ad.post_title.substring(0, maxLength) + '...' 
      : ad.post_title;

    return (
      <div className="bg-white rounded-xl overflow-hidden w-full h-[500px] flex flex-col shadow-lg">
        {/* Facebook Header */}
        <div className="flex items-center gap-3 p-4">
          <img src={ad.snapshot_page_profile_picture_url || "/placeholder.svg"} alt={ad.snapshot_page_name || "Unknown"} className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{ad.snapshot_page_name || "Unknown Page"}</div>
            <div className="text-gray-500 text-xs">Sponsored</div>
          </div>
          <div className="ml-auto">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3 flex-shrink-0">
          {ad.snapshot_cta_text && (
            <div className="text-blue-600 text-sm font-medium mb-2">{ad.snapshot_cta_text}</div>
          )}
          {ad.post_title && (
            <div className="text-gray-900 text-sm leading-relaxed">
              {displayText}
            </div>
          )}
        </div>

        {/* Media */}
        <div className="relative flex-1">
          {ad.video_hd_url && ad.video_hd_url.trim() !== '' ? (
            <video 
              src={ad.video_hd_url} 
              className="w-full h-full object-cover" 
              controls
              poster={ad.adURL}
              onError={(e) => {
                console.log('Video failed to load, falling back to image');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : ad.adURL && ad.adURL.trim() !== '' ? (
            <img 
              src={ad.adURL} 
              alt="Ad content" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500 text-sm">No media available</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-blue-600">
                <Heart className="w-5 h-5" />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">Comment</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600">
                <Share className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-light text-white">Top Performing Ads</h1>
                <p className="text-gray-400 text-sm">Select ads that resonate with your vision</p>
              </div>
            </div>

            {selectedCount > 0 && (
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full"
              >
                Continue with {selectedCount} ads
              </Button>
            )}
          </div>
        </div>

        {/* Video Slider or Ads Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {ads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No ads data received from webhook</div>
              <div className="text-gray-500 text-sm">Please check your n8n webhook configuration and try again</div>
            </div>
          ) : ads.length > 1 ? (
            // Horizontal Video Slider
            <div className="space-y-6">
              {/* Video Slider Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Top Performing Ads</h2>
                  <p className="text-gray-400">Scroll through {ads.length} high-performing ads</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={scrollLeft}
                    disabled={currentVideoIndex === 0}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400 px-2">
                    {currentVideoIndex + 1} / {ads.length}
                  </span>
                  <Button
                    onClick={scrollRight}
                    disabled={currentVideoIndex === ads.length - 1}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Horizontal Video Slider */}
              <div className="relative">
                <div 
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {ads.map((ad, index) => (
                    <div 
                      key={ad.ad_archive_id} 
                      className="flex-shrink-0 w-80 snap-center"
                      onClick={() => scrollToVideo(index)}
                    >
                      <div className="space-y-4">
                        {/* Ad Card */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                          {/* Selection Checkbox */}
                          <div className="flex items-center gap-2 p-3 border-b border-white/10">
                            <Checkbox
                              checked={ad.selected}
                              onCheckedChange={() => toggleAdSelection(ad.ad_archive_id)}
                              className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <span className="text-white text-sm font-medium">Select this ad</span>
                          </div>

                          {/* Ad Preview */}
                          <div className="p-4">
                            {ad.snapshot_display_format?.toLowerCase().includes('video') ? renderInstagramAd(ad) : renderFacebookAd(ad)}
                          </div>
                        </div>

                        {/* Data Boxes */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Page Likes Box */}
                          {ad.snapshot_page_like_count && ad.snapshot_page_like_count > 0 && (
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                              <div className="text-blue-300 text-sm font-medium mb-1">Page Likes</div>
                              <div className="text-white text-lg font-bold">{formatNumber(ad.snapshot_page_like_count)}</div>
                            </div>
                          )}

                          {/* CTA Type Box */}
                          {ad.snapshot_cta_type && (
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                              <div className="text-green-300 text-sm font-medium mb-1">CTA Type</div>
                              <div className="text-white text-sm font-bold truncate">
                                {ad.snapshot_cta_type}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Debug Information */}
                        <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3">
                          <div className="text-gray-300 text-xs font-medium mb-2">Ad Details</div>
                          <div className="space-y-1 text-xs text-gray-400">
                            {ad.snapshot_cta_type && <div>Type: {ad.snapshot_cta_type}</div>}
                            {ad.snapshot_display_format && <div>Format: {ad.snapshot_display_format}</div>}
                            {ad.snapshot_cta_text && <div>CTA: {ad.snapshot_cta_text}</div>}
                            {ad.snapshot_page_name && <div>Page: {ad.snapshot_page_name}</div>}
                            {ad.snapshot_page_like_count && ad.snapshot_page_like_count > 0 && (
                              <div>Likes: {formatNumber(ad.snapshot_page_like_count)}</div>
                            )}
                          </div>
                        </div>

                        {/* Suggestion Box */}
                        {ad.suggession && (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <div className="text-yellow-400 text-sm font-medium mb-2">Suggestion</div>
                            <div className="text-yellow-300 text-sm italic">"{ad.suggession}"</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Indicators */}
              <div className="flex justify-center gap-2">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToVideo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentVideoIndex 
                        ? 'bg-blue-500 w-8' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleContinue}
                  disabled={selectedCount === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue with {selectedCount} selected ads
                </Button>
              </div>
            </div>
          ) : (
            // Single Ad Display
            <div className="grid lg:grid-cols-3 gap-8">
              {ads.map((ad) => (
              <div key={ad.ad_archive_id} className="space-y-4">
                {/* Ad Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                  {/* Selection Checkbox */}
                  <div className="flex items-center gap-2 p-3 border-b border-white/10">
                    <Checkbox
                      checked={ad.selected}
                      onCheckedChange={() => toggleAdSelection(ad.ad_archive_id)}
                      className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className="text-white text-sm font-medium">Select this ad</span>
                  </div>

                  {/* Ad Preview */}
                  <div className="p-4">
                    {ad.snapshot_display_format?.toLowerCase().includes('video') ? renderInstagramAd(ad) : renderFacebookAd(ad)}
                  </div>
                </div>

                {/* Data Boxes */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Page Likes Box */}
                  {ad.snapshot_page_like_count && ad.snapshot_page_like_count > 0 && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="text-blue-300 text-sm font-medium mb-1">Page Likes</div>
                      <div className="text-white text-lg font-bold">{formatNumber(ad.snapshot_page_like_count)}</div>
                    </div>
                  )}

                  {/* CTA Type Box */}
                  {ad.snapshot_cta_type && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <div className="text-green-300 text-sm font-medium mb-1">CTA Type</div>
                      <div className="text-white text-sm font-bold truncate">
                        {ad.snapshot_cta_type}
                      </div>
                    </div>
                  )}
                </div>

                {/* Debug Information */}
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3">
                  <div className="text-gray-300 text-xs font-medium mb-2">Ad Details</div>
                  <div className="space-y-1 text-xs text-gray-400">
                    {ad.snapshot_cta_type && <div>Type: {ad.snapshot_cta_type}</div>}
                    {ad.snapshot_display_format && <div>Format: {ad.snapshot_display_format}</div>}
                    {ad.snapshot_cta_text && <div>CTA: {ad.snapshot_cta_text}</div>}
                    {ad.snapshot_page_name && <div>Page: {ad.snapshot_page_name}</div>}
                    {ad.snapshot_page_like_count && ad.snapshot_page_like_count > 0 && (
                      <div>Likes: {formatNumber(ad.snapshot_page_like_count)}</div>
                    )}
                  </div>
                </div>

                {/* Suggestion Box */}
                {ad.suggession && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="text-yellow-400 text-sm font-medium mb-2">Suggestion</div>
                    <div className="text-yellow-300 text-sm italic">"{ad.suggession}"</div>
                  </div>
                )}
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestion Text and Feedback Box */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="space-y-6">
            {/* Suggestion Text */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                AI Suggestions
              </h3>
              <div className="text-gray-300 leading-relaxed space-y-3">
                <p>
                  Based on the analysis of top-performing ads in your category, here are our AI-powered recommendations:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Use strong emotional hooks in the first 3 seconds of video content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Include clear value propositions with specific benefits and numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Leverage user-generated content style for authenticity and trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Add urgency-driven CTAs like "Start Free Trial" or "Limited Time Offer"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Test different formats: carousel posts, stories, and reels for maximum reach</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feedback Box */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Share Your Feedback</h3>
              <p className="text-gray-400 text-sm mb-4">
                Tell us what you think about these ads or what specific improvements you'd like to see in your content.
              </p>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback or suggestions..."
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg px-4 py-3"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleFeedbackSubmit()
                    }
                  }}
                />
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim() || isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Press Enter to send • Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
