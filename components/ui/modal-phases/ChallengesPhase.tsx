/**
 * Challenges Phase - Shows problems and solutions
 */

"use client";

interface ChallengesPhaseProps {
    challenges: string[];
    solutions: string[];
}

export default function ChallengesPhase({
    challenges,
    solutions,
}: ChallengesPhaseProps) {
    return (
        <div className="phase-content space-y-8 animate-fade-in">
            {/* Challenges Section */}
            {challenges && challenges.length > 0 && (
                <div>
                    <h4 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        Challenges
                    </h4>
                    <ul className="space-y-3">
                        {challenges.map((challenge, index) => (
                            <li
                                key={index}
                                className="flex gap-3 text-text-secondary text-sm leading-relaxed"
                            >
                                <span className="text-red-500 mt-1 flex-shrink-0">→</span>
                                <span>{challenge}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Solutions Section */}
            {solutions && solutions.length > 0 && (
                <div>
                    <h4 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Solutions
                    </h4>
                    <ul className="space-y-3">
                        {solutions.map((solution, index) => (
                            <li
                                key={index}
                                className="flex gap-3 text-text-secondary text-sm leading-relaxed"
                            >
                                <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                                <span>{solution}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
