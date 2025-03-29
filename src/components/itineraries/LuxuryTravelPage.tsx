// src/components/itineraries/LuxuryTravelPage.tsx
'use client';

import { useState, useEffect } from 'react';
import type { 
  AdminTrip,
  AdminTripStatus,
  TripImage,
  TripSummary,
  ItineraryItem
} from '@/types/luxuryTrip.types';
import ItineraryNavigation from '@/components/navigation/itinerary/ItineraryNavigation';
import ImagePanel from './itinerarytemplate/imagepanel/ImagePanel';
import WelcomeSection from './itinerarytemplate/welcomepage/WelcomeSection';
import TravelBrief from './itinerarytemplate/travelbrief/TraveBrief';
import Map from './itinerarytemplate/map/map';
import WhatsIncluded from './itinerarytemplate/Include/WhatsIncluded';
import Itinerary from './itinerarytemplate/days/itinerary';
import Terms from './itinerarytemplate/terms/Terms';
import { CTA } from './itinerarytemplate/cta/CTA';
import { createNewTripImage } from '@/lib/utils';

type UserTripStatus = 'upcoming' | 'completed' | 'cancelled';

interface LuxuryTravelPageProps {
  tripData: AdminTrip;
}

const convertStatus = (adminStatus: AdminTripStatus): UserTripStatus => {
  switch (adminStatus) {
    case 'published':
      return 'upcoming';
    case 'archived':
      return 'completed';
    default:
      return 'upcoming';
  }
};

const addIdsToImages = (images: TripImage[]): TripImage[] => {
  return images.map(img => ({
    ...img,
    id: img.id || crypto.randomUUID()
  }));
};

const filterAndProcessImages = (images: TripImage[], section?: string | string[]): TripImage[] => {
  let filtered: TripImage[];
  
  if (Array.isArray(section)) {
    filtered = images.filter(img => img.section && section.includes(img.section));
  } else {
    filtered = images.filter(img => img.section === section || (!section && !img.section));
  }

  return addIdsToImages(filtered);
};

export default function LuxuryTravelPage({ tripData }: LuxuryTravelPageProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentImages, setCurrentImages] = useState<TripImage[]>(() => 
    filterAndProcessImages(tripData.images, 'overview')
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'overview';

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          current = section.id;
        }
      });

      if (current !== activeSection) {
        setActiveSection(current);
        updateImages(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, tripData.images]);

  const updateImages = (section: string) => {
    const sectionMapping: Record<string, string[]> = {
      'overview': ['overview'],
      'travel-brief': ['travelBrief'],
      'locations': ['map', 'locations'],
      'itinerary': ['itinerary'],
      'inclusions': ['inclusions'],
      'cta': ['cta'],
      'terms': ['terms']
    };

    const validSections = sectionMapping[section] || ['overview'];
    const sectionImages = filterAndProcessImages(tripData.images, validSections);

    setCurrentImages(
      sectionImages.length > 0 
        ? sectionImages 
        : filterAndProcessImages(tripData.images, 'overview')
    );
  };

  const calculateDuration = () => {
    if (!tripData.itinerary) return '';
    return `${tripData.itinerary.length} Days`;
  };

  const addIdsToItineraryItems = (items: ItineraryItem[]): ItineraryItem[] => {
    return items.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID(),
      timeline: item.timeline.map(timelineItem => ({
        ...timelineItem,
        id: timelineItem.id || crypto.randomUUID(),
        content: {
          ...timelineItem.content,
          id: ('id' in timelineItem.content) 
            ? timelineItem.content.id 
            : crypto.randomUUID()
        }
      }))
    }));
  };

  const tripSummary: TripSummary = {
    id: tripData.id,
    title: tripData.title,
    subtitle: tripData.subtitle || '',
    status: convertStatus(tripData.status),
    duration: calculateDuration(),
    destinations: tripData.mapLocations?.map(loc => loc.location) || [],
    startDate: tripData.startDate || "2024",
    highlights: tripData.highlights || [],
    images: currentImages,
    pricing: tripData.pricing
  };

  const processedItinerary = addIdsToItineraryItems(tripData.itinerary || []);

  return (
    <div className="flex min-h-screen w-full relative">
      <div className="fixed w-1/2 h-screen top-0 left-0 bg-[#1a1a1a] overflow-hidden hidden lg:block">
        <div className="relative h-full w-full">
          <ImagePanel
            images={currentImages}
            activeSection={activeSection}
          />
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen bg-[#e7decf] transition-all duration-300 relative">
        <ItineraryNavigation tripData={tripData} />
        <div className="pt-16">
          <section id="overview" className="min-h-screen p-8 relative scroll-mt-16">
            <WelcomeSection 
              title={tripData.title}
              subtitle={tripData.subtitle}
              startDate={tripData.startDate}
              endDate={tripData.endDate}
            />
          </section>
          
          <section id="travel-brief" className="min-h-screen p-8 relative scroll-mt-16">
            <TravelBrief 
              travelBrief={tripData.travelBrief}
            />
          </section>
    
          <section id="locations" className="min-h-screen p-8 relative scroll-mt-16">
            <Map 
              locations={tripData.mapLocations}
              mapUrl={tripData.travelBrief?.mapUrl} 
            />
          </section>
          
          <section id="inclusions" className="min-h-screen p-8 relative scroll-mt-16">
            <WhatsIncluded 
              included={tripData.included}
              excluded={tripData.excluded}
            />
          </section>
          
          <section id="itinerary" className="min-h-screen p-8 relative scroll-mt-16">
            <Itinerary 
              items={processedItinerary}
            />
          </section>
          
          <section id="cta">
            <CTA tripData={tripSummary} />
          </section>
                  
          <section id="terms" className="min-h-screen p-8 relative scroll-mt-16">
            <Terms customTerms={tripData.terms} />
          </section>
        </div>
      </div>
    </div>
  );
}