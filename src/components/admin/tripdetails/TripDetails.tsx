// src/components/admin/tripdetails/TripDetails.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import type { Route } from 'next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { AdminTrip } from '@/types';
import { OverviewTab } from './tabs/OverviewTab';
import TravelBriefTab from './tabs/TravelBriefTab';
import MapTab from './tabs/MapTab';
import ItineraryTab from './tabs/itinerarytab/index';
import { InclusionsTab } from './tabs/InclusionsTab';
import CTATab from './tabs/CTATab';
import TermsTab from './tabs/TermsTab';
import PricingTab from './tabs/PricingTab';
import styles from './TripDetails.module.css';

interface Props {
  id?: string;
  initialData: AdminTrip;
  onSave: (data: AdminTrip) => Promise<void>;
  loading?: boolean;
}

interface TabConfig {
  id: string;
  label: string;
  Component: React.ComponentType<{
    tripData: AdminTrip;
    updateField: <K extends keyof AdminTrip>(key: K, value: AdminTrip[K]) => void;
  }>;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', Component: OverviewTab },
  { id: 'travel-brief', label: 'Travel Brief', Component: TravelBriefTab },
  { id: 'map', label: 'Map', Component: MapTab },
  { id: 'itinerary', label: 'Itinerary', Component: ItineraryTab },
  { id: 'inclusions', label: 'Inclusions', Component: InclusionsTab },
  { id: 'pricing', label: 'Pricing', Component: PricingTab },
  { id: 'cta', label: 'CTA', Component: CTATab },
  { id: 'terms', label: 'Terms', Component: TermsTab }
];

export default function TripDetails({ 
  id, 
  initialData,
  onSave,
  loading: externalLoading = false 
}: Props) {
  const router = useRouter();
  const [tripData, setTripData] = useState<AdminTrip>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS[0].id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isLoading = loading || externalLoading;

  const updateField = <K extends keyof AdminTrip>(
    key: K, 
    value: AdminTrip[K]
  ) => {
    setTripData(prev => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!isDirty) return;

    try {
      setLoading(true);
      setError(null);
      await onSave(tripData);
      setIsDirty(false);
      router.push('/dashboard/admin/trips' as Route);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Error saving trip');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/trips/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete trip');
      }

      router.push('/dashboard/admin/trips' as Route);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Error deleting trip');
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const shouldDiscard = window.confirm('Discard unsaved changes?');
      if (!shouldDiscard) return;
    }
    router.back();
  };

  const CurrentTabComponent = TABS.find(tab => tab.id === currentTab)?.Component;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <button 
            onClick={handleCancel} 
            className={styles.backButton}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1>{id ? 'Edit Trip' : 'Create New Trip'}</h1>
          {isDirty && (
            <span className={styles.unsavedChanges}>
              Unsaved changes
            </span>
          )}
        </div>

        <div className={styles.actionButtons}>
          <Button 
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          {id && (
            <AlertDialog 
              open={isDeleteDialogOpen} 
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mx-2">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Trip
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this trip? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete Trip
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            onClick={handleSave}
            disabled={isLoading || !isDirty}
            className="bg-[#17403a] hover:bg-[#0f2d28] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {id ? 'Save Changes' : 'Create Trip'}
          </Button>
        </div>
      </header>

      <nav className={styles.navTabs}>
        <div className={styles.tabsList}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`${styles.navTab} ${
                currentTab === tab.id ? styles.activeTab : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.content}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {CurrentTabComponent && (
          <CurrentTabComponent 
            tripData={tripData} 
            updateField={updateField}
          />
        )}
      </main>
    </div>
  );
}