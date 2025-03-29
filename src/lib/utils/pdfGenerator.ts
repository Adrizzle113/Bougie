// src/lib/utils/pdfGenerator.ts
import { pdf, Document } from '@react-pdf/renderer';
import TripPdf from '@/components/pdf/TripPDF';
import type { LuxuryTripData } from '@/types/luxuryTrip.types';
import { createElement } from 'react';

export const generatePdf = async (tripData: LuxuryTripData) => {
  try {
    // First create the TripPdf element
    const tripPdfElement = createElement(TripPdf, { tripData });
    
    // Then wrap it in a Document
    const documentElement = createElement(Document, {}, tripPdfElement);
    
    // Generate the PDF
    const blob = await pdf(documentElement).toBlob();
    
    // Create and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tripData.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};