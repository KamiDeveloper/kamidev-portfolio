/**
 * Custom hook to detect when an element is in the viewport
 * Useful for triggering animations only when visible
 */

"use client";

import { useEffect, useState, useRef, RefObject } from 'react';

interface UseInViewOptions {
    threshold?: number | number[];
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useInView(
    ref: RefObject<HTMLElement>,
    options: UseInViewOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = false,
    } = options;

    const [isInView, setIsInView] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // If already triggered and triggerOnce is true, don't observe
        if (triggerOnce && hasTriggered) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting;
                setIsInView(inView);

                if (inView && triggerOnce) {
                    setHasTriggered(true);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, threshold, rootMargin, triggerOnce, hasTriggered]);

    return { isInView, hasTriggered };
}

/**
 * Hook variant that returns a ref to attach to elements
 * Useful when you don't have an existing ref
 */
export function useInViewRef<T extends HTMLElement = HTMLDivElement>(
    options: UseInViewOptions = {}
) {
    const ref = useRef<T>(null);
    const inViewState = useInView(ref as RefObject<HTMLElement>, options);

    return [ref, inViewState] as const;
}
