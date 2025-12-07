/**
 * Error Boundary component to catch and handle errors in animations
 * Prevents the entire app from crashing if an animation fails
 */

"use client";

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class AnimationErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🚨 Animation Error Boundary caught an error:', error);
            console.error('Error Info:', errorInfo);
        }

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // In production, you might want to send this to an error tracking service
        // e.g., Sentry, LogRocket, etc.
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI or just the children without animations
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default: render children without animation wrappers
            // This allows content to be visible even if animations fail
            return (
                <div className="animation-error-fallback">
                    {this.props.children}
                </div>
            );
        }

        return this.props.children;
    }

    // Method to reset error state (useful for retry mechanisms)
    reset() {
        this.setState({ hasError: false, error: undefined });
    }
}

/**
 * Lightweight error boundary specifically for GSAP animations
 * Catches errors but still renders children
 */
export function GSAPErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <AnimationErrorBoundary
            onError={(error) => {
                console.warn('GSAP Animation failed:', error.message);
            }}
        >
            {children}
        </AnimationErrorBoundary>
    );
}
