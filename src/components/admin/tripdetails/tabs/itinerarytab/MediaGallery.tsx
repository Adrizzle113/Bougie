//components/admin/tripdetails/tabs/itinerarytab/MediaGallery
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoEmbed } from '@/components/itineraries/itinerarytemplate/video/VideoEmbed';
import { TripImage } from '@/types/luxuryTrip.types';

interface MediaGalleryProps {
  images: TripImage[];
  videoUrl?: string;
  onVideoUrlChange: (url: string) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ images, videoUrl, onVideoUrlChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

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
      {/* Video Input Section */}
      <div className="relative">
        <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={videoUrl || ''}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="Add video URL (YouTube, Vimeo)"
          className="pl-10"
        />
      </div>

      {/* Video Preview */}
      {videoUrl && (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <VideoEmbed url={videoUrl} />
        </div>
      )}

      {/* Image Gallery */}
      {images?.length > 0 && (
        <div className="relative">
          {/* Main Image Display */}
          <div className="w-full aspect-video relative rounded-lg overflow-hidden">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openPopup(currentIndex)}
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
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
              {images.map((image: TripImage, index: number) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer 
                    ${currentIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
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
              <img
                src={images[popupIndex].src}
                alt={images[popupIndex].alt}
                className="w-full h-auto max-h-[80vh] object-contain"
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

export default MediaGallery;