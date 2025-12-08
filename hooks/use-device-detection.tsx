/**
 * Hook to detect device type and capabilities
 */

"use client";

import { useState, useEffect } from "react";

export function useDeviceDetection() {
    const [isMobile, setIsMobile] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
            setIsInitialized(true);
        };

        checkDevice();

        const handleResize = () => {
            checkDevice();
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { isMobile, isTouch, isInitialized };
}
