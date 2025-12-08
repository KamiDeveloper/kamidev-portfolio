"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useModalScrollLock } from "@/hooks/use-modal-scroll-lock";
import { useDeviceDetection } from "@/hooks/use-device-detection";
import { usePhaseNavigation } from "@/hooks/use-phase-navigation";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { cn } from "@/lib/utils";
import ImageCarousel from "@/components/ui/ImageCarousel";
import OverviewPhase from "@/components/ui/modal-phases/OverviewPhase";
import ChallengesPhase from "@/components/ui/modal-phases/ChallengesPhase";
import TechPhase from "@/components/ui/modal-phases/TechPhase";
import CTAPhase from "@/components/ui/modal-phases/CTAPhase";

export interface ProjectModalData {
    id: string;
    title: string;
    category: string;
    shortDesc: string;
    fullDescription: string;
    challenges: string[];
    solutions: string[];
    technologies: {
        name: string;
        purpose: string;
    }[];
    features: string[];
    images: {
        main: string;
        screenshots: string[];
    };
    links: {
        live: string;
        github?: string;
    };
    metrics?: {
        label: string;
        value: string;
    }[];
}

interface ProjectModalProps {
    project: ProjectModalData | null;
    isOpen: boolean;
    onClose: () => void;
}

const TOTAL_PHASES = 4;

export default function ProjectModal({
    project,
    isOpen,
    onClose,
}: ProjectModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const wheelDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const { performAnimation, gsap } = useGSAPContext(modalRef);

    // Custom hooks
    useModalScrollLock(isOpen);
    const { isMobile, isTouch, isInitialized } = useDeviceDetection();

    // Prepare images array
    const images = useMemo(() => {
        if (!project) return [];
        const allImages = project.images.screenshots.length > 0
            ? project.images.screenshots
            : [project.images.main];
        return allImages;
    }, [project]);

    // Phase navigation
    const {
        currentPhase,
        currentImageIndex,
        goToPhase,
        goToNext,
        goToPrev,
        canGoNext,
        canGoPrev,
    } = usePhaseNavigation({
        totalPhases: TOTAL_PHASES,
        imagesCount: images.length,
    });

    // Reset phase when modal opens
    useEffect(() => {
        if (isOpen) {
            goToPhase(0);
        }
    }, [isOpen, goToPhase]);

    // Swipe gestures for mobile
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeGesture({
        onSwipeLeft: goToNext,
        onSwipeRight: goToPrev,
        threshold: 75,
    });

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    // Handle wheel event for phase navigation (desktop only)
    useEffect(() => {
        if (!isOpen || isMobile || !modalRef.current) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // Debounce to prevent rapid phase changes
            if (wheelDebounceRef.current) return;

            const delta = e.deltaY;

            if (Math.abs(delta) > 10) {
                if (delta > 0 && canGoNext) {
                    goToNext();
                } else if (delta < 0 && canGoPrev) {
                    goToPrev();
                }

                wheelDebounceRef.current = setTimeout(() => {
                    wheelDebounceRef.current = null;
                }, 600);
            }
        };

        const modalElement = modalRef.current;
        modalElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            modalElement.removeEventListener("wheel", handleWheel);
            if (wheelDebounceRef.current) {
                clearTimeout(wheelDebounceRef.current);
            }
        };
    }, [isOpen, isMobile, canGoNext, canGoPrev, goToNext, goToPrev]);

    // Close animation
    const handleClose = useCallback(() => {
        if (!modalRef.current || !contentRef.current) {
            onClose();
            return;
        }

        const tl = gsap.timeline({
            onComplete: onClose,
        });

        tl.to(contentRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
        });

        tl.to(
            modalRef.current,
            {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
            },
            "-=0.1"
        );
    }, [gsap, onClose]);

    // Entrance animations
    useEffect(() => {
        if (!isOpen || !project || !isInitialized) return;

        const cleanup = performAnimation(() => {
            const tl = gsap.timeline();

            tl.fromTo(
                modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );

            tl.fromTo(
                contentRef.current,
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" },
                "-=0.15"
            );
        });

        return cleanup;
    }, [isOpen, project, isInitialized, performAnimation, gsap]);

    // Phase transition animations
    useEffect(() => {
        if (!isOpen || !project) return;

        const cleanup = performAnimation(() => {
            gsap.from(".phase-content", {
                opacity: 0,
                x: -20,
                duration: 0.4,
                ease: "power2.out",
            });
        });

        return cleanup;
    }, [currentPhase, isOpen, project, performAnimation, gsap]);

    // Render phase content
    const renderPhaseContent = () => {
        if (!project) return null;

        switch (currentPhase) {
            case 0:
                return (
                    <OverviewPhase
                        title={project.title}
                        category={project.category}
                        fullDescription={project.fullDescription}
                        metrics={project.metrics}
                    />
                );
            case 1:
                return (
                    <ChallengesPhase
                        challenges={project.challenges}
                        solutions={project.solutions}
                    />
                );
            case 2:
                return (
                    <TechPhase
                        technologies={project.technologies}
                        features={project.features}
                    />
                );
            case 3:
                return (
                    <CTAPhase
                        title={project.title}
                        links={project.links}
                    />
                );
            default:
                return null;
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Desktop Layout */}
            <div
                ref={contentRef}
                className={cn(
                    "relative bg-bg-base border border-white/10 rounded-sm overflow-hidden",
                    isMobile
                        ? "w-full h-full"
                        : "w-[90vw] h-[85vh] max-w-[1600px]"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-surface-primary/80 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/10 hover:border-accent-glow transition-all duration-300 group"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-6 h-6 text-text-primary group-hover:text-accent-glow transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Desktop: Two-column layout */}
                <div className="hidden md:flex h-full">
                    {/* Left Column: Content (25%) */}
                    <div className="w-1/4 flex flex-col border-r border-white/10 bg-bg-base">
                        <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 overflow-y-auto">
                            {renderPhaseContent()}
                        </div>

                        {/* Phase Indicator & Navigation */}
                        <div className="p-8 border-t border-white/10 bg-surface-primary/50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-text-secondary text-sm font-mono">
                                    Phase {currentPhase + 1} / {TOTAL_PHASES}
                                </span>
                                <div className="flex gap-1">
                                    {Array.from({ length: TOTAL_PHASES }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => goToPhase(idx)}
                                            className={cn(
                                                "h-1 rounded-full transition-all duration-300",
                                                idx === currentPhase
                                                    ? "w-8 bg-accent-glow"
                                                    : "w-1 bg-white/20 hover:bg-white/40"
                                            )}
                                            aria-label={`Go to phase ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={goToPrev}
                                    disabled={!canGoPrev}
                                    className={cn(
                                        "flex-1 px-4 py-2 border rounded-sm text-sm font-bold uppercase tracking-wider transition-all duration-300",
                                        canGoPrev
                                            ? "border-white/20 text-text-primary hover:border-accent-glow hover:text-accent-glow"
                                            : "border-white/5 text-text-secondary/30 cursor-not-allowed"
                                    )}
                                >
                                    ← Prev
                                </button>
                                <button
                                    onClick={goToNext}
                                    disabled={!canGoNext}
                                    className={cn(
                                        "flex-1 px-4 py-2 border rounded-sm text-sm font-bold uppercase tracking-wider transition-all duration-300",
                                        canGoNext
                                            ? "border-white/20 text-text-primary hover:border-accent-glow hover:text-accent-glow"
                                            : "border-white/5 text-text-secondary/30 cursor-not-allowed"
                                    )}
                                >
                                    Next →
                                </button>
                            </div>

                            {/* Scroll hint */}
                            {!isMobile && (
                                <p className="text-text-secondary/50 text-xs text-center mt-4">
                                    Use mouse wheel to navigate
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Carousel (75%) */}
                    <div className="w-3/4 relative group">
                        <ImageCarousel
                            images={images}
                            currentIndex={currentImageIndex}
                            autoPlay={true}
                            interval={5000}
                            isMobile={false}
                        />
                    </div>
                </div>

                {/* Mobile: Vertical layout */}
                <div className="md:hidden flex flex-col h-full">
                    {/* Carousel (40vh) */}
                    <div className="h-[40vh] relative flex-shrink-0">
                        <ImageCarousel
                            images={images}
                            currentIndex={currentImageIndex}
                            autoPlay={false}
                            interval={5000}
                            isMobile={true}
                        />
                    </div>

                    {/* Content (scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 bg-bg-base">
                        {renderPhaseContent()}
                    </div>

                    {/* Phase navigation (sticky bottom) */}
                    <div className="sticky bottom-0 bg-surface-primary/95 backdrop-blur-md p-4 border-t border-white/10">
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <button
                                onClick={goToPrev}
                                disabled={!canGoPrev}
                                className={cn(
                                    "flex-1 px-4 py-2 border rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300",
                                    canGoPrev
                                        ? "border-white/20 text-text-primary active:border-accent-glow active:text-accent-glow"
                                        : "border-white/5 text-text-secondary/30"
                                )}
                            >
                                ← Prev
                            </button>
                            <span className="text-text-secondary text-xs font-mono whitespace-nowrap">
                                {currentPhase + 1} / {TOTAL_PHASES}
                            </span>
                            <button
                                onClick={goToNext}
                                disabled={!canGoNext}
                                className={cn(
                                    "flex-1 px-4 py-2 border rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300",
                                    canGoNext
                                        ? "border-white/20 text-text-primary active:border-accent-glow active:text-accent-glow"
                                        : "border-white/5 text-text-secondary/30"
                                )}
                            >
                                Next →
                            </button>
                        </div>
                        <div className="flex gap-1 justify-center">
                            {Array.from({ length: TOTAL_PHASES }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToPhase(idx)}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-300",
                                        idx === currentPhase
                                            ? "w-8 bg-accent-glow"
                                            : "w-1 bg-white/20"
                                    )}
                                    aria-label={`Go to phase ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <p className="text-text-secondary/50 text-xs text-center mt-2">
                            Swipe left/right to navigate
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
