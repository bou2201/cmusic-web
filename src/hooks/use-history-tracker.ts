'use client';

import { Routes } from '@/constants/routes';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useCallback, useEffect, useState } from 'react';

type UseHistoryTrackerReturn = {
  canGoBack: boolean;
  canGoForward: boolean;
  handleGoBack: () => void;
  handleGoForward: () => void;
};

export function useHistoryTracker(): UseHistoryTrackerReturn {
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Update history stack when pathname changes
    setHistoryStack((prev) => {
      const newStack = [...prev];
      if (newStack[currentIndex] !== pathname) {
        // If navigating to a new page, add it to the stack
        newStack.splice(currentIndex + 1); // Remove forward history
        newStack.push(pathname);
        setCurrentIndex(newStack.length - 1);
      }
      return newStack;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    // Enable/disable buttons based on history stack
    setCanGoBack(currentIndex > 0);
    setCanGoForward(currentIndex < historyStack.length - 1);
  }, [currentIndex, historyStack]);

  const handleGoBack = useCallback(() => {
    if (canGoBack) {
      router.back();
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Fallback behavior when no history exists
      router.push(Routes.Discover); // Redirect to home or another route
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoBack]);

  const handleGoForward = useCallback(() => {
    if (canGoForward) {
      router.forward();
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Fallback behavior when no history exists
      console.log('No forward history available');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoForward]);

  return { canGoBack, canGoForward, handleGoBack, handleGoForward };
}
