/**
 * Hook to manage phase navigation in modal
 * Improved image mapping for any number of images
 */

"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface UsePhaseNavigationProps {
    totalPhases: number;
    imagesCount: number;
    onPhaseChange?: (phase: number) => void;
}

export function usePhaseNavigation({
    totalPhases,
    imagesCount,
    onPhaseChange,
}: UsePhaseNavigationProps) {
    const [currentPhase, setCurrentPhase] = useState(0);
    const isTransitioning = useRef(false);
    const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (transitionTimeout.current) {
                clearTimeout(transitionTimeout.current);
                transitionTimeout.current = null;
            }
        };
    }, []);

    // Improved phase to image index mapping
    // Distributes images evenly across phases using round instead of floor
    const phaseToImageIndex = useMemo(() => {
        if (imagesCount <= 0) return 0;
        if (imagesCount === 1) return 0;
        
        // Calculate which image should show for this phase
        // Using a proportional mapping that works for any number of images
        const maxPhaseIndex = totalPhases - 1;
        const maxImageIndex = imagesCount - 1;
        
        if (maxPhaseIndex === 0) return 0;
        
        // Map phase position (0 to 1) to image position (0 to maxImageIndex)
        const phaseRatio = currentPhase / maxPhaseIndex;
        const imageIndex = Math.round(phaseRatio * maxImageIndex);
        
        return Math.max(0, Math.min(imageIndex, maxImageIndex));
    }, [currentPhase, imagesCount, totalPhases]);

    const goToPhase = useCallback(
        (phase: number) => {
            // Prevent rapid phase changes
            if (isTransitioning.current) return;
            
            const safePhase = Math.max(0, Math.min(phase, totalPhases - 1));
            
            // Only update if actually changing
            if (safePhase === currentPhase) return;
            
            // Set transitioning flag
            isTransitioning.current = true;
            
            // Clear any existing timeout
            if (transitionTimeout.current) {
                clearTimeout(transitionTimeout.current);
            }
            
            setCurrentPhase(safePhase);
            onPhaseChange?.(safePhase);
            
            // Reset transitioning flag after animation completes
            transitionTimeout.current = setTimeout(() => {
                isTransitioning.current = false;
                transitionTimeout.current = null;
            }, 500); // Match animation duration
        },
        [totalPhases, currentPhase, onPhaseChange]
    );

    const goToNext = useCallback(() => {
        if (currentPhase < totalPhases - 1 && !isTransitioning.current) {
            goToPhase(currentPhase + 1);
        }
    }, [currentPhase, totalPhases, goToPhase]);

    const goToPrev = useCallback(() => {
        if (currentPhase > 0 && !isTransitioning.current) {
            goToPhase(currentPhase - 1);
        }
    }, [currentPhase, goToPhase]);

    // Force reset function for external use
    const forceReset = useCallback(() => {
        if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current);
            transitionTimeout.current = null;
        }
        isTransitioning.current = false;
        setCurrentPhase(0);
    }, []);

    const canGoNext = currentPhase < totalPhases - 1;
    const canGoPrev = currentPhase > 0;

    return {
        currentPhase,
        currentImageIndex: phaseToImageIndex,
        goToPhase,
        goToNext,
        goToPrev,
        canGoNext,
        canGoPrev,
        forceReset,
        isTransitioning: isTransitioning.current,
    };
}
