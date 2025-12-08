/**
 * Overview Phase - Shows project description and metrics
 */

"use client";

import { cn } from "@/lib/utils";

interface OverviewPhaseProps {
    title: string;
    category: string;
    fullDescription: string;
    metrics?: { label: string; value: string }[];
}

export default function OverviewPhase({
    title,
    category,
    fullDescription,
    metrics,
}: OverviewPhaseProps) {
    return (
        <div className="phase-content space-y-6 animate-fade-in">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-accent-glow/10 border border-accent-glow/30 rounded-full text-accent-glow text-xs uppercase tracking-wider font-bold">
                {category}
            </span>

            {/* Title */}
            <h3 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                {title}
            </h3>

            {/* Description */}
            <p className="text-text-secondary text-base leading-relaxed">
                {fullDescription}
            </p>

            {/* Metrics Grid */}
            {metrics && metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-surface-primary border border-white/5 rounded-sm p-4"
                        >
                            <div className="text-accent-glow text-2xl font-display font-bold mb-1">
                                {metric.value}
                            </div>
                            <div className="text-text-secondary text-xs uppercase tracking-wider">
                                {metric.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
