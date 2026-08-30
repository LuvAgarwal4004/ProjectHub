"use client";

import { useState } from "react";
import {
  Award,
  FileCheck,
  DollarSign,
  Wallet,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Copy,
  Building,
  Mail,
  Globe,
  Star,
  KeyRound,
  Calendar,
  User,
  Megaphone,
  CheckCircle2,
  Clock3,
  TrendingUp,
  CreditCard,
  FileText,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import JudgeModal from "./JudgeModal";
import CertificateModal from "./CertificateModal";
import MoneyStatusModal from "./MoneyStatusModal";
import AdModal from "./AdModal";

export default function OtherInfoTab({
  project,
  canEditResources,
  isAdmin,
  onProjectUpdated,
}) {
  const [activeSubTab, setActiveSubTab] = useState("judges");

  // Modals state
  const [judgeModalState, setJudgeModalState] = useState(null); // null | 'create' | judgeObject
  const [certModalState, setCertModalState] = useState(null); // null | 'create' | certObject
  const [moneyModalOpen, setMoneyModalOpen] = useState(false);
  const [adModalState, setAdModalState] = useState(null); // null | 'create' | adObject

  // Local state
  const [judges, setJudges] = useState(project.judges || []);
  const [certificates, setCertificates] = useState(project.certificates || []);
  const [moneyStatus, setMoneyStatus] = useState(
    project.moneyStatus || {
      currency: "$",
      prizeMoney: 0,
      receivedAmount: 0,
      payoutStatus: "pending",
      payoutMethod: "",
      notes: "",
      ads: [],
    }
  );

  const currency = moneyStatus.currency || "$";
  const prizeMoney = Number(moneyStatus.prizeMoney || 0);
  const receivedAmount = Number(moneyStatus.receivedAmount || 0);
  const pendingAmount = Math.max(0, prizeMoney - receivedAmount);
  const ads = moneyStatus.ads || [];
  const totalAdRevenue = ads.reduce(
    (sum, ad) => sum + Number(ad.amount || 0),
    0
  );

  /* ============================
     DELETE HANDLERS
  ============================ */
  async function deleteJudge(judgeId) {
    if (!confirm("Are you sure you want to remove this judge?")) return;

    try {
      const res = await fetch(
        `/api/projects/${project._id}/judges/${judgeId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove judge");

      setJudges((prev) => prev.filter((j) => String(j._id) !== String(judgeId)));
      toast.success("Judge removed");
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function deleteCertificate(certId) {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const res = await fetch(
        `/api/projects/${project._id}/certificates/${certId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete certificate");

      setCertificates((prev) =>
        prev.filter((c) => String(c._id) !== String(certId))
      );
      toast.success("Certificate deleted");
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function deleteAd(adId) {
    if (!confirm("Are you sure you want to remove this sponsor/ad campaign?"))
      return;

    try {
      const res = await fetch(`/api/projects/${project._id}/ads/${adId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove campaign");

      setMoneyStatus(data.moneyStatus);
      toast.success("Sponsor/Ad campaign removed");
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  return (
    <div className="space-y-6 font-body">
      {/* ========================================================= */}
      {/* SUMMARY TOP BAR */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Judges Card */}
        <div
          onClick={() => setActiveSubTab("judges")}
          className={`cursor-pointer rounded-2xl border p-5 transition duration-200 ${
            activeSubTab === "judges"
              ? "border-[var(--color-accent-deep)] bg-[var(--color-accent)]/15 shadow-sm ring-2 ring-[var(--color-accent)]/30"
              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-deep)] hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              <Award size={22} />
            </div>
            <span className="rounded-full bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-heading font-bold text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              {judges.length} {judges.length === 1 ? "Judge" : "Judges"}
            </span>
          </div>
          <h3 className="mt-4 font-heading font-bold text-base text-[var(--color-ink)]">
            Judges & Evaluation
          </h3>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Jury members, scoring, mentors & feedback
          </p>
        </div>

        {/* Certificates Card */}
        <div
          onClick={() => setActiveSubTab("certificates")}
          className={`cursor-pointer rounded-2xl border p-5 transition duration-200 ${
            activeSubTab === "certificates"
              ? "border-[var(--color-accent-deep)] bg-[var(--color-accent)]/15 shadow-sm ring-2 ring-[var(--color-accent)]/30"
              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-deep)] hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              <FileCheck size={22} />
            </div>
            <span className="rounded-full bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-heading font-bold text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              {certificates.length}{" "}
              {certificates.length === 1 ? "Certificate" : "Certificates"}
            </span>
          </div>
          <h3 className="mt-4 font-heading font-bold text-base text-[var(--color-ink)]">
            Certificate Store
          </h3>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Stored credentials, winner awards & verification links
          </p>
        </div>

        {/* Money Status & Ads Card */}
        <div
          onClick={() => setActiveSubTab("money")}
          className={`cursor-pointer rounded-2xl border p-5 transition duration-200 ${
            activeSubTab === "money"
              ? "border-[var(--color-accent-deep)] bg-[var(--color-accent)]/15 shadow-sm ring-2 ring-[var(--color-accent)]/30"
              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-deep)] hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              <Wallet size={22} />
            </div>
            <span className="rounded-full bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-heading font-bold text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              {currency}
              {prizeMoney.toLocaleString()} Prize
            </span>
          </div>
          <h3 className="mt-4 font-heading font-bold text-base text-[var(--color-ink)]">
            Money Status & Ads
          </h3>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Prize disbursements, sponsorships & ad revenue
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab("judges")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-heading font-semibold transition ${
              activeSubTab === "judges"
                ? "bg-[var(--color-accent)] text-[#0B0B0A] shadow-xs"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            <Award size={15} />
            Judges ({judges.length})
          </button>

          <button
            onClick={() => setActiveSubTab("certificates")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-heading font-semibold transition ${
              activeSubTab === "certificates"
                ? "bg-[var(--color-accent)] text-[#0B0B0A] shadow-xs"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            <FileCheck size={15} />
            Certificates ({certificates.length})
          </button>

          <button
            onClick={() => setActiveSubTab("money")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-heading font-semibold transition ${
              activeSubTab === "money"
                ? "bg-[var(--color-accent)] text-[#0B0B0A] shadow-xs"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            <Wallet size={15} />
            Money Status & Ads
          </button>
        </div>

        {/* Quick Add Action for current tab */}
        {canEditResources && (
          <div>
            {activeSubTab === "judges" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setJudgeModalState("create")}
              >
                <Plus size={14} /> Add Judge
              </Button>
            )}

            {activeSubTab === "certificates" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCertModalState("create")}
              >
                <Plus size={14} /> Add Certificate
              </Button>
            )}

            {activeSubTab === "money" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMoneyModalOpen(true)}
                >
                  <Pencil size={14} /> Update Payout
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAdModalState("create")}
                >
                  <Plus size={14} /> Add Sponsor / Ad
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: JUDGES & EVALUATION */}
      {/* ========================================================= */}
      {activeSubTab === "judges" && (
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-[var(--color-ink)]">
                Judges & Evaluation Panel
              </h2>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                Competition evaluators, reviewers, feedback, and scorecards.
              </p>
            </div>
            {canEditResources && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setJudgeModalState("create")}
              >
                <Plus size={15} /> Add Judge
              </Button>
            )}
          </div>

          {judges.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                <Award size={28} />
              </div>
              <h3 className="mt-4 font-heading font-bold text-[var(--color-ink)]">
                No Judges Added Yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-[var(--color-ink-muted)]">
                Keep track of hackathon judges, mentors, their ratings, and critique.
              </p>
              {canEditResources && (
                <div className="mt-5">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setJudgeModalState("create")}
                  >
                    <Plus size={15} /> Add First Judge
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {judges.map((judge) => (
                <div
                  key={judge._id}
                  className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-5 transition hover:border-[var(--color-accent-deep)] hover:bg-[var(--color-surface)] hover:shadow-xs"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[#0B0B0A] font-heading font-bold shadow-xs">
                          {judge.name?.charAt(0)?.toUpperCase() || "J"}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[var(--color-ink)]">
                            {judge.name}
                          </h4>
                          {judge.designation && (
                            <p className="text-xs font-body text-[var(--color-ink-muted)]">
                              {judge.designation}
                            </p>
                          )}
                        </div>
                      </div>

                      {judge.score && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-heading font-bold text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                          <Star size={12} fill="currentColor" />
                          {judge.score}
                        </span>
                      )}
                    </div>

                    {/* Organization */}
                    {judge.organization && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-muted)]">
                        <Building size={14} className="text-[var(--color-ink-soft)]" />
                        <span>{judge.organization}</span>
                      </div>
                    )}

                    {/* Feedback / Notes */}
                    {judge.notes && (
                      <div className="mt-3 rounded-xl bg-[var(--color-surface)] p-3 text-xs leading-relaxed text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                        <p className="font-heading font-bold text-[var(--color-ink)] mb-0.5">Feedback / Notes:</p>
                        <p className="break-words">{judge.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
                    <div className="flex items-center gap-2">
                      {judge.email && (
                        <a
                          href={`mailto:${judge.email}`}
                          title={`Email ${judge.name}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink)] hover:border-[var(--color-accent-deep)]"
                        >
                          <Mail size={12} />
                          Email
                        </a>
                      )}
                      {judge.linkedIn && (
                        <a
                          href={
                            judge.linkedIn.startsWith("http")
                              ? judge.linkedIn
                              : `https://${judge.linkedIn}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn Profile"
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink)] hover:border-[var(--color-accent-deep)]"
                        >
                          <Globe size={12} />
                          Profile
                        </a>
                      )}
                    </div>

                    {canEditResources && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setJudgeModalState(judge)}
                          className="rounded-lg p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                          title="Edit Judge"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteJudge(judge._id)}
                          className="rounded-lg p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                          title="Delete Judge"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: CERTIFICATE STORE */}
      {/* ========================================================= */}
      {activeSubTab === "certificates" && (
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-[var(--color-ink)]">
                Certificate Store & Credentials
              </h2>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                Participation certificates, winner awards, verification links, and credentials.
              </p>
            </div>
            {canEditResources && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCertModalState("create")}
              >
                <Plus size={15} /> Add Certificate
              </Button>
            )}
          </div>

          {certificates.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                <FileCheck size={28} />
              </div>
              <h3 className="mt-4 font-heading font-bold text-[var(--color-ink)]">No Certificates Stored</h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-[var(--color-ink-muted)]">
                Upload participation certificates, winning awards, credentials, and verification keys.
              </p>
              {canEditResources && (
                <div className="mt-5">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCertModalState("create")}
                  >
                    <Plus size={15} /> Add First Certificate
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-5 transition hover:border-[var(--color-accent-deep)] hover:bg-[var(--color-surface)] hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 font-bold">
                          <Award size={18} />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[var(--color-ink)]">
                            {cert.title}
                          </h4>
                          {cert.recipient && (
                            <p className="text-xs text-[var(--color-ink-muted)]">
                              For: <span className="font-semibold text-[var(--color-ink)]">{cert.recipient}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                      {cert.type && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-heading font-semibold text-[var(--color-accent-deep)]">
                          {cert.type}
                        </span>
                      )}

                      {cert.issuer && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 font-medium text-[var(--color-ink-muted)]">
                          <Building size={12} className="text-[var(--color-ink-soft)]" />
                          {cert.issuer}
                        </span>
                      )}
                    </div>

                    {cert.description && (
                      <p className="mt-3 text-xs text-[var(--color-ink-muted)] bg-[var(--color-surface)] rounded-xl p-2.5 border border-[var(--color-border)]">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      {cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[var(--color-ink)] hover:border-[var(--color-accent-deep)]"
                        >
                          <ExternalLink size={12} />
                          View
                        </a>
                      )}

                      {cert.credentialId && (
                        <button
                          onClick={() => copyText(cert.credentialId, "Credential ID")}
                          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-[var(--color-ink)] hover:border-[var(--color-accent-deep)]"
                          title="Copy Credential ID"
                        >
                          <Copy size={13} />
                        </button>
                      )}
                    </div>

                    {canEditResources && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCertModalState(cert)}
                          className="rounded-lg p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                          title="Edit Certificate"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteCertificate(cert._id)}
                          className="rounded-lg p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                          title="Delete Certificate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: MONEY STATUS & SPONSORSHIPS / ADS */}
      {/* ========================================================= */}
      {activeSubTab === "money" && (
        <div className="space-y-6">
          {/* Main Financial KPI Box */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border)] pb-5">
              <div>
                <h2 className="text-xl font-heading font-bold text-[var(--color-ink)]">
                  Prize Money & Financial Status
                </h2>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  Real-time tracking of prize earnings, disbursements, and account settlements.
                </p>
              </div>

              {canEditResources && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setMoneyModalOpen(true)}
                >
                  <Pencil size={15} /> Update Financials
                </Button>
              )}
            </div>

            {/* Financial Numbers Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Prize Money */}
              <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4 border border-[var(--color-border)]">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Total Prize Money
                </p>
                <p className="mt-2 text-2xl font-heading font-black text-[var(--color-ink)] sm:text-3xl">
                  {currency}
                  {prizeMoney.toLocaleString()}
                </p>
              </div>

              {/* Amount Received */}
              <div className="rounded-2xl bg-[var(--color-accent)]/20 p-4 border border-[var(--color-accent)]/30">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-accent-deep)]">
                  Amount Received
                </p>
                <p className="mt-2 text-2xl font-heading font-black text-[var(--color-ink)] sm:text-3xl">
                  {currency}
                  {receivedAmount.toLocaleString()}
                </p>
              </div>

              {/* Pending Amount */}
              <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4 border border-[var(--color-border)]">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Pending Payout
                </p>
                <p className="mt-2 text-2xl font-heading font-black text-[var(--color-ink)] sm:text-3xl">
                  {currency}
                  {pendingAmount.toLocaleString()}
                </p>
              </div>

              {/* Sponsor & Ad Total */}
              <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4 border border-[var(--color-border)]">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Sponsors & Ads Total
                </p>
                <p className="mt-2 text-2xl font-heading font-black text-[var(--color-ink)] sm:text-3xl">
                  {currency}
                  {totalAdRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payout Status & Progress */}
            <div className="mt-6 rounded-2xl bg-[var(--color-surface-muted)] p-5 border border-[var(--color-border)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                    Payout Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-heading font-bold capitalize bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                      {moneyStatus.payoutStatus === "received" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}
                      {moneyStatus.payoutStatus}
                    </span>

                    {moneyStatus.payoutMethod && (
                      <span className="text-xs font-medium text-[var(--color-ink-muted)]">
                        via <span className="font-bold text-[var(--color-ink)]">{moneyStatus.payoutMethod}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right sm:w-1/3">
                  <div className="flex justify-between text-xs font-semibold text-[var(--color-ink-muted)]">
                    <span>Received Progress</span>
                    <span className="text-[var(--color-ink)]">
                      {prizeMoney > 0
                        ? Math.min(100, Math.round((receivedAmount / prizeMoney) * 100))
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                      style={{
                        width: `${
                          prizeMoney > 0
                            ? Math.min(100, (receivedAmount / prizeMoney) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {moneyStatus.notes && (
                <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-ink-muted)]">
                  <span className="font-bold text-[var(--color-ink)]">Financial Notes: </span>
                  {moneyStatus.notes}
                </div>
              )}
            </div>
          </div>

          {/* Sponsors & Ads Section */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone size={20} className="text-[var(--color-accent-deep)]" />
                  <h3 className="text-lg font-heading font-bold text-[var(--color-ink)]">
                    Sponsorships & Advertisements (Ads)
                  </h3>
                </div>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  Monetization partners, event sponsors, ad placements, and brand deals.
                </p>
              </div>

              {canEditResources && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setAdModalState("create")}
                >
                  <Plus size={15} /> Add Sponsor / Ad Deal
                </Button>
              )}
            </div>

            {ads.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                  <Megaphone size={24} />
                </div>
                <h4 className="mt-3 font-heading font-bold text-[var(--color-ink)]">No Sponsors or Ads Added</h4>
                <p className="mx-auto mt-1 max-w-sm text-xs text-[var(--color-ink-muted)]">
                  Track revenue from sponsors, banner ads, and partner deals for this project.
                </p>
                {canEditResources && (
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setAdModalState("create")}
                    >
                      <Plus size={14} /> Add First Sponsor
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ads.map((ad) => (
                  <div
                    key={ad._id}
                    className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-4 transition hover:border-[var(--color-accent-deep)] hover:bg-[var(--color-surface)] hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading font-bold text-sm text-[var(--color-ink)]">
                          {ad.name}
                        </h4>
                        <span className="rounded-full bg-[var(--color-accent)]/20 px-2.5 py-0.5 text-[10px] font-heading font-bold capitalize text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
                          {ad.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 font-semibold text-[var(--color-ink)]">
                          {ad.type}
                        </span>
                        <span className="font-heading font-bold text-[var(--color-ink)]">
                          {currency}
                          {Number(ad.amount || 0).toLocaleString()}
                        </span>
                      </div>

                      {ad.contact && (
                        <p className="mt-2.5 text-xs text-[var(--color-ink-muted)]">
                          <span className="font-semibold text-[var(--color-ink)]">POC: </span>
                          {ad.contact}
                        </p>
                      )}

                      {ad.deliverables && (
                        <div className="mt-2 rounded-xl bg-[var(--color-surface)] p-2.5 text-xs text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                          <p className="font-heading font-bold text-[var(--color-ink)] mb-0.5">Deliverables:</p>
                          <p>{ad.deliverables}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2.5 text-xs">
                      {ad.proofUrl ? (
                        <a
                          href={ad.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[var(--color-ink)] hover:border-[var(--color-accent-deep)]"
                        >
                          <ExternalLink size={12} />
                          Proof
                        </a>
                      ) : (
                        <span />
                      )}

                      {canEditResources && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setAdModalState(ad)}
                            className="rounded-lg p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                            title="Edit Ad"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteAd(ad._id)}
                            className="rounded-lg p-1 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                            title="Delete Ad"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      {judgeModalState && (
        <JudgeModal
          projectId={project._id}
          judge={judgeModalState === "create" ? null : judgeModalState}
          isOpen={Boolean(judgeModalState)}
          onClose={() => setJudgeModalState(null)}
          onSaved={(savedJudge) => {
            setJudges((prev) => {
              const exists = prev.some((j) => String(j._id) === String(savedJudge._id));
              if (exists) {
                return prev.map((j) =>
                  String(j._id) === String(savedJudge._id) ? savedJudge : j
                );
              }
              return [...prev, savedJudge];
            });
            setJudgeModalState(null);
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}

      {certModalState && (
        <CertificateModal
          projectId={project._id}
          certificate={certModalState === "create" ? null : certModalState}
          isOpen={Boolean(certModalState)}
          onClose={() => setCertModalState(null)}
          onSaved={(savedCert) => {
            setCertificates((prev) => {
              const exists = prev.some((c) => String(c._id) === String(savedCert._id));
              if (exists) {
                return prev.map((c) =>
                  String(c._id) === String(savedCert._id) ? savedCert : c
                );
              }
              return [...prev, savedCert];
            });
            setCertModalState(null);
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}

      {moneyModalOpen && (
        <MoneyStatusModal
          projectId={project._id}
          moneyStatus={moneyStatus}
          isOpen={moneyModalOpen}
          onClose={() => setMoneyModalOpen(false)}
          onSaved={(updatedStatus) => {
            setMoneyStatus(updatedStatus);
            setMoneyModalOpen(false);
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}

      {adModalState && (
        <AdModal
          projectId={project._id}
          ad={adModalState === "create" ? null : adModalState}
          isOpen={Boolean(adModalState)}
          onClose={() => setAdModalState(null)}
          onSaved={(updatedStatus) => {
            setMoneyStatus(updatedStatus);
            setAdModalState(null);
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}
    </div>
  );
}
