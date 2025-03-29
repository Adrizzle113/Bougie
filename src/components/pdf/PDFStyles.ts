// src/components/pdf/PDFStyles.ts
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E7DECF', // Matching luxury travel background
    padding: 40,
  },
  // Header styles
  header: {
    marginBottom: 30,
  },
  headerImage: {
    width: '100%',
    height: 250,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#17403A', // Dark teal color
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    marginBottom: 20,
    color: '#4A5568',
  },
  // Section styles
  section: {
    marginBottom: 30,
    backgroundColor: '#F6F3EE', // Lighter background for sections
    padding: 20,
    borderRadius: 8,
    border: '1px solid #D6CFC4',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
    color: '#17403A',
    paddingBottom: 8,
    borderBottom: '1px solid #D6CFC4',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    marginBottom: 10,
    color: '#2D3748',
  },
  // Travel Brief styles
  travelBriefContainer: {
    marginBottom: 20,
  },
  travelBriefItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  travelBriefLabel: {
    width: '30%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#17403A',
  },
  travelBriefValue: {
    width: '70%',
    fontSize: 12,
    color: '#2D3748',
  },
  // Itinerary styles
  dayContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    border: '1px solid #D6CFC4',
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#17403A',
    borderBottom: '1px solid #D6CFC4',
    paddingBottom: 5,
  },
  activityContainer: {
    marginLeft: 15,
    marginBottom: 10,
  },
  activityTime: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#17403A',
    marginBottom: 2,
  },
  activityText: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#2D3748',
    lineHeight: 1.4,
  },
  // Inclusion styles
  listContainer: {
    marginBottom: 10,
  },
  included: {
    marginBottom: 8,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#2D3748',
    paddingLeft: 15,
    lineHeight: 1.4,
  },
  excluded: {
    marginBottom: 8,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#E53E3E',
    paddingLeft: 15,
    lineHeight: 1.4,
  },
  // Image gallery styles
  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  galleryImage: {
    width: '48%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4,
  },
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 10,
    borderTop: '1px solid #D6CFC4',
  },
  footerText: {
    fontFamily: 'Helvetica',
    color: '#4A5568',
    fontSize: 10,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#4A5568',
  },
});