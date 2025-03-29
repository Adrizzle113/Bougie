//components/itineraries/itinerarytemplate/video/Youtubeplayer.tsx
import React, { useEffect } from 'react';
import Script from 'next/script';

interface YouTubePlayerProps {
  url: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url }) => {
  const getVideoId = (url: string): string | null => {
    try {
      if (url.includes('youtube.com/watch')) {
        return new URLSearchParams(url.split('?')[1]).get('v');
      }
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
      }
      return null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  };

  const videoId = getVideoId(url);
  const playerId = `youtube-player-${videoId}`;

  useEffect(() => {
    // Create YouTube player when API is ready
    const onYouTubeIframeAPIReady = () => {
      if (!videoId) return;
      
      new (window as any).YT.Player(playerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0
        }
      });
    };

    // Initialize player if API is already loaded
    if ((window as any).YT?.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // Add callback for API script
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  }, [videoId, playerId]);

  if (!videoId) return null;

  return (
    <>
      <Script 
        src="https://www.youtube.com/iframe_api" 
        strategy="lazyOnload"
      />
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div id={playerId} className="absolute top-0 left-0 w-full h-full" />
      </div>
    </>
  );
};