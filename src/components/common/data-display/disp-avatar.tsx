'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';

type DispAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
};

export function DispAvatar({ alt, src, className, fallback }: DispAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} className={className} />
      {fallback ? <AvatarFallback>{fallback}</AvatarFallback> : null}
    </Avatar>
  );
}
