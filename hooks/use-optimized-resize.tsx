/**
 * Custom hook to handle window resize events with debouncing
 * and automatic ScrollTrigger refresh
 */

"use client";

import { useEffect, useRef } from 'react';
import { debounce } from '@/lib/utils';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useOptimizedResize(
    callback?: () => void,
    delay: number = 250,
    refreshScrollTrigger: boolean = true
) {
    const callbackRef = useRef(callback);

    // Keep callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleResize = debounce(() => {
            // Execute custom callback if provided
            callbackRef.current?.();

            // Refresh ScrollTrigger to recalculate positions
            if (refreshScrollTrigger && typeof window !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, delay);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [delay, refreshScrollTrigger]);
}
