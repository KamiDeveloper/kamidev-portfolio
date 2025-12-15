/**
 * Challenges Phase - Shows problems and solutions with toggle functionality
 */

"use client";

import { useState } from "react";

interface ChallengesPhaseProps {
    challenges: string[];
    solutions: string[];
}

export default function ChallengesPhase({
    challenges,
    solutions,
}: ChallengesPhaseProps) {
    const [showSolutions, setShowSolutions] = useState(false);

    const hasChallenges = challenges && challenges.length > 0;
    const hasSolutions = solutions && solutions.length > 0;

    if (!hasChallenges && !hasSolutions) {
        return null;
    }

    return (
        <div className="phase-content space-y-6 animate-fade-in">
            {/* Challenges Section */}
            <div
                className={`transition-all duration-500 ease-out origin-top ${
                    showSolutions
                        ? "max-h-14 opacity-100"
                        : "max-h-[800px] opacity-100"
                }`}
            >
                {showSolutions ? (
                    // Collapsed Challenges Button
                    <button
                        onClick={() => setShowSolutions(false)}
                        className="w-full group relative overflow-hidden rounded-lg border border-red-500/20 bg-bg-secondary/50 backdrop-blur-sm px-6 py-3.5 transition-all duration-300 hover:border-red-500/40 hover:bg-bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="Show Challenges"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-display font-bold text-text-primary">
                                    Show Challenges
                                </span>
                                <span className="text-xs text-text-secondary/60">
                                    ({challenges.length})
                                </span>
                            </div>
                            <span className="text-red-500 transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </div>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                ) : (
                    // Expanded Challenges List
                    <div className="animate-slide-down">
                        <h4 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Challenges
                        </h4>
                        <ul className="space-y-3 mb-4">
                            {challenges.map((challenge, index) => (
                                <li
                                    key={index}
                                    className="flex gap-3 text-text-secondary text-sm leading-relaxed animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                >
                                    <span className="text-red-500 mt-1 flex-shrink-0">
                                        →
                                    </span>
                                    <span>{challenge}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Solutions Section */}
            <div
                className={`transition-all duration-500 ease-out origin-top ${
                    showSolutions
                        ? "max-h-[800px] opacity-100"
                        : "max-h-14 opacity-100"
                }`}
            >
                {!showSolutions ? (
                    // Collapsed Solutions Button
                    <button
                        onClick={() => setShowSolutions(true)}
                        className="w-full group relative overflow-hidden rounded-lg border border-green-500/20 bg-bg-secondary/50 backdrop-blur-sm px-6 py-3.5 transition-all duration-300 hover:border-green-500/40 hover:bg-bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="Show Solutions"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="font-display font-bold text-text-primary">
                                    Show Solutions
                                </span>
                                <span className="text-xs text-text-secondary/60">
                                    ({solutions.length})
                                </span>
                            </div>
                            <span className="text-green-500 transition-transform duration-300 group-hover:translate-x-1">
                                ✓
                            </span>
                        </div>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                ) : (
                    // Expanded Solutions List
                    <div className="animate-slide-down">
                        <h4 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Solutions
                        </h4>
                        <ul className="space-y-3">
                            {solutions.map((solution, index) => (
                                <li
                                    key={index}
                                    className="flex gap-3 text-text-secondary text-sm leading-relaxed animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                >
                                    <span className="text-green-500 mt-1 flex-shrink-0">
                                        ✓
                                    </span>
                                    <span>{solution}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
