// src/components/Itineraries/itinerarytemplate/travelbrief/TravelBrief.tsx
import { useState } from 'react';
import { MapPin, Plane, Home } from 'lucide-react';
import type { TravelBrief as TravelBriefType } from '@/types/trip';
import styles from './TravelBrief.module.css';

interface TravelBriefProps {
  travelBrief: TravelBriefType;
}

export default function TravelBrief({ travelBrief }: TravelBriefProps) {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderOverview = () => {
    if (!travelBrief?.description?.trim()) {
      return (
        <div className={styles.overview}>
          <p className={styles.emptyState}>No travel brief description available.</p>
        </div>
      );
    }

    return (
      <div className={styles.overview}>
        <p>{travelBrief.description}</p>
      </div>
    );
  };

  const renderFlights = () => {
    const hasFlightInfo = travelBrief?.flights?.arrival || 
                         travelBrief?.flights?.departure || 
                         travelBrief?.flights?.notes;

    if (!hasFlightInfo) {
      return (
        <div className={styles.flightInfo}>
          <p className={styles.emptyState}>No flight information available yet.</p>
        </div>
      );
    }

    return (
      <div className={styles.flightInfo}>
        {travelBrief.flights?.notes && (
          <div className={styles.flightNotes}>{travelBrief.flights.notes}</div>
        )}
        {travelBrief.flights?.arrival && (
          <div className={styles.flightDetail}>
            <strong>Arrival:</strong> {travelBrief.flights.arrival}
          </div>
        )}
        {travelBrief.flights?.departure && (
          <div className={styles.flightDetail}>
            <strong>Departure:</strong> {travelBrief.flights.departure}
          </div>
        )}
      </div>
    );
  };

  const renderAccommodations = () => {
    if (!travelBrief?.accommodations?.length) {
      return (
        <div className={styles.accommodationList}>
          <p className={styles.emptyState}>No accommodation information available yet.</p>
        </div>
      );
    }

    return (
      <div className={styles.accommodationList}>
        {travelBrief.accommodations.map((accommodation, index) => (
          <div key={index} className={styles.accommodationCard}>
            <div className={styles.dayInfo}>
              <div className={styles.days}>{accommodation.days}</div>
              <div className={styles.nightsInfo}>
                {accommodation.nights} Night{accommodation.nights !== 1 ? 's' : ''}
              </div>
            </div>
            <div className={styles.accommodationDetails}>
              <h3 className={styles.locationName}>{accommodation.location}</h3>
              <p className={styles.roomType}>{accommodation.roomType}</p>
              <p className={styles.boardBasis}>{accommodation.boardBasis}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Travel Brief</h2>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('Overview')}
            className={`${styles.tabButton} ${activeTab === 'Overview' ? styles.tabButtonActive : ''}`}
          >
            <MapPin className={styles.tabIcon} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('Flights')}
            className={`${styles.tabButton} ${activeTab === 'Flights' ? styles.tabButtonActive : ''}`}
          >
            <Plane className={styles.tabIcon} />
            Flights
          </button>
          <button
            onClick={() => setActiveTab('Accommodation')}
            className={`${styles.tabButton} ${activeTab === 'Accommodation' ? styles.tabButtonActive : ''}`}
          >
            <Home className={styles.tabIcon} />
            Accommodation
          </button>
        </div>

        <div className={styles.contentSection}>
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Flights' && renderFlights()}
          {activeTab === 'Accommodation' && renderAccommodations()}
        </div>
      </div>
    </div>
  );
}