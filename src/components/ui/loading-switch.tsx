'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Switch } from './switch';
import { Loader2 } from 'lucide-react';

interface LoadingSwitchProps extends Omit<React.ComponentProps<typeof Switch>, 'onCheckedChange'> {
  /**
   * Callback function when the switch is toggled
   */
  onCheckedChange?: (checked: boolean) => Promise<void> | void;
  /**
   * Size of the loader, defaults to 'h-4 w-4'
   */
  loaderSize?: string;
  /**
   * Color of the loader, defaults to 'text-primary-pink'
   */
  loaderColor?: string;
}

/**
 * LoadingSwitch component that shows a loading spinner during async operations
 */
export function LoadingSwitch({
  checked,
  onCheckedChange,
  loaderSize = 'h-4 w-4',
  loaderColor = 'text-primary-pink',
  ...props
}: LoadingSwitchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [internalChecked, setInternalChecked] = useState(checked);

  // Update internal state when checked prop changes
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleCheckedChange = async (newChecked: boolean) => {
    if (!onCheckedChange) return;

    setIsLoading(true);
    try {
      await onCheckedChange(newChecked);
      setInternalChecked(newChecked);
    } catch (error) {
      // If there's an error, revert back to the original state
      console.error('Error toggling switch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Switch
        checked={internalChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isLoading}
        isLoading={isLoading}
        {...props}
      />
    </div>
  );
}
