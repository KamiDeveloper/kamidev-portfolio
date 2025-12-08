/**
 * Hook to detect swipe gestures on touch devices
 */

"use client";

import { useRef, useCallback } from "react";

interface UseSwipeGestureProps {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
}

export function useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
}: UseSwipeGestureProps) {
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const isSwiping = useRef(false);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
        isSwiping.current = false;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!touchStart.current) return;

        const deltaX = e.touches[0].clientX - touchStart.current.x;
        const deltaY = e.touches[0].clientY - touchStart.current.y;

        // Mark as swiping if threshold exceeded
        if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            isSwiping.current = true;
        }
    }, [threshold]);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (!touchStart.current || !isSwiping.current) {
                touchStart.current = null;
                return;
            }

            const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
            const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            // Determine if horizontal or vertical swipe
            if (absDeltaX > absDeltaY) {
                // Horizontal swipe
                if (absDeltaX > threshold) {
                    if (deltaX > 0) {
                        onSwipeRight?.();
                    } else {
                        onSwipeLeft?.();
                    }
                }
            } else {
                // Vertical swipe
                if (absDeltaY > threshold) {
                    if (deltaY > 0) {
                        onSwipeDown?.();
                    } else {
                        onSwipeUp?.();
                    }
                }
            }

            touchStart.current = null;
            isSwiping.current = false;
        },
        [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
    );

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}
