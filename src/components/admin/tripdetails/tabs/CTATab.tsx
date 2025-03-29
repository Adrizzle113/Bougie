//components/admin/tripdetails/tabs/CTATab.tsx

import React, { useState, useEffect } from 'react';
import type { AdminTrip, CTAContent, TimelineItem, ActivityContent } from '@/types/luxuryTrip.types';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-input";
import { Star } from 'lucide-react';

interface CTATabProps {
  tripData: AdminTrip;
  updateField: <K extends keyof AdminTrip>(key: K, value: AdminTrip[K]) => void;
}

const DEFAULT_CTA: CTAContent = {
  mainButtonText: 'Book Your Journey',
  secondaryButtonText: 'Download Itinerary',
  heading: 'Ready to Begin Your Journey?',
  description: 'Experience luxury travel like never before. Contact us to start planning your bespoke adventure.',
  mainButtonLink: ''
};

export default function CTATab({ tripData, updateField }: CTATabProps) {
  const [error, setError] = useState<string | null>(null);

  // Update highlights whenever itinerary changes
  useEffect(() => {
    if (tripData.itinerary) {
      const highlights = getHighlightsFromItinerary(tripData.itinerary);
      if (JSON.stringify(highlights) !== JSON.stringify(tripData.highlights)) {
        updateField('highlights', highlights);
      }
    }
  }, [tripData.itinerary]);

  const handleUpdateCta = (key: keyof CTAContent, value: string) => {
    const updatedCta = {
      ...(tripData.cta || DEFAULT_CTA),
      [key]: value
    };
    updateField('cta', updatedCta);
  };

  // Helper function to get highlights from itinerary
  const getHighlightsFromItinerary = (itinerary: AdminTrip['itinerary']): string[] => {
    const highlights = itinerary.reduce<string[]>((acc, day) => {
      const dayHighlights = day.timeline
        .filter((item: TimelineItem) => {
          if (item.type !== 'activity') return false;
          const content = item.content as ActivityContent;
          return content.isHighlight && content.text;
        })
        .map((item: TimelineItem) => (item.content as ActivityContent).text);
      
      return [...acc, ...dayHighlights];
    }, []);

    return highlights.slice(0, 6); // Limit to 6 highlights
  };

  const cta = tripData.cta || DEFAULT_CTA;
  const highlights = tripData.highlights || [];

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Call to Action Settings</h3>
        </div>
        
        {/* Trip Highlights Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-900">Trip Highlights</h4>
            <span className="text-sm text-gray-500">
              {highlights.length}/6 highlights selected
            </span>
          </div>
          
          <div className="grid gap-3">
            {highlights.length > 0 ? (
              highlights.map((highlight: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{highlight}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Mark activities as highlights in the itinerary tab to display them here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Form Fields */}
        <div className="grid gap-6">
          <FormField label="Heading">
            <Input
              value={cta.heading}
              onChange={(e) => handleUpdateCta('heading', e.target.value)}
              placeholder="Enter CTA heading"
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={cta.description}
              onChange={(e) => handleUpdateCta('description', e.target.value)}
              placeholder="Enter CTA description"
              rows={4}
            />
          </FormField>

          <FormField label="Main Button Text">
            <Input
              value={cta.mainButtonText}
              onChange={(e) => handleUpdateCta('mainButtonText', e.target.value)}
              placeholder="Enter main button text"
            />
          </FormField>

          <FormField label="Secondary Button Text">
            <Input
              value={cta.secondaryButtonText}
              onChange={(e) => handleUpdateCta('secondaryButtonText', e.target.value)}
              placeholder="Enter secondary button text"
            />
          </FormField>

          <FormField label="Main Button Link">
            <Input
              value={cta.mainButtonLink}
              onChange={(e) => handleUpdateCta('mainButtonLink', e.target.value)}
              placeholder="Enter main button link"
            />
          </FormField>
        </div>

        {/* Preview Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
          <div className="p-6 border rounded-lg bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{cta.heading}</h3>
            
            {/* Highlights Preview */}
            {highlights.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Trip Highlights</h4>
                <div className="grid gap-2">
                  {highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-gray-600 mb-6">{cta.description}</p>
            <div className="space-y-3">
              <button className="w-full bg-[#17403a] hover:bg-[#0f2d28] text-white px-4 py-2 rounded-md">
                {cta.mainButtonText}
              </button>
              <button className="w-full border border-[#17403a] text-[#17403a] hover:bg-gray-50 px-4 py-2 rounded-md">
                {cta.secondaryButtonText}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}