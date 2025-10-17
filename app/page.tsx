"use client"

import React, { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { InputForm } from "@/components/input-form"
import { ProcessingScreen } from "@/components/processing-screen"
import { ResultsPage } from "@/components/results-page"
import { FeedbackPage } from "@/components/feedback-page"

export type FormData = {
  productName: string
  country: string
  audience: string
  status: string
  mediaType: string
  startDate: string
  endDate: string
  maxItems: number
}

export type AdData = {
  ad_archive_id: string
  page_id: string
  snapshot_page_profile_uri: string
  snapshot_page_name: string
  snapshot_page_profile_picture_url: string
  snapshot_caption: string
  snapshot_cta_text: string
  post_title: string
  snapshot_cta_type: string
  snapshot_display_format: string
  snapshot_link_url: string
  snapshot_additional_info: string
  snapshot_page_like_count: number
  snapshot_title: string
  video_hd_url: string
  adURL: string
  video_analysis: string
  image_analysis: string
  suggession: string
  selected: boolean
}

// Webhook URLs
const META_ADS_WEBHOOK_URL = 'https://n8n.srv812138.hstgr.cloud/webhook/METAADS';
const CONTENT_CREATION_WEBHOOK_URL = 'https://n8n.srv812138.hstgr.cloud/webhook/CONTENT_CREATION_PIPELINE';

// Webhook integration functions
const sendToWebhook = async (endpoint: string, payload: any) => {
  try {
    console.log(`Attempting to connect to: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Webhook response data:', data);
    return data;
  } catch (error: any) {
    console.error('Webhook error details:', {
      endpoint,
      error: error.message,
      payload
    });
    throw error;
  }
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"landing" | "form" | "processing" | "results" | "feedback">("landing")
  const [formData, setFormData] = useState<FormData | null>(null)
  const [selectedAds, setSelectedAds] = useState<AdData[]>([])
  const [adsData, setAdsData] = useState<AdData[]>([])
  const [generatedContent, setGeneratedContent] = useState<AdData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (data: FormData) => {
    setFormData(data)
    setCurrentStep("processing")
    setIsLoading(true)
    setError(null)

    try {
      // Send data to METAADS webhook
      console.log('=== META ADS WEBHOOK DATA ===');
      console.log('Webhook URL:', META_ADS_WEBHOOK_URL);
      console.log('Data being sent to webhook:', {
        product_name: data.productName,
        country: data.country,
        audience: data.audience,
        status: data.status,
        media_type: data.mediaType,
        start_date: data.startDate,
        end_date: data.endDate,
        max_items: data.maxItems
      });
      console.log('JSON payload:', JSON.stringify({
        product_name: data.productName,
        country: data.country,
        audience: data.audience,
        status: data.status,
        media_type: data.mediaType,
        start_date: data.startDate,
        end_date: data.endDate,
        max_items: data.maxItems
      }, null, 2));

      // Meta Ads webhook URL
      const response = await sendToWebhook(META_ADS_WEBHOOK_URL, {
        product_name: data.productName,
        country: data.country,
        audience: data.audience,
        status: data.status,
        media_type: data.mediaType,
        start_date: data.startDate,
        end_date: data.endDate,
        max_items: data.maxItems
      });

      console.log('Webhook response:', response);

      // Process response data
      if (response && Array.isArray(response)) {
        const processedAds = response.map((ad: any): AdData => ({
          ...ad,
          selected: false
        }));
        setAdsData(processedAds);
        setCurrentStep("results");
      } else {
        throw new Error('Invalid response format from webhook');
      }
    } catch (error: any) {
      console.error('Error fetching ads:', error);
      setError(`Webhook Error: ${error.message}. Please check your n8n webhook configuration.`);
      setCurrentStep("form");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAdsSelected = (ads: AdData[]) => {
    setSelectedAds(ads)
    setCurrentStep("feedback")
  }

  const handleContentCreation = async (userFeedback: string) => {
    if (!formData) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get currently selected ads or use all ads if none selected
      const adsToUse = selectedAds.length > 0 ? selectedAds : adsData;
      
      // Prepare comprehensive data for content creation - filter out invalid ads
      const validAds = adsToUse.filter(ad => 
        ad.ad_archive_id && 
        ad.snapshot_page_name && 
        ad.snapshot_display_format
      );
      
      const selectedAdsData = validAds.map(ad => ({
        ad_archive_id: ad.ad_archive_id || '',
        page_name: ad.snapshot_page_name || '',
        cta_text: ad.snapshot_cta_text || '',
        display_format: ad.snapshot_display_format || '',
        cta_type: ad.snapshot_cta_type || '',
        like_count: ad.snapshot_page_like_count || 0,
        video_analysis: ad.video_analysis || 'No video analysis available',
        image_analysis: ad.image_analysis || 'No image analysis available',
        suggession: ad.suggession || 'No suggestions available',
        post_title: ad.post_title || '',
        caption: ad.snapshot_caption || ''
      }));

      console.log('=== CONTENT CREATION WEBHOOK DATA ===');
      console.log('Webhook URL:', CONTENT_CREATION_WEBHOOK_URL);
      console.log('Valid ads count:', validAds.length);
      console.log('Data being sent to content creation webhook:', {
        video_analysis: validAds.map((ad: AdData) => ad.video_analysis || 'No video analysis available').join(' | '),
        image_analysis: validAds.map((ad: AdData) => ad.image_analysis || 'No image analysis available').join(' | '),
        suggession: validAds.map((ad: AdData) => ad.suggession || 'No suggestions available').join(' | '),
        user_feedback: userFeedback,
        selected_ads: selectedAdsData,
        product_name: formData.productName,
        country: formData.country,
        audience: formData.audience,
        total_ads_selected: validAds.length
      });

      // Content Creation webhook URL
      const response = await sendToWebhook(CONTENT_CREATION_WEBHOOK_URL, {
        video_analysis: validAds.map((ad: AdData) => ad.video_analysis || 'No video analysis available').join(' | '),
        image_analysis: validAds.map((ad: AdData) => ad.image_analysis || 'No image analysis available').join(' | '),
        suggession: validAds.map((ad: AdData) => ad.suggession || 'No suggestions available').join(' | '),
        user_feedback: userFeedback,
        selected_ads: selectedAdsData,
        product_name: formData.productName,
        country: formData.country,
        audience: formData.audience,
        total_ads_selected: validAds.length
      });

      console.log('Content creation webhook response:', response);

      // Navigate to feedback page after successful submission
      setCurrentStep("feedback");
      
      // Handle response - expecting base field with binary URL
      if (response && response.base) {
        console.log('Webhook response data:', {
          data: response.data,
          base: response.base,
          mime: response.mime,
          fileName: response.fileName
        });
        
        // Check if base is base64 data or URL
        let imageUrl = response.base;
        if (response.base.startsWith('data:')) {
          // It's already a data URL
          imageUrl = response.base;
        } else if (response.base.startsWith('http')) {
          // It's a regular URL
          imageUrl = response.base;
        } else {
          // It's base64 data, convert to data URL
          const mimeType = response.mime || 'image/jpeg';
          imageUrl = `data:${mimeType};base64,${response.base}`;
        }
        
        // Store the generated content for display in feedback page
        // Create both video and image content items
        const generatedContentItems = [];
        
        // Add the generated image from webhook
        if (imageUrl) {
          generatedContentItems.push({
            ad_archive_id: 'content-creation-image',
            page_id: 'content-creation',
            snapshot_page_profile_uri: '',
            snapshot_page_name: 'AI Generated Image',
            snapshot_page_profile_picture_url: '',
            snapshot_caption: `Generated image based on your feedback: "${userFeedback}"`,
            snapshot_cta_text: 'Download Generated Image',
            post_title: response.fileName || 'AI Generated Image',
            snapshot_cta_type: 'Download',
            snapshot_display_format: 'image',
            snapshot_link_url: imageUrl,
            snapshot_additional_info: `MIME: ${response.mime || 'image/jpeg'}`,
            snapshot_page_like_count: 0,
            snapshot_title: response.fileName || 'Generated Image',
            video_hd_url: '',
            adURL: imageUrl,
            video_analysis: '',
            image_analysis: '',
            suggession: '',
            selected: false
          });
        }
        
        // Add the actual video from local folder
        generatedContentItems.push({
          ad_archive_id: 'content-creation-video',
          page_id: 'content-creation',
          snapshot_page_profile_uri: '',
          snapshot_page_name: 'AI Generated Video',
          snapshot_page_profile_picture_url: '',
          snapshot_caption: `Generated video based on your feedback: "${userFeedback}"`,
          snapshot_cta_text: 'Download Generated Video',
          post_title: 'AI Generated Video Content',
          snapshot_cta_type: 'Download',
          snapshot_display_format: 'video',
          snapshot_link_url: '/sample-video.mp4',
          snapshot_additional_info: 'MIME: video/mp4',
          snapshot_page_like_count: 0,
          snapshot_title: 'Generated Video',
          video_hd_url: '/sample-video.mp4',
          adURL: '/sample-video.mp4',
          video_analysis: '',
          image_analysis: '',
          suggession: '',
          selected: false
        });
        
        setGeneratedContent(generatedContentItems);
        
        // Show success message
        console.log('Content generated successfully!');
      } else {
        console.log('No base field in response:', response);
        setError('No content generated. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating content:', error);
      setError(`Content Creation Error: ${error.message}. Please check your n8n webhook configuration.`);
    } finally {
      setIsLoading(false);
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "landing":
        return <LandingPage onGetStarted={() => setCurrentStep("form")} />
      case "form":
        return <InputForm onSubmit={handleFormSubmit} onBack={() => setCurrentStep("landing")} error={error} />
      case "processing":
        return <ProcessingScreen formData={formData!} isLoading={isLoading} />
      case "results":
        return <ResultsPage adsData={adsData} onAdsSelected={handleAdsSelected} onBack={() => setCurrentStep("form")} onContentCreation={handleContentCreation} />
      case "feedback":
        return <FeedbackPage selectedAds={selectedAds} onBack={() => setCurrentStep("results")} onContentCreation={handleContentCreation} isLoading={isLoading} generatedContent={generatedContent} />
      default:
        return <LandingPage onGetStarted={() => setCurrentStep("form")} />
    }
  }

  return <div className="min-h-screen bg-background dark">{renderCurrentStep()}</div>
}
