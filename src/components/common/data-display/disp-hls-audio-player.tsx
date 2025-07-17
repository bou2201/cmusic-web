'use client';

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

type DispHlsAudioPlayerProps = {
  src: string; // .m3u8 URL
};

export function DispHlsAudioPlayer({ src }: DispHlsAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    // Reset trạng thái
    setHasError(false);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(audio);

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error('[HLS Error]', data);

        if (data.response?.code === 400) {
          setHasError(true);
        }

        // Nếu là lỗi nghiêm trọng không thể recover
        if (data.fatal) {
          hls.destroy();
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native support
      audio.src = src;
    } else {
      console.warn('HLS not supported in this browser');
      setHasError(true);
    }
  }, [src]);

  if (hasError) {
    return (
      <div className="text-sm">
        Không thể phát bài hát này (lỗi máy chủ hoặc định dạng không hợp lệ).
      </div>
    );
  }

  return (
    <audio ref={audioRef} controls className="w-full h-10 rounded-md" preload="metadata">
      Your browser does not support HLS audio.
    </audio>
  );
}
