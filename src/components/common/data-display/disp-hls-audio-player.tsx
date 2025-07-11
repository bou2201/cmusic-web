'use client';

import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

type DispHlsAudioPlayerProps = {
  src: string; // .m3u8 URL
};

export function DispHlsAudioPlayer({ src }: DispHlsAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js error', data);
      });

      return () => {
        hls.destroy();
      };
    } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      audioRef.current.src = src;
    }
  }, [src]);

  return (
    <audio ref={audioRef} controls className="w-full h-10 rounded-md">
      Your browser does not support HLS audio.
    </audio>
  );
}
