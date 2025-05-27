'use client';

import React from 'react';

export const DispAnimationWave = React.memo(() => {
  return (
    <div className="flex items-end gap-1 h-6 justify-center">
      <div className="w-1.5 bg-primary animate-wave delay-200" />
      <div className="w-1.5 bg-primary animate-wave delay-0" />
      <div className="w-1.5 bg-primary animate-wave delay-400" />
    </div>
  );
});
DispAnimationWave.displayName = 'DispAnimationWave';
