/**
 * Hook to manage phase navigation in modal
 */

"use client";

import { useState, useCallback, useMemo } from "react";

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

    // Map phase to image index
    const phaseToImageIndex = useMemo(() => {
        if (imagesCount <= 1) return 0;

        // Distribute images across phases
        const imagesPerPhase = imagesCount / totalPhases;
        const index = Math.floor(currentPhase * imagesPerPhase);
        return Math.min(index, imagesCount - 1);
    }, [currentPhase, imagesCount, totalPhases]);

    const goToPhase = useCallback(
        (phase: number) => {
            const safePhase = Math.max(0, Math.min(phase, totalPhases - 1));
            setCurrentPhase(safePhase);
            onPhaseChange?.(safePhase);
        },
        [totalPhases, onPhaseChange]
    );

    const goToNext = useCallback(() => {
        if (currentPhase < totalPhases - 1) {
            goToPhase(currentPhase + 1);
        }
    }, [currentPhase, totalPhases, goToPhase]);

    const goToPrev = useCallback(() => {
        if (currentPhase > 0) {
            goToPhase(currentPhase - 1);
        }
    }, [currentPhase, goToPhase]);

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
    };
}
