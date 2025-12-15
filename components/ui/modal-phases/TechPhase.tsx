/**
 * Tech Phase - Shows technologies and features
 */

"use client";

interface TechPhaseProps {
    technologies: { name: string; purpose: string }[];
}

export default function TechPhase({ technologies }: TechPhaseProps) {
    return (
        <div className="phase-content space-y-8 animate-fade-in">
            {/* Technologies Section */}
            {technologies && technologies.length > 0 && (
                <div>
                    <h4 className="text-xl font-display font-bold text-text-primary mb-4">
                        Technologies
                    </h4>
                    <div className="space-y-3">
                        {technologies.map((tech, index) => (
                            <div
                                key={index}
                                className="bg-surface-primary border border-white/5 rounded-sm p-3"
                            >
                                <div className="text-accent-glow text-sm font-bold mb-1">
                                    {tech.name}
                                </div>
                                <div className="text-text-secondary text-xs leading-relaxed">
                                    {tech.purpose}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
