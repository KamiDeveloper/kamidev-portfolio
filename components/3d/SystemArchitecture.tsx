"use client";

import { useRef, useEffect, useState } from "react";

interface Block {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
    targetY: number;
    color: string;
    opacity: number;
    layer: number;
}

export default function SystemArchitecture() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [canvasReady, setCanvasReady] = useState(false);
    const animationRef = useRef<number | null>(null);
    const blocksRef = useRef<Block[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const gyroRef = useRef({ beta: 0, gamma: 0 });
    const timeRef = useRef(0);
    const isHoveringRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let isInitialized = false;
        let resizeTimeout: NodeJS.Timeout | null = null;

        // Setup canvas dimensions with proper scaling
        const updateSize = () => {
            if (!canvas || !container) return;

            const rect = container.getBoundingClientRect();

            // Wait for container to have valid dimensions
            if (rect.width === 0 || rect.height === 0) {
                // Retry after a short delay
                setTimeout(updateSize, 10);
                return;
            }

            const dpr = window.devicePixelRatio || 1;

            // Set actual canvas size (scaled for retina displays)
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Set display size (CSS pixels) - force exact dimensions
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Reset transform and scale context for retina displays
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            // Mark canvas as ready for display
            setCanvasReady(true);

            // Mark as initialized and reinitialize blocks if needed
            if (!isInitialized) {
                isInitialized = true;
                // Small delay to ensure everything is ready
                setTimeout(() => {
                    initBlocks();
                    if (!animationRef.current) {
                        animate();
                    }
                }, 50);
            }
        };

        // Debounced resize handler
        const handleResize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateSize, 100);
        };

        // Initial size update with multiple retries
        updateSize();

        // Try again after different delays to catch lazy-loaded styles
        setTimeout(updateSize, 0);
        setTimeout(updateSize, 50);
        setTimeout(updateSize, 100);
        setTimeout(updateSize, 250);

        window.addEventListener("resize", handleResize);

        // Use ResizeObserver for more robust container size tracking
        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });
        resizeObserver.observe(container);

        // Initialize architectural blocks - building structure from bottom up
        const initBlocks = () => {
            if (!canvas) return;

            const blocks: Block[] = [];
            const dpr = window.devicePixelRatio || 1;
            const centerX = (canvas.width / dpr) / 2;
            const baseY = (canvas.height / dpr) * 0.7;

            // Foundation layer (widest)
            const foundationWidth = 180;
            blocks.push({
                id: 0,
                x: centerX - foundationWidth / 2,
                y: baseY,
                width: foundationWidth,
                height: 30,
                depth: 40,
                targetY: baseY,
                color: "#666666",
                opacity: 0.9,
                layer: 0
            });

            // Core system layers (stacking up)
            const coreLayers = 4;
            for (let i = 0; i < coreLayers; i++) {
                const width = 140 - (i * 15);
                const height = 25;
                const y = baseY - ((i + 1) * 35);

                blocks.push({
                    id: i + 1,
                    x: centerX - width / 2,
                    y: y,
                    width: width,
                    height: height,
                    depth: 35,
                    targetY: y,
                    color: i % 2 === 0 ? "#999999" : "#7a7a7a",
                    opacity: 0.85,
                    layer: i + 1
                });
            }

            // Scalability modules (floating around)
            const modules = 8;
            for (let i = 0; i < modules; i++) {
                const angle = (i / modules) * Math.PI * 2;
                const radius = 120;
                const size = 20 + Math.random() * 15;

                blocks.push({
                    id: coreLayers + i + 1,
                    x: centerX + Math.cos(angle) * radius - size / 2,
                    y: baseY - 100 + Math.sin(angle) * 60 - size / 2,
                    width: size,
                    height: size,
                    depth: size * 0.8,
                    targetY: baseY - 100 + Math.sin(angle) * 60 - size / 2,
                    color: "#b3b3b3",
                    opacity: 0.7,
                    layer: 10 + i
                });
            }

            blocksRef.current = blocks;
        };

        // Don't initialize blocks here - will be called from updateSize after canvas is ready

        // Detect if device is mobile
        const checkMobile = () => {
            setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkMobile();

        // Mouse interaction for desktop
        const handleMouseMove = (e: MouseEvent) => {
            if (isMobile) return;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseEnter = () => {
            isHoveringRef.current = true;
        };

        const handleMouseLeave = () => {
            isHoveringRef.current = false;
        };

        // Gyroscope interaction for mobile
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (!isMobile) return;
            // beta: front-to-back tilt (-180 to 180), gamma: left-to-right tilt (-90 to 90)
            gyroRef.current = {
                beta: e.beta || 0,
                gamma: e.gamma || 0
            };
        };

        // Request permission for iOS 13+ devices
        const requestGyroPermission = async () => {
            if (isMobile && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceOrientationEvent as any).requestPermission();
                    if (permission === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                } catch (error) {
                    console.error('Gyroscope permission denied:', error);
                }
            } else if (isMobile) {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseenter", handleMouseEnter);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        requestGyroPermission();

        // Animation loop
        const animate = () => {
            if (!ctx || !canvas) return;

            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;

            // Clear with fade effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);

            timeRef.current += 0.01;

            const blocks = blocksRef.current;
            const dpr = window.devicePixelRatio || 1;

            // Update block positions with subtle floating
            blocks.forEach((block, i) => {
                // Calculate initial center position for this block
                const initialCenterX = block.id < 5 ? width / 2 - block.width / 2 :
                    (block.id === 0 ? width / 2 - 90 : // Foundation center
                        (width / 2 + Math.cos((block.id - 5) / 8 * Math.PI * 2) * 120 - block.width / 2)); // Modules in circle

                // Floating animation
                const floatOffset = Math.sin(timeRef.current * 0.5 + block.id * 0.3) * 3;
                const baseY = block.targetY + floatOffset;

                // Parallax effect - only apply when hovering (desktop) or always (mobile)
                let parallaxX = 0;
                let parallaxY = 0;
                const parallaxStrength = block.layer * 0.02;

                if (isHoveringRef.current || isMobile) {
                    if (isMobile) {
                        // Gyroscope-based parallax
                        parallaxX = (gyroRef.current.gamma / 90) * width * 0.25;
                        parallaxY = ((gyroRef.current.beta - 45) / 90) * height * 0.25;
                    } else {
                        // Mouse-based parallax
                        parallaxX = mouseRef.current.x - width / 2;
                        parallaxY = mouseRef.current.y - height / 2;
                    }

                    const newX = block.x + parallaxX * parallaxStrength * 0.08;
                    const newY = baseY + parallaxY * parallaxStrength * 0.08;

                    // Constrain blocks within canvas bounds
                    const minX = 0;
                    const maxX = width - block.width;
                    const minY = 0;
                    const maxY = height - block.height;

                    block.x = Math.max(minX, Math.min(maxX, newX));
                    block.y = Math.max(minY, Math.min(maxY, newY));
                } else {
                    // Return to center when not hovering
                    block.y = baseY;
                    block.x += (initialCenterX - block.x) * 0.12;
                    block.y += (baseY - block.y) * 0.12;
                }
            });

            // Sort blocks by layer for proper depth rendering
            const sortedBlocks = [...blocks].sort((a, b) => a.layer - b.layer);

            // Draw blocks with 3D effect (isometric)
            sortedBlocks.forEach(block => {
                const pulse = Math.sin(timeRef.current * 2 + block.id * 0.5) * 0.1 + 0.9;

                // Draw shadow
                ctx.fillStyle = `rgba(0, 0, 0, ${block.opacity * 0.3})`;
                ctx.fillRect(
                    block.x + 5,
                    block.y + block.height + 5,
                    block.width,
                    10
                );

                // Draw 3D block - front face
                ctx.fillStyle = `rgba(${parseInt(block.color.slice(1, 3), 16)}, ${parseInt(block.color.slice(3, 5), 16)}, ${parseInt(block.color.slice(5, 7), 16)}, ${block.opacity * pulse})`;
                ctx.fillRect(block.x, block.y, block.width, block.height);

                // Draw 3D block - top face (isometric)
                ctx.fillStyle = `rgba(${parseInt(block.color.slice(1, 3), 16) + 30}, ${parseInt(block.color.slice(3, 5), 16) + 30}, ${parseInt(block.color.slice(5, 7), 16) + 30}, ${block.opacity * pulse})`;
                ctx.beginPath();
                ctx.moveTo(block.x, block.y);
                ctx.lineTo(block.x + block.depth * 0.5, block.y - block.depth * 0.3);
                ctx.lineTo(block.x + block.width + block.depth * 0.5, block.y - block.depth * 0.3);
                ctx.lineTo(block.x + block.width, block.y);
                ctx.closePath();
                ctx.fill();

                // Draw 3D block - right face
                ctx.fillStyle = `rgba(${parseInt(block.color.slice(1, 3), 16) - 20}, ${parseInt(block.color.slice(3, 5), 16) - 20}, ${parseInt(block.color.slice(5, 7), 16) - 20}, ${block.opacity * pulse})`;
                ctx.beginPath();
                ctx.moveTo(block.x + block.width, block.y);
                ctx.lineTo(block.x + block.width + block.depth * 0.5, block.y - block.depth * 0.3);
                ctx.lineTo(block.x + block.width + block.depth * 0.5, block.y + block.height - block.depth * 0.3);
                ctx.lineTo(block.x + block.width, block.y + block.height);
                ctx.closePath();
                ctx.fill();

                // Draw edges/wireframe for structure feel
                ctx.strokeStyle = `rgba(230, 230, 230, ${0.3 * pulse})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(block.x, block.y, block.width, block.height);

                // Draw connecting lines between core layers
                if (block.id > 0 && block.id <= 4) {
                    const prevBlock = blocks.find(b => b.id === block.id - 1);
                    if (prevBlock) {
                        ctx.strokeStyle = `rgba(102, 102, 102, ${0.4 * pulse})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(prevBlock.x + prevBlock.width / 2, prevBlock.y);
                        ctx.lineTo(block.x + block.width / 2, block.y + block.height);
                        ctx.stroke();
                    }
                }

                // Data flow particles
                if (block.layer < 5) {
                    const particleCount = 3;
                    for (let p = 0; p < particleCount; p++) {
                        const particleProgress = (timeRef.current * 0.5 + block.id + p * 0.3) % 1;
                        const particleX = block.x + block.width * (0.2 + p * 0.3);
                        const particleY = block.y + block.height * particleProgress;

                        ctx.fillStyle = `rgba(230, 230, 230, ${0.8 * Math.sin(particleProgress * Math.PI)})`;
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });

            // Draw grid overlay
            ctx.strokeStyle = "rgba(102, 102, 102, 0.05)";
            ctx.lineWidth = 1;

            for (let x = 0; x < width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            for (let y = 0; y < height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw central axis line
            ctx.strokeStyle = "rgba(102, 102, 102, 0.2)";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            ctx.stroke();
            ctx.setLineDash([]);

            animationRef.current = requestAnimationFrame(animate);
        };

        // Start animation when visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    animate();
                } else if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            },
            { threshold: 0.1 }
        );

        if (container) {
            observer.observe(container);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseenter", handleMouseEnter);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("deviceorientation", handleOrientation);
            resizeObserver.disconnect();
            if (resizeTimeout) clearTimeout(resizeTimeout);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            observer.disconnect();
        };
    }, []); // Remove isMobile from dependencies to fix useEffect warning

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full rounded-lg overflow-hidden border border-white/20 bg-gradient-to-br from-surface-secondary/80 to-bg-base/80 backdrop-blur-sm transition-all duration-1000 ease-out opacity-0 animate-fade-in flex items-center justify-center"
        >
            {/* Canvas - centrado con borde negro */}
            <canvas
                ref={canvasRef}
                className="block"
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    margin: 'auto',
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    opacity: canvasReady ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                }}
            />

            {/* Labels */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                <div className="architecture-label flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="w-2 h-2 rounded-full bg-text-primary animate-pulse" />
                    <div>
                        <p className="text-xs font-mono text-text-primary uppercase tracking-wider">Foundation</p>
                        <p className="text-[10px] text-text-secondary/60 font-mono mt-1">Solid Base: 13 Blocks</p>
                    </div>
                </div>

                <div className="architecture-label flex items-end justify-between animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div>
                        <p className="text-xs font-mono text-accent-glow uppercase tracking-wider">Architecture</p>
                        <p className="text-[10px] text-text-secondary/60 font-mono mt-1">Distributed System</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-mono text-text-primary uppercase tracking-wider">Status</p>
                        <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1 justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Optimized
                        </p>
                    </div>
                </div>
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div
                    className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{
                        animation: "scanline 3s linear infinite"
                    }}
                />
            </div>

            <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(400px); }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
}
