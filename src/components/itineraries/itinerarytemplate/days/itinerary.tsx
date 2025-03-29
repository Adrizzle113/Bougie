//components/itineraries/itinerarytemplate/days/itinerary.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Mountain,
  Hotel,
  Ship,
  Train,
  Bus,
  BellRing,
  PlaneLanding,
  PlaneTakeoff,
  Plane,
  Car,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { 
  TimelineItem, 
  ItineraryItem, 
  MoreDetails, 
  ActivityContent,
  ActivityType 
} from '@/types/luxuryTrip.types';
import { Button } from "@/components/ui/button";
import PublicMediaGallery from './PublicMediaGallery';
import styles from './Itinerary.module.css';

interface ItineraryProps {
  items?: ItineraryItem[];
  onUpdate?: (newItems: ItineraryItem[]) => void;
}

const ACTIVITY_ICONS = {
  'Activity': Mountain,
  'Destination': MapPin,
  'Hotel': Hotel,
  'Boat': Ship,
  'Train': Train,
  'Group Transportation': Bus,
  'Check-In': BellRing,
  'Arrival': PlaneLanding,
  'Departure': PlaneTakeoff,
  'Internal Flight': Plane,
  'Transfer': Car,
} as const;

export default function Itinerary({ items = [], onUpdate }: ItineraryProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dayIndex = Number(entry.target.getAttribute('data-day-index'));
          if (!isNaN(dayIndex)) {
            setActiveDay(dayIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('[data-day-index]').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items.length]);

  const getDayTitle = (index: number): string => {
    const dayNumber = index + 1;
    
    if (items.length === 1) return 'Day One';

    const numberToText = [
      'One', 'Two', 'Three', 'Four', 'Five', 
      'Six', 'Seven', 'Eight', 'Nine'
    ];

    if (dayNumber <= 9) return `Day ${numberToText[dayNumber - 1]}`;

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = dayNumber % 10 <= 3 && dayNumber % 100 !== 11 && dayNumber % 100 !== 12 && dayNumber % 100 !== 13
      ? suffixes[dayNumber % 10]
      : suffixes[0];

    return `Day ${dayNumber}${suffix}`;
  };

  const getActivityIcon = (type: ActivityType | undefined) => {
    if (!type) return <Clock className={styles.activityIcon} />;

    const typeStr = String(type).trim();
    const activityType = typeStr.includes(':') 
      ? typeStr.split(':')[0].trim()
      : typeStr;
    
    const IconComponent = ACTIVITY_ICONS[activityType as keyof typeof ACTIVITY_ICONS] || Clock;
    return <IconComponent className={styles.activityIcon} />;
  };

  const toggleSection = (dayIndex: number, itemIndex: number) => {
    const key = `${dayIndex}-${itemIndex}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderTimelineItem = (item: TimelineItem, index: number, dayIndex: number) => {
    if (item.type === 'activity') {
      const activityContent = item.content as ActivityContent;
      return (
        <li key={item.id} className={styles.activityItem}>
          <div className={styles.activityIconWrapper}>
            {getActivityIcon(activityContent.type)}
          </div>
          <span className={styles.activityText}>
            {activityContent.text}
          </span>
        </li>
      );
    }

    const details = item.content as MoreDetails;
    const isExpanded = expandedSections[`${dayIndex}-${index}`];

    return (
      <li key={item.id}>
        <div className={styles.detailsItem}>
          <div 
            className={styles.activityItem}
            onClick={() => toggleSection(dayIndex, index)}
          >
            <div className={styles.activityIconWrapper}>
              {isExpanded ? (
                <ChevronUp className={styles.activityIcon} />
              ) : (
                <ChevronDown className={styles.activityIcon} />
              )}
            </div>
            <span className={styles.activityText}>
              {details.sectionType}
            </span>
          </div>
          
          {isExpanded && (
            <div className={styles.expandedContent}>
              {details.content && (
                <p className={styles.detailsText}>{details.content}</p>
              )}
              
              <PublicMediaGallery 
                images={details.images} 
                videoUrl={details.videoUrl}
              />
            </div>
          )}
        </div>
      </li>
    );
  };

  if (items.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <MapPin className={styles.emptyIcon} />
          <p>No itinerary details available yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{getDayTitle(activeDay)}</h2>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.daysList}>
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={styles.daySection}
              data-day-index={index}
            >
              <div className={styles.dayHeader}>
                <div className={styles.dayNumberWrapper}>
                  <div className={styles.iconCircle}>
                    <MapPin className={styles.icon} />
                  </div>
                  <div className={styles.dayNumber}>
                    {getDayTitle(index)}
                  </div>
                </div>
              </div>

              <div className={styles.dayContent}>
                <h3 className={styles.dayTitle}>{item.title}</h3>
                
                {item.description && (
                  <p className={styles.description}>{item.description}</p>
                )}
                
                {item.timeline && item.timeline.length > 0 && (
                  <div className={styles.activitiesWrapper}>
                    <h4 className={styles.activitiesTitle}>Today's Schedule</h4>
                    <ul className={styles.activities}>
                      {item.timeline.map((timelineItem, timelineIndex) => 
                        renderTimelineItem(timelineItem, timelineIndex, index)
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}