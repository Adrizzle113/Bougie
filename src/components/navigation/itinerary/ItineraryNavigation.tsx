//components/navigation/itinerary/ItineraryNavigation.tsx
'use client';

import { useEffect, useState } from 'react';
import { AdminTrip } from '@/types/trip';
import Image from 'next/image';
import { Menu, Link as LinkIcon, FileText, Mail, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import AdvisorModal from '@/components/modals/AdvisorModal';
import { generatePdf } from '@/lib/utils/pdfGenerator';
import type { LuxuryTripData } from '@/types/luxuryTrip.types';
import styles from './ItineraryNavigation.module.css';

const ItineraryNavigationItems = [
  { label: 'Overview', id: 'overview' },
  { label: 'Travel Brief', id: 'travel-brief' },
  { label: 'Map', id: 'locations' },
  { label: "What's Included", id: 'inclusions' },
  { label: 'Itinerary', id: 'itinerary' },
  { label: 'Book Now', id: 'cta' },
  { label: 'Terms & Conditions', id: 'terms' },
];

interface ItineraryNavigationProps {
  tripData: AdminTrip;
}

export default function ItineraryNavigation({ tripData }: ItineraryNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setGeneratingPdf(true);
      await generatePdf(tripData);
      toast({
        title: "Success",
        description: "Your PDF has been generated and downloaded.",
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <div className={styles.navGroup}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.navButton}
              aria-label="Toggle menu"
            >
              <Menu className={styles.navIcon} />
            </button>
          </div>
          
          <div className={styles.logoContainer}>
            <Image 
              src="/images/logo.svg" 
              alt="Logo"
              width={80}
              height={32}
              className={styles.logo}
              priority
            />
          </div>
          
          <div className={styles.navGroup}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={styles.navButton}
                    onClick={handleCopyLink}
                    disabled={copied}
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <Check className={`${styles.navIcon} text-green-500`} />
                    ) : (
                      <LinkIcon className={styles.navIcon} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy link'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={styles.navButton}
                    onClick={handleGeneratePdf}
                    disabled={generatingPdf}
                    aria-label="Generate PDF"
                  >
                    <FileText className={`${styles.navIcon} ${generatingPdf ? 'animate-pulse' : ''}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{generatingPdf ? 'Generating PDF...' : 'Generate as PDF'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={styles.navButton}
                    onClick={() => setIsContactOpen(true)}
                    aria-label="Contact advisor"
                  >
                    <Mail className={styles.navIcon} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Contact advisor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {isMenuOpen && (
          <div className={styles.menuDropdown}>
            <nav className={styles.menuNav}>
              {ItineraryNavigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={styles.menuLink}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </nav>

      <AdvisorModal 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}