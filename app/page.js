import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, FeatureCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Footer from "@/components/Footer";
import {
  FolderKanban,
  Link2,
  FileCode,
  Users,
  Sparkles,
  ShieldCheck,
  Trophy,
  Award,
  ArrowRight,
  Search,
  CheckCircle2,
  Layers,
  Lock,
  Eye,
  Zap,
  Coins,
  FileText,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-body">
      {/* Navbar */}
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

            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                Pricing
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>

            <Link href="/signup">
              <Button variant="primary" size="sm" className="shadow-xs">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pb-16 pt-20 relative overflow-hidden">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-heading font-medium text-[var(--color-accent-deep)] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            The Unified Project Hub & Intelligence Workspace
          </div>

          <h1 className="text-4xl font-heading font-extrabold tracking-tight text-[var(--color-ink)] sm:text-6xl lg:text-7xl leading-[1.08]">
            Keep your projects{" "}
            <span className="italic font-serif font-normal text-[var(--color-accent-deep)]">
              organized
            </span>{" "}
            & accessible.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--color-ink-muted)] font-body">
            Centralize your repositories, design mockups, presentations, deliverables, and team permissions in one high-performance workspace.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row items-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full shadow-md font-bold px-8">
                Get Started Free →
              </Button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full px-8">
                Login to Workspace
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 inline-flex items-center gap-6 sm:gap-12 py-3 px-6 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-xs font-heading font-medium text-[var(--color-ink-muted)]">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--color-accent-deep)]" />
              Role-Based Access
            </span>
            <span className="hidden sm:inline text-[var(--color-border)]">•</span>
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--color-accent-deep)]" />
              Built-in AI Assistant
            </span>
            <span className="hidden sm:inline text-[var(--color-border)]">•</span>
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-[var(--color-accent-deep)]" />
              Real-time Search
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🍏 APPLE-STYLE STICKY "SWIPE-OVER" FEATURE SHOWCASE STACK */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--color-accent-deep)]">
            Product Showcase
          </p>
          <h2 className="mt-2 text-3xl font-heading font-extrabold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Everything your team needs.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-ink-muted)] max-w-xl mx-auto font-body">
            Scroll to explore how DevHouse elevates your projects with fluid management, AI co-pilots, and secure collaboration.
          </p>
        </div>

        {/* Sticky Deck Container */}
        <div className="relative space-y-12 pb-16">
          {/* SLIDE 1: WORKSPACE & QUICK NAVIGATION */}
          <div
            style={{ top: "96px" }}
            className="sticky z-10 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-transform duration-300"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                  01 / All-In-One Hub
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--color-ink)] tracking-tight">
                  One workspace for every deliverable.
                </h3>
                <p className="text-sm font-body text-[var(--color-ink-muted)] leading-relaxed">
                  Stop scattering links in chat messages and losing project documents in random drives. Keep code repositories, Figma designs, live deployments, and presentations together.
                </p>
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Multi-field interactive search by event, name, or institution</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Collapsible rail navigation and rapid workspace switcher</span>
                  </div>
                </div>
              </div>

              {/* Visual Mockup Card */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-5 shadow-inner">
                  {/* Top bar mockup */}
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-heading font-bold text-xs text-[#0B0B0A]">
                        D
                      </div>
                      <span className="font-heading font-bold text-xs text-[var(--color-ink)] truncate">SIH 2026 Innovation Hub</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/40 shrink-0">
                      ADMIN
                    </span>
                  </div>
                  {/* Metrics grid */}
                  <div className="grid grid-cols-3 gap-3 my-4">
                    <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] text-center">
                      <p className="text-lg font-heading font-bold text-[var(--color-ink)]">28</p>
                      <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wider font-heading">Files</p>
                    </div>
                    <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] text-center">
                      <p className="text-lg font-heading font-bold text-[var(--color-ink)]">12</p>
                      <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wider font-heading">Live Links</p>
                    </div>
                    <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] text-center">
                      <p className="text-lg font-heading font-bold text-[var(--color-ink)]">6</p>
                      <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wider font-heading">Members</p>
                    </div>
                  </div>
                  {/* Quick tags */}
                  <div className="flex items-center gap-2 text-[11px] font-body text-[var(--color-ink-muted)]">
                    <span className="flex items-center gap-1 bg-[var(--color-surface)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      <Trophy size={11} className="text-[var(--color-accent-deep)]" /> Smart India Hackathon
                    </span>
                    <span className="flex items-center gap-1 bg-[var(--color-surface)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      <ExternalLink size={11} className="text-[var(--color-accent-deep)]" /> devhouse.app
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 2: FILE STORAGE & LIVE PREVIEWS */}
          <div
            style={{ top: "112px" }}
            className="sticky z-20 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-transform duration-300"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                  02 / File Management
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--color-ink)] tracking-tight">
                  Drag, drop & preview code instantly.
                </h3>
                <p className="text-sm font-body text-[var(--color-ink-muted)] leading-relaxed">
                  Full nested folder tree hierarchies, ZIP extractions, and direct code editing right from the browser. Preview markdown, JSON, JavaScript, and PDFs seamlessly.
                </p>
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Built-in file editor with error-marking for rapid team fixes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Direct secure Cloudinary downloads and resource links</span>
                  </div>
                </div>
              </div>

              {/* Visual Mockup Card */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-5 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-heading font-bold text-[var(--color-ink-muted)] pb-2 border-b border-[var(--color-border)]">
                    <span>EXPLORER</span>
                    <span>3 FILES SELECTED</span>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] flex items-center justify-between text-xs font-body">
                    <div className="flex items-center gap-2">
                      <FileCode size={16} className="text-[var(--color-accent-deep)]" />
                      <span className="font-heading font-semibold text-[var(--color-ink)]">authOptions.js</span>
                    </div>
                    <span className="text-[10px] text-[var(--color-ink-muted)] font-mono">2.8 KB</span>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] flex items-center justify-between text-xs font-body">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[var(--color-accent-deep)]" />
                      <span className="font-heading font-semibold text-[var(--color-ink)]">PROJECT_DOCUMENTATION.md</span>
                    </div>
                    <span className="text-[10px] text-[var(--color-ink-muted)] font-mono">14.2 KB</span>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] flex items-center justify-between text-xs font-body">
                    <div className="flex items-center gap-2">
                      <FolderKanban size={16} className="text-[var(--color-accent-deep)]" />
                      <span className="font-heading font-semibold text-[var(--color-ink)]">frontend-build.zip</span>
                    </div>
                    <span className="text-[10px] text-[var(--color-ink-muted)] font-mono">8.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: BUILT-IN AI INTELLIGENCE */}
          <div
            style={{ top: "128px" }}
            className="sticky z-30 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-transform duration-300"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                  03 / AI Project Co-Pilot
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--color-ink)] tracking-tight">
                  Gemini-powered project intelligence.
                </h3>
                <p className="text-sm font-body text-[var(--color-ink-muted)] leading-relaxed">
                  Turn hours of status updates into one click. Generate executive summaries, identify missing documentation, analyze code errors, and plan project milestones automatically.
                </p>
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Instant AI project summaries and presentation bullet points</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Smart task generation and tech stack suggestions</span>
                  </div>
                </div>
              </div>

              {/* Visual Mockup Card */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-[#0B0B0A] text-white p-5 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-heading pb-2 border-b border-white/10">
                    <span className="flex items-center gap-1.5 text-[var(--color-accent)] font-bold">
                      <Sparkles size={14} /> DEVHOUSE AI ASSISTANT
                    </span>
                    <span className="text-[10px] text-white/50">Gemini 3.7 Flash-</span>
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs font-body leading-relaxed space-y-2">
                    <p className="font-heading font-bold text-[var(--color-accent)]">Project Summary Generated:</p>
                    <p className="text-white/80">
                      "Project utilizes Next.js App Router, MongoDB, and Tailwind CSS. All 4 core modules are configured with secure RBAC and real-time member synchronization."
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-heading font-medium bg-[var(--color-accent)] text-[#0B0B0A] font-bold">
                      Generate Task List
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-heading font-medium bg-white/10 text-white/80">
                      Export Markdown
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 4: ROLE-BASED ACCESS CONTROL */}
          <div
            style={{ top: "144px" }}
            className="sticky z-40 rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-transform duration-300"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                  04 / Granular Security
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--color-ink)] tracking-tight">
                  Everyone gets the right permission.
                </h3>
                <p className="text-sm font-body text-[var(--color-ink-muted)] leading-relaxed">
                  Control who can edit, upload, or simply view resources. Secure invitation tokens, transfer admin ownership, and freeze projects with the Fix & Close workflow.
                </p>
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>Admin, Editor, and Viewer permission roles</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-body text-[var(--color-ink)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-deep)] font-bold text-xs">
                      ✓
                    </div>
                    <span>One-click project locking to prevent accidental overrides</span>
                  </div>
                </div>
              </div>

              {/* Visual Mockup Card */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-5 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-heading font-bold text-[var(--color-ink)] pb-2 border-b border-[var(--color-border)]">
                    <span>TEAM ACCESS MATRIX</span>
                    <span className="text-[10px] text-[var(--color-ink-muted)]">3 ROLES</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    <div className="p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)]">
                        ADMIN
                      </span>
                      <p className="text-xs font-heading font-semibold text-[var(--color-ink)] pt-1">Full Control</p>
                      <p className="text-[10px] text-[var(--color-ink-muted)]">Manage team & project settings</p>
                    </div>
                    <div className="p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)]">
                        EDITOR
                      </span>
                      <p className="text-xs font-heading font-semibold text-[var(--color-ink)] pt-1">Collaborator</p>
                      <p className="text-[10px] text-[var(--color-ink-muted)]">Upload & edit shared files</p>
                    </div>
                    <div className="p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-heading font-medium bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                        VIEWER
                      </span>
                      <p className="text-xs font-heading font-semibold text-[var(--color-ink)] pt-1">Read Only</p>
                      <p className="text-[10px] text-[var(--color-ink-muted)]">Browse & download assets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS SECTION */}
      {/* ========================================================================= */}
      <section className="px-6 py-20 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--color-accent-deep)]">
              Simple 4-Step Process
            </p>
            <h2 className="mt-2 text-2xl font-heading font-bold text-[var(--color-ink)] sm:text-4xl">
              How DevHouse works
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Step
              number="01"
              title="Create a Workspace"
              description="Define project metadata, institution, event tags, and prize details."
            />
            <Step
              number="02"
              title="Invite Teammates"
              description="Share role-authorized invite links with Admins, Editors, or Viewers."
            />
            <Step
              number="03"
              title="Store Deliverables"
              description="Upload multi-file repositories, designs, slides, and live URLs."
            />
            <Step
              number="04"
              title="Fix & Close"
              description="Lock milestones and archive deliverables when your project is completed."
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section className="border-t border-[var(--color-border)] bg-[#0B0B0A] dark:bg-[var(--color-surface)] text-white px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--color-accent)]">
            Ready to organize?
          </p>

          <h2 className="mt-3 text-3xl font-heading font-bold text-white sm:text-5xl">
            Build your team workspace today.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-white/70 font-body text-sm sm:text-base leading-relaxed">
            Create your account in seconds, start a project and bring all your files, links, and collaborators together in one organized place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row items-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold px-8 shadow-md">
                Sign Up Now →
              </Button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10 px-8"
              >
                Login to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Step({ number, title, description }) {
  return (
    <Card className="flex flex-col gap-3 p-6 bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent-deep)] transition-all">
      <div className="font-heading font-bold text-2xl text-[var(--color-accent-deep)]">
        {number}
      </div>
      <div>
        <h3 className="font-heading font-semibold text-[var(--color-ink)] text-base">
          {title}
        </h3>
        <p className="mt-1 text-xs font-body text-[var(--color-ink-muted)] leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}