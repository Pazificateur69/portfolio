import React, { useEffect, useRef } from 'react';
import HLS from 'hls.js';

interface HlsVideoProps {
  url: string;
  className?: string;
}

export default function HlsVideo({ url, className = 'w-full h-full object-cover' }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (HLS.isSupported()) {
      const hls = new HLS({
        autoStartLoad: true,
        startLevel: undefined,
        debug: false,
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(HLS.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.log('Autoplay prevented:', err));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = url;
      video.play().catch(err => console.log('Autoplay prevented:', err));
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      className={className}
      loop
      muted
      autoPlay
      playsInline
    />
  );
}
