"use client";

import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useRef, useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  
  const { gsap } = useGSAPContext(footerRef);
  const { dict } = useLanguage();

  // Form state
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = dict.footer.validation?.name || "Name is required";
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = dict.footer.validation?.email || "Valid email is required";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = dict.footer.validation?.message || "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, dict.footer.validation, emailRegex]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake animation for invalid form
      if (formRef.current) {
        gsap.to(formRef.current, {
          keyframes: [
            { x: -10, duration: 0.1 },
            { x: 10, duration: 0.1 },
            { x: -10, duration: 0.1 },
            { x: 10, duration: 0.1 },
            { x: 0, duration: 0.1 },
          ],
          ease: "power2.out",
        });
      }
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Button loading animation
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 0.95,
        duration: 0.2,
      });
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          setErrorMessage(dict.footer.errors?.rateLimit || "Too many requests. Please wait a moment.");
        } else if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setErrorMessage(data.message || dict.footer.errors?.generic || "Something went wrong. Please try again.");
        }
        setStatus("error");
        
        // Error animation
        if (errorRef.current) {
          gsap.fromTo(errorRef.current, 
            { opacity: 0, y: -20 }, 
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }
        
        if (btnRef.current) {
          gsap.to(btnRef.current, { scale: 1, duration: 0.3 });
        }
        return;
      }

      // Success!
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Success animation
      if (btnRef.current) {
        gsap.to(btnRef.current, {
          scale: 1.05,
          backgroundColor: "rgba(0, 255, 136, 0.2)",
          borderColor: "#00ff88",
          duration: 0.5,
          ease: "power2.out",
        });
      }

      if (successRef.current) {
        gsap.fromTo(successRef.current,
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
        );
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        if (btnRef.current) {
          gsap.to(btnRef.current, {
            backgroundColor: "",
            borderColor: "",
            scale: 1,
            duration: 0.3,
          });
        }
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMessage(dict.footer.errors?.generic || "Something went wrong. Please try again.");
      setStatus("error");
      
      if (btnRef.current) {
        gsap.to(btnRef.current, { scale: 1, duration: 0.3 });
      }
    }
  };

  const handleMouseEnter = () => {
    if (status === "loading") return;
    gsap.to(btnRef.current, { scale: 1.05, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (status === "loading") return;
    gsap.to(btnRef.current, { scale: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (status === "loading") return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Button content based on status
  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {dict.footer.loading || "Sending..."}
          </span>
        );
      case "success":
        return (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {dict.footer.success || "Sent!"}
          </span>
        );
      default:
        return dict.footer.submit;
    }
  };

  return (
    <footer ref={footerRef} id="contact" className="relative w-full py-20 bg-bg-base border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-12">
          {dict.footer.title_1} <span className="text-accent-glow">{dict.footer.title_2}</span>.
        </h2>

        {/* Success Message */}
        {status === "success" && (
          <div 
            ref={successRef}
            className="w-full max-w-lg mb-8 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{dict.footer.successMessage || "Message sent successfully! I'll get back to you soon."}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && errorMessage && (
          <div 
            ref={errorRef}
            className="w-full max-w-lg mb-8 p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-lg space-y-8 mb-20">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px] opacity-0"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="relative group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={dict.footer.name_ph}
              disabled={status === "loading"}
              className={cn(
                "w-full bg-transparent border-b py-4 text-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition-colors disabled:opacity-50",
                errors.name ? "border-red-500" : "border-white/20 focus:border-accent-glow"
              )}
            />
            <div className={cn(
              "absolute bottom-0 left-0 h-px transition-all duration-500",
              errors.name ? "w-full bg-red-500" : "w-0 bg-accent-glow group-focus-within:w-full"
            )} />
            {errors.name && (
              <p className="absolute -bottom-6 left-0 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="relative group mt-8">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={dict.footer.email_ph}
              disabled={status === "loading"}
              className={cn(
                "w-full bg-transparent border-b py-4 text-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition-colors disabled:opacity-50",
                errors.email ? "border-red-500" : "border-white/20 focus:border-accent-glow"
              )}
            />
            <div className={cn(
              "absolute bottom-0 left-0 h-px transition-all duration-500",
              errors.email ? "w-full bg-red-500" : "w-0 bg-accent-glow group-focus-within:w-full"
            )} />
            {errors.email && (
              <p className="absolute -bottom-6 left-0 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="relative group mt-8">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={dict.footer.vision_ph}
              rows={1}
              disabled={status === "loading"}
              className={cn(
                "w-full bg-transparent border-b py-4 text-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition-colors resize-none disabled:opacity-50",
                errors.message ? "border-red-500" : "border-white/20 focus:border-accent-glow"
              )}
            />
            <div className={cn(
              "absolute bottom-0 left-0 h-px transition-all duration-500",
              errors.message ? "w-full bg-red-500" : "w-0 bg-accent-glow group-focus-within:w-full"
            )} />
            {errors.message && (
              <p className="absolute -bottom-6 left-0 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          <div className="pt-8">
            <button
              ref={btnRef}
              type="submit"
              disabled={status === "loading"}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              className={cn(
                "px-12 py-4 rounded-full bg-surface-primary text-text-primary border border-white/20 transition-colors font-bold tracking-widest uppercase overflow-hidden relative",
                status === "loading" ? "cursor-wait" : "hover:bg-white/5",
                status === "success" && "border-green-500/50 bg-green-500/10"
              )}
            >
              <span className="relative z-10">{getButtonContent()}</span>
              <div className="absolute inset-0 bg-accent-glow/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>
        </form>

        <div className="flex gap-8 text-sm text-text-secondary uppercase tracking-widest">
          <a href="https://github.com/KamiDeveloper" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/jorge-medrano-ramirez/" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://x.com/KamiDev_" className="hover:text-white transition-colors">Twitter</a>
        </div>

        <p className="mt-12 text-xs text-text-secondary/50">
          © {new Date().getFullYear()} JORGE MEDRANO. {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
