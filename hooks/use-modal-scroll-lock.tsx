/**
 * Hook to lock scroll when modal is open
 * Handles Lenis smooth scroll integration
 */

"use client";

import { useEffect } from "react";

export function useModalScrollLock(isOpen: boolean) {
    useEffect(() => {
        if (!isOpen) return;

        // Save original overflow
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        // Calculate scrollbar width to prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Stop Lenis smooth scroll if available
        const lenisInstance = (window as any).__lenis;
        let lenisWasStopped = false;

        if (lenisInstance) {
            try {
                if (typeof lenisInstance.stop === "function") {
                    lenisInstance.stop();
                    lenisWasStopped = true;
                }
            } catch (error) {
                console.warn("Failed to stop Lenis:", error);
            }
        }

        // Lock body scroll with scrollbar compensation
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        // Cleanup function
        return () => {
            // Restore Lenis
            if (lenisWasStopped && lenisInstance) {
                try {
                    if (typeof lenisInstance.start === "function") {
                        lenisInstance.start();
                    }
                } catch (error) {
                    console.warn("Failed to start Lenis:", error);
                }
            }

            // Restore body styles
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, [isOpen]);
}
