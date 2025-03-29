//components/itineraries/itinerarytemplate/days/PublicMediaGallery.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TripImage } from '@/types/luxuryTrip.types';
import { VideoEmbed } from '../video/VideoEmbed';

interface PublicMediaGalleryProps {
  images?: TripImage[];
  videoUrl?: string;
}

const PublicMediaGallery: React.FC<PublicMediaGalleryProps> = ({ images = [], videoUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  if (!images.length && !videoUrl) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openPopup = (index: number) => {
    setPopupIndex(index);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handlePopupPrevious = () => {
    setPopupIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handlePopupNext = () => {
    setPopupIndex((prev) => (prev === images.length - 1 ? 0 : prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      {videoUrl && (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <VideoEmbed url={videoUrl} />
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative">
          {/* Main Image Display */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover cursor-pointer"
              onClick={() => openPopup(currentIndex)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={currentIndex === 0}
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer 
                    ${currentIndex === index ? 'ring-2 ring-[#17403a]' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-5xl p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closePopup}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative">
              <Image
                src={images[popupIndex].src}
                alt={images[popupIndex].alt}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={handlePopupPrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={handlePopupNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMediaGallery;