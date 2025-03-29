// src/components/pdf/PDFDocumentWrapper.tsx
import React from 'react';
import { Document } from '@react-pdf/renderer';
import type { LuxuryTripData } from '@/types/luxuryTrip.types';
import TripPdf from './TripPDF';

interface PDFDocumentWrapperProps {
  tripData: LuxuryTripData;
}

const PDFDocumentWrapper: React.FC<PDFDocumentWrapperProps> = ({ tripData }) => (
  <Document
    title={tripData.title}
    author="Luxury Travel"
    creator="Luxury Travel PDF Generator"
    producer="Luxury Travel"
  >
    <TripPdf tripData={tripData} />
  </Document>
);

export default PDFDocumentWrapper;