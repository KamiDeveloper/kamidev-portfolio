/**
 * Hook to detect swipe gestures on touch devices
 * Robust implementation with debouncing and state protection
 */

"use client";

import { useRef, useCallback, useEffect } from "react";

interface UseSwipeGestureProps {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
    debounceMs?: number;
}

export function useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    debounceMs = 400,
}: UseSwipeGestureProps) {
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const isSwiping = useRef(false);
    const isDebouncing = useRef(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isProcessing = useRef(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
                debounceTimer.current = null;
            }
            // Reset all refs on unmount
            touchStart.current = null;
            isSwiping.current = false;
            isDebouncing.current = false;
            isProcessing.current = false;
        };
    }, []);

    // Reset state safely
    const resetState = useCallback(() => {
        touchStart.current = null;
        isSwiping.current = false;
        isProcessing.current = false;
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Prevent starting new gesture if debouncing or processing
        if (isDebouncing.current || isProcessing.current) {
            return;
        }

        // Validate touch event
        if (!e.touches || e.touches.length === 0) {
            resetState();
            return;
        }

        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
        isSwiping.current = false;
        isProcessing.current = true;
    }, [resetState]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        // Skip if no valid touch start or debouncing
        if (!touchStart.current || isDebouncing.current) {
            return;
        }

        // Validate touch event
        if (!e.touches || e.touches.length === 0) {
            resetState();
            return;
        }

        const deltaX = e.touches[0].clientX - touchStart.current.x;
        const deltaY = e.touches[0].clientY - touchStart.current.y;

        // Mark as swiping if threshold exceeded
        if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            isSwiping.current = true;
        }
    }, [threshold, resetState]);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            // Skip if debouncing or no valid touch start
            if (isDebouncing.current || !touchStart.current) {
                resetState();
                return;
            }

            // If not swiping, just reset
            if (!isSwiping.current) {
                resetState();
                return;
            }

            // Validate touch event
            if (!e.changedTouches || e.changedTouches.length === 0) {
                resetState();
                return;
            }

            const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
            const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            // Set debounce to prevent rapid firing
            isDebouncing.current = true;
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
                isDebouncing.current = false;
                debounceTimer.current = null;
            }, debounceMs);

            // Determine if horizontal or vertical swipe
            // Only process if one direction clearly dominates (prevents diagonal confusion)
            const directionRatio = Math.max(absDeltaX, absDeltaY) / (Math.min(absDeltaX, absDeltaY) + 1);
            
            if (directionRatio < 1.5) {
                // Diagonal swipe - ignore to prevent confusion
                resetState();
                return;
            }

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

            resetState();
        },
        [threshold, debounceMs, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, resetState]
    );

    // Emergency reset function for external use
    const forceReset = useCallback(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        isDebouncing.current = false;
        resetState();
    }, [resetState]);

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        forceReset,
    };
}
