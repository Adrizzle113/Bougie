// src/components/pdf/TripPdf.tsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import { styles } from './PDFStyles';
import type { LuxuryTripData, TimelineItem, TripAccommodation } from '@/types/luxuryTrip.types';

interface TripPdfProps {
  tripData: LuxuryTripData;
}

const TripPdf: React.FC<TripPdfProps> = ({ tripData }) => {
  const mainImage = tripData.images.find(img => img.section === 'overview' && img.priority);
  const sectionImages = tripData.images.filter(img => img.section === 'itinerary');
  
  const formatAccommodation = (accommodation: TripAccommodation) => {
    return `${accommodation.location} - ${accommodation.roomType} (${accommodation.nights} nights, ${accommodation.boardBasis})`;
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        {mainImage && (
          <Image src={mainImage.src} style={styles.headerImage} />
        )}
        <Text style={styles.title}>{tripData.title}</Text>
        {tripData.subtitle && (
          <Text style={styles.subtitle}>{tripData.subtitle}</Text>
        )}
      </View>

      {/* Overview Section */}
      {tripData.overview && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.text}>{tripData.overview}</Text>
        </View>
      )}

      {/* Travel Brief Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel Brief</Text>
        <View style={styles.travelBriefContainer}>
          {tripData.travelBrief.description && (
            <View style={styles.travelBriefItem}>
              <Text style={styles.text}>{tripData.travelBrief.description}</Text>
            </View>
          )}
          
          {tripData.travelBrief.flights && (
            <>
              <View style={styles.travelBriefItem}>
                <Text style={styles.travelBriefLabel}>Arrival:</Text>
                <Text style={styles.travelBriefValue}>{tripData.travelBrief.flights.arrival}</Text>
              </View>
              <View style={styles.travelBriefItem}>
                <Text style={styles.travelBriefLabel}>Departure:</Text>
                <Text style={styles.travelBriefValue}>{tripData.travelBrief.flights.departure}</Text>
              </View>
              {tripData.travelBrief.flights.notes && (
                <View style={styles.travelBriefItem}>
                  <Text style={styles.travelBriefLabel}>Notes:</Text>
                  <Text style={styles.travelBriefValue}>{tripData.travelBrief.flights.notes}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Accommodations */}
        {tripData.travelBrief.accommodations.length > 0 && (
          <View style={styles.travelBriefContainer}>
            <Text style={[styles.sectionTitle, { fontSize: 18 }]}>Accommodations</Text>
            {tripData.travelBrief.accommodations.map((accommodation, index) => (
              <View key={index} style={styles.travelBriefItem}>
                <Text style={styles.text}>{formatAccommodation(accommodation)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Itinerary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        {tripData.itinerary?.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>Day {index + 1}: {day.title}</Text>
            <Text style={styles.text}>{day.description}</Text>
            
            {day.timeline?.map((item: TimelineItem, itemIndex: number) => (
              <View key={itemIndex} style={styles.activityContainer}>
                {item.type === 'activity' && typeof item.content !== 'string' && 'time' in item.content && (
                  <>
                    {item.content.time && (
                      <Text style={styles.activityTime}>{item.content.time}</Text>
                    )}
                    <Text style={styles.activityText}>{item.content.text}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Itinerary Images */}
        {sectionImages.length > 0 && (
          <View style={styles.imageGallery}>
            {sectionImages.map((image, index) => (
              <Image
                key={index}
                src={image.src}
                style={styles.galleryImage}
              />
            ))}
          </View>
        )}
      </View>

      {/* What's Included Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        <View style={styles.listContainer}>
          {tripData.included?.map((item, index) => (
            <Text key={index} style={styles.included}>• {item}</Text>
          ))}
        </View>
      </View>

      {/* What's Not Included Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Not Included</Text>
        <View style={styles.listContainer}>
          {tripData.excluded?.map((item, index) => (
            <Text key={index} style={styles.excluded}>• {item}</Text>
          ))}
        </View>
      </View>

      {/* Terms & Conditions Section */}
      {tripData.terms && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text style={styles.text}>{tripData.terms}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Bougie Backpacker
        </Text>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </Page>
  );
};

export default TripPdf;