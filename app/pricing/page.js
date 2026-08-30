"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Active carousel card index: 0 = Free, 1 = Pro (default recommended), 2 = Unlimited
  const [activeIndex, setActiveIndex] = useState(1);

  // Touch tracking for swipe gestures
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  // Determine user's active plan from session if available
  const currentPlanId = user
    ? user.plan
      ? String(user.plan).toLowerCase()
      : "free"
    : null;

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      period: "",
      tagline: "Free forever",
      features: [
        "Up to 3 projects",
        "Up to 4 project collaborations",
        "Free forever",
      ],
      ctaText: "Get started",
      ctaVariant: "secondary",
      href: user ? "/dashboard" : "/signup",
      isRecommended: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹49",
      period: "/month",
      tagline: "For growing teams",
      features: ["Up to 25 projects", "All features unlocked"],
      ctaText: "Upgrade",
      ctaVariant: "primary",
      href: "/checkout?plan=pro",
      isRecommended: true,
    },
    {
      id: "unlimited",
      name: "Unlimited",
      price: "₹99",
      period: "/month",
      tagline: "No limits",
      features: ["Unlimited projects", "All features unlocked"],
      ctaText: "Upgrade",
      ctaVariant: "primary",
      href: "/checkout?plan=unlimited",
      isRecommended: false,
    },
  ];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + plans.length) % plans.length);
  }, [plans.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % plans.length);
  }, [plans.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 40; // minimum distance in px
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-body flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="DEVHOUSE"
              className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-[#171915] p-0.5 border border-[var(--color-border)] shrink-0 shadow-2xs"
            />
            <div className="text-xl font-heading font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
              DEV<span className="text-[var(--color-accent-deep)]">HOUSE</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              className="gap-1.5 shadow-2xs"
            >
              <ArrowLeft size={14} />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1 text-xs font-heading font-medium text-[var(--color-accent-deep)] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Transparent & Flexible Plans
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-[var(--color-ink)]">
              Simple, transparent pricing
            </h1>
            <p className="mt-3 text-base sm:text-lg font-body text-[var(--color-ink-muted)]">
              Choose the plan that fits your workflow. Scale as your team and projects grow.
            </p>
          </div>

          {/* Quick Plan Selector Pills */}
          <div className="mb-4 sm:mb-8">
            <div className="inline-flex p-1 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] shadow-2xs">
              {plans.map((plan, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[var(--color-accent)] text-[#0B0B0A] shadow-xs scale-100"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {plan.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🎡 OVERLAPPING PLAN CAROUSEL */}
          {/* ========================================================================= */}
          <div
            className="relative w-full max-w-4xl py-4 sm:py-8 flex flex-col items-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Carousel Container */}
            <div className="relative w-full h-[520px] sm:h-[540px] flex items-center justify-center">
              {plans.map((plan, idx) => {
                const isCurrent = currentPlanId === plan.id;
                const offset = (idx - activeIndex + plans.length) % plans.length;
                // offset: 0 = center active, 1 = right, 2 = left (or plans.length - 1)
                const isCenter = offset === 0;
                const isRight = offset === 1;
                const isLeft = offset === plans.length - 1;

                let transformClasses = "";
                let zIndex = "z-10";
                let opacityClass = "opacity-0 pointer-events-none";

                if (isCenter) {
                  transformClasses = "translate-x-0 scale-100 sm:scale-105";
                  zIndex = "z-30";
                  opacityClass = "opacity-100 pointer-events-auto cursor-default shadow-2xl";
                } else if (isRight) {
                  transformClasses = "translate-x-[42%] sm:translate-x-[52%] md:translate-x-[58%] scale-[0.88] sm:scale-[0.92]";
                  zIndex = "z-10";
                  opacityClass = "opacity-60 hover:opacity-90 pointer-events-auto cursor-pointer shadow-lg";
                } else if (isLeft) {
                  transformClasses = "-translate-x-[42%] sm:-translate-x-[52%] md:-translate-x-[58%] scale-[0.88] sm:scale-[0.92]";
                  zIndex = "z-10";
                  opacityClass = "opacity-60 hover:opacity-90 pointer-events-auto cursor-pointer shadow-lg";
                }

                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(idx);
                    }}
                    style={{
                      transition: "all 0.5s cubic-bezier(0.34, 1.3, 0.64, 1)",
                    }}
                    className={`absolute w-[88%] sm:w-[360px] md:w-[380px] h-[480px] sm:h-[500px] flex flex-col justify-between rounded-[16px] p-6 sm:p-8 bg-[var(--color-surface)] ${transformClasses} ${zIndex} ${opacityClass} ${
                      isCenter
                        ? "border-2 border-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/15"
                        : "border border-[var(--color-border)]"
                    }`}
                  >
                    {/* Top Header */}
                    <div>
                      {/* Recommended Badge */}
                      <div className="h-7 mb-2 flex items-center">
                        {plan.isRecommended ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[var(--color-accent)] text-[#0B0B0A] shadow-xs">
                            Recommended
                          </span>
                        ) : (
                          <span className="inline-block" />
                        )}
                      </div>

                      {/* Plan Name */}
                      <h2 className="text-2xl font-heading font-semibold text-[var(--color-ink)] tracking-tight">
                        {plan.name}
                      </h2>

                      {/* Price */}
                      <div className="mt-3 mb-1.5 flex items-baseline gap-1.5">
                        <span className="text-4xl sm:text-5xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-sm font-body font-normal text-[var(--color-ink-muted)]">
                            {plan.period}
                          </span>
                        )}
                      </div>

                      {/* Tagline */}
                      <p className="text-xs sm:text-sm font-body text-[var(--color-ink-muted)]">
                        {plan.tagline}
                      </p>

                      {/* Hairline Divider */}
                      <div className="w-full h-px bg-[var(--color-border)] my-5" />

                      {/* Feature list */}
                      <div className="space-y-3">
                        {plan.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/15 dark:bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--color-accent)]/30 dark:border-[var(--color-border)]">
                              <Check
                                size={12}
                                className="text-[var(--color-accent-deep)] dark:text-[var(--color-accent)] stroke-[3]"
                              />
                            </div>
                            <span className="text-xs sm:text-sm font-body text-[var(--color-ink)] leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button pinned to bottom */}
                    <div className="pt-4 mt-auto">
                      {isCurrent ? (
                        <Button
                          variant="secondary"
                          size="md"
                          disabled
                          className="w-full opacity-60 cursor-not-allowed font-heading"
                        >
                          Current plan
                        </Button>
                      ) : (
                        <Link href={plan.href} className="block w-full">
                          <Button
                            variant={plan.ctaVariant}
                            size="md"
                            className="w-full shadow-xs text-sm"
                          >
                            {plan.ctaText}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Arrows & Indicators */}
            <div className="flex items-center justify-center gap-6 mt-6 sm:mt-8 z-40">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-ink-muted)] transition active:scale-95 cursor-pointer"
                title="Previous Plan"
                aria-label="Previous Plan"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {plans.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === dotIdx
                        ? "w-8 bg-[var(--color-accent)]"
                        : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-ink-muted)]"
                    }`}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-ink-muted)] transition active:scale-95 cursor-pointer"
                title="Next Plan"
                aria-label="Next Plan"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
