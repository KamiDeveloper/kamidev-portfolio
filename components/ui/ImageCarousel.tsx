/**
 * Image Carousel component with auto-play and swipe support
 * Handles both external index control and internal navigation
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
    images: string[];
    currentIndex: number;
    onIndexChange?: (index: number) => void;
    autoPlay?: boolean;
    interval?: number;
    isMobile?: boolean;
    className?: string;
}

export default function ImageCarousel({
    images,
    currentIndex: externalIndex,
    onIndexChange,
    autoPlay = true,
    interval = 5000,
    isMobile = false,
    className,
}: ImageCarouselProps) {
    // Internal state for carousel - syncs with external but can also be controlled independently
    const [internalIndex, setInternalIndex] = useState(externalIndex);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set());
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastExternalIndex = useRef(externalIndex);

    // Handle single image case
    const isSingleImage = images.length <= 1;
    const safeImagesLength = Math.max(1, images.length);

    // Sync internal index when external index changes (from phase navigation)
    useEffect(() => {
        if (externalIndex !== lastExternalIndex.current) {
            setInternalIndex(externalIndex);
            lastExternalIndex.current = externalIndex;
        }
    }, [externalIndex]);

    // Auto-play logic - works independently of phase navigation
    useEffect(() => {
        // Clear any existing timer
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = null;
        }

        // Don't auto-play if conditions aren't met
        if (!autoPlay || isSingleImage || isHovered || isMobile) {
            return;
        }

        autoPlayTimerRef.current = setInterval(() => {
            setInternalIndex((prev) => {
                const nextIndex = (prev + 1) % safeImagesLength;
                // Notify parent of change if callback provided
                onIndexChange?.(nextIndex);
                return nextIndex;
            });
        }, interval);

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
                autoPlayTimerRef.current = null;
            }
        };
    }, [autoPlay, safeImagesLength, interval, isHovered, isMobile, isSingleImage, onIndexChange]);

    // Navigate to specific image (circular navigation)
    const goToImage = useCallback((index: number) => {
        if (isSingleImage) return;
        
        // Normalize index for circular navigation
        let normalizedIndex = index;
        if (index < 0) {
            normalizedIndex = safeImagesLength - 1;
        } else if (index >= safeImagesLength) {
            normalizedIndex = 0;
        }
        
        setInternalIndex(normalizedIndex);
        onIndexChange?.(normalizedIndex);
    }, [safeImagesLength, isSingleImage, onIndexChange]);

    // Navigate to next image (circular)
    const goToNext = useCallback(() => {
        goToImage((internalIndex + 1) % safeImagesLength);
    }, [internalIndex, safeImagesLength, goToImage]);

    // Navigate to previous image (circular)
    const goToPrev = useCallback(() => {
        goToImage((internalIndex - 1 + safeImagesLength) % safeImagesLength);
    }, [internalIndex, safeImagesLength, goToImage]);

    // Handle image load error
    const handleImageError = useCallback((index: number) => {
        setImageLoadError((prev) => new Set(prev).add(index));
    }, []);

    // Get safe image source
    const getImageSrc = useCallback((index: number) => {
        if (imageLoadError.has(index)) {
            // Fallback to first image if available
            return images[0] || "/placeholder-image.png";
        }
        return images[index] || "/placeholder-image.png";
    }, [images, imageLoadError]);

    // Safety check for empty images array
    if (!images || images.length === 0) {
        return (
            <div className={cn("relative w-full h-full bg-surface-primary flex items-center justify-center", className)}>
                <span className="text-text-secondary">No images available</span>
            </div>
        );
    }

    return (
        <div
            className={cn("relative w-full h-full bg-surface-primary", className)}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
            {/* Main Image Display */}
            <div className="relative w-full h-full overflow-hidden">
                {images.map((image, index) => (
                    <div
                        key={`${image}-${index}`}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700 ease-in-out",
                            index === internalIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        <Image
                            src={getImageSrc(index)}
                            alt={`Project image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 75vw"
                            quality={90}
                            className="object-cover"
                            priority={index === 0}
                            onError={() => handleImageError(index)}
                        />
                    </div>
                ))}

                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20 pointer-events-none" />
            </div>

            {/* Image Indicators - Only show if multiple images */}
            {!isSingleImage && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={cn(
                                "transition-all duration-300 rounded-full cursor-pointer",
                                index === internalIndex
                                    ? "w-8 h-2 bg-accent-glow"
                                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Navigation Arrows - Desktop only, multiple images only */}
            {!isMobile && !isSingleImage && (
                <>
                    <button
                        onClick={goToPrev}
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 z-30",
                            "w-10 h-10 flex items-center justify-center",
                            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
                            "border border-white/20 rounded-full",
                            "transition-all duration-300 cursor-pointer",
                            "opacity-0 group-hover:opacity-100",
                            isHovered && "opacity-100"
                        )}
                        aria-label="Previous image"
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={goToNext}
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 z-30",
                            "w-10 h-10 flex items-center justify-center",
                            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
                            "border border-white/20 rounded-full",
                            "transition-all duration-300 cursor-pointer",
                            "opacity-0 group-hover:opacity-100",
                            isHovered && "opacity-100"
                        )}
                        aria-label="Next image"
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}

            {/* Image Counter */}
            {!isSingleImage && (
                <div className="absolute top-6 left-6 z-30 px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-mono">
                    {internalIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
}
