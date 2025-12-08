/**
 * Image Carousel component with auto-play and swipe support
 */

"use client";

import { useState, useEffect, useRef } from "react";
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
    currentIndex,
    onIndexChange,
    autoPlay = true,
    interval = 5000,
    isMobile = false,
    className,
}: ImageCarouselProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set());
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Handle single image case
    const isSingleImage = images.length <= 1;

    // Auto-play logic
    useEffect(() => {
        if (!autoPlay || isSingleImage || isHovered || isMobile || !onIndexChange) {
            return;
        }

        autoPlayTimerRef.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            onIndexChange(nextIndex);
        }, interval);

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
            }
        };
    }, [autoPlay, currentIndex, images.length, interval, isHovered, isMobile, isSingleImage, onIndexChange]);

    // Navigate to specific image
    const goToImage = (index: number) => {
        if (index >= 0 && index < images.length && onIndexChange) {
            onIndexChange(index);
        }
    };

    // Handle image load error
    const handleImageError = (index: number) => {
        setImageLoadError((prev) => new Set(prev).add(index));
    };

    // Get safe image source
    const getImageSrc = (index: number) => {
        if (imageLoadError.has(index)) {
            // Fallback to first image if available
            return images[0] || "/placeholder-image.png";
        }
        return images[index];
    };

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
                        key={index}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700 ease-in-out",
                            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
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
                                "transition-all duration-300 rounded-full",
                                index === currentIndex
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
                        onClick={() => goToImage((currentIndex - 1 + images.length) % images.length)}
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 z-30",
                            "w-10 h-10 flex items-center justify-center",
                            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
                            "border border-white/20 rounded-full",
                            "transition-all duration-300",
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
                        onClick={() => goToImage((currentIndex + 1) % images.length)}
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 z-30",
                            "w-10 h-10 flex items-center justify-center",
                            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
                            "border border-white/20 rounded-full",
                            "transition-all duration-300",
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
                <div className="absolute top-6 right-6 z-30 px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-mono">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
}
