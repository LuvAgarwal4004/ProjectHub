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
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* SUMMARY TOP BAR */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Judges Card */}
        <div
          onClick={() => setActiveSubTab("judges")}
          className={`cursor-pointer rounded-2xl border p-5 transition duration-200 ${
            activeSubTab === "judges"
              ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Award size={22} />
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              {judges.length} {judges.length === 1 ? "Judge" : "Judges"}
            </span>
          </div>
          <h3 className="mt-4 font-bold text-slate-900">Judges & Evaluation</h3>
          <p className="mt-1 text-xs text-slate-500">
            Jury members, scoring, mentors & feedback
          </p>
        </div>

        {/* Certificates Card */}
        <div
          onClick={() => setActiveSubTab("certificates")}
          className={`cursor-pointer rounded-2xl border p-5 transition duration-200 ${
            activeSubTab === "certificates"
              ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FileCheck size={22} />
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {certificates.length}{" "}
              {certificates.length === 1 ? "Certificate" : "Certificates"}
            </span>
          </div>
          <h3 className="mt-4 font-bold text-slate-900">Certificate Store</h3>
          <p className="mt-1 text-xs text-slate-500">
            Stored credentials, winner awards & verification links
          </p>
        </div>

        {/* Money Status & Ads Card */}
        <div
          onClick={() => setActiveSubTab("money")}
          className={`cursor-pointer rounded-2xl border p-5 transition duration-200 ${
            activeSubTab === "money"
              ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Wallet size={22} />
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
              {currency}
              {prizeMoney.toLocaleString()} Prize
            </span>
          </div>
          <h3 className="mt-4 font-bold text-slate-900">Money Status & Ads</h3>
          <p className="mt-1 text-xs text-slate-500">
            Prize disbursements, sponsorships & ad revenue
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab("judges")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeSubTab === "judges"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Award size={16} />
            Judges ({judges.length})
          </button>

          <button
            onClick={() => setActiveSubTab("certificates")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeSubTab === "certificates"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileCheck size={16} />
            Certificate Store ({certificates.length})
          </button>

          <button
            onClick={() => setActiveSubTab("money")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeSubTab === "money"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Wallet size={16} />
            Money Status & Ads
          </button>
        </div>

        {/* Quick Add Action for current tab */}
        {canEditResources && (
          <div>
            {activeSubTab === "judges" && (
              <button
                onClick={() => setJudgeModalState("create")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus size={15} />
                Add Judge
              </button>
            )}

            {activeSubTab === "certificates" && (
              <button
                onClick={() => setCertModalState("create")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Plus size={15} />
                Add Certificate
              </button>
            )}

            {activeSubTab === "money" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMoneyModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                >
                  <Pencil size={13} />
                  Edit Financials
                </button>
                <button
                  onClick={() => setAdModalState("create")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
                >
                  <Plus size={15} />
                  Add Sponsor / Ad
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: JUDGES & EVALUATION */}
      {/* ========================================================= */}
      {activeSubTab === "judges" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Judges & Evaluation Panel
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Competition evaluators, reviewers, feedback, and scorecards.
              </p>
            </div>
            {canEditResources && (
              <button
                onClick={() => setJudgeModalState("create")}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Judge
              </button>
            )}
          </div>

          {judges.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Award size={28} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">No Judges Added Yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Keep track of hackathon judges, mentors, their ratings, and critique.
              </p>
              {canEditResources && (
                <button
                  onClick={() => setJudgeModalState("create")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add First Judge
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {judges.map((judge) => (
                <div
                  key={judge._id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
                          {judge.name?.charAt(0)?.toUpperCase() || "J"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {judge.name}
                          </h4>
                          {judge.designation && (
                            <p className="text-xs font-medium text-slate-600">
                              {judge.designation}
                            </p>
                          )}
                        </div>
                      </div>

                      {judge.score && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
                          <Star size={12} fill="currentColor" />
                          {judge.score}
                        </span>
                      )}
                    </div>

                    {/* Organization */}
                    {judge.organization && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Building size={14} className="text-slate-400" />
                        <span>{judge.organization}</span>
                      </div>
                    )}

                    {/* Feedback / Notes */}
                    {judge.notes && (
                      <div className="mt-3 rounded-xl bg-white p-3 text-xs leading-relaxed text-slate-600 border border-slate-100">
                        <p className="font-semibold text-slate-800 mb-0.5">Feedback / Notes:</p>
                        <p className="break-words">{judge.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-xs">
                    <div className="flex items-center gap-2">
                      {judge.email && (
                        <a
                          href={`mailto:${judge.email}`}
                          title={`Email ${judge.name}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
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
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
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
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                          title="Edit Judge"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteJudge(judge._id)}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Certificate Store & Credentials
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Centralized vault for certificates of achievement, participation, and verification links.
              </p>
            </div>
            {canEditResources && (
              <button
                onClick={() => setCertModalState("create")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Plus size={16} />
                Add Certificate
              </button>
            )}
          </div>

          {certificates.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FileCheck size={28} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">No Certificates Stored</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Add your project’s achievement awards, winner badges, or completion certificates.
              </p>
              {canEditResources && (
                <button
                  onClick={() => setCertModalState("create")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <Plus size={16} />
                  Add First Certificate
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-emerald-50/20 p-5 transition hover:border-emerald-300 hover:bg-white hover:shadow-md"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                          <Award size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {cert.title}
                          </h4>
                          {cert.recipient && (
                            <p className="text-xs font-semibold text-emerald-700">
                              Issued to: {cert.recipient}
                            </p>
                          )}
                        </div>
                      </div>

                      {cert.issueDate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          <Calendar size={11} />
                          {cert.issueDate}
                        </span>
                      )}
                    </div>

                    {/* Issuer & Credential ID */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      {cert.issuer && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 font-medium text-slate-700">
                          <Building size={12} className="text-slate-400" />
                          {cert.issuer}
                        </span>
                      )}
                      {cert.credentialId && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/70 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                          <KeyRound size={11} />
                          {cert.credentialId}
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {cert.notes && (
                      <p className="mt-3 text-xs text-slate-600 bg-white/70 rounded-xl p-2.5 border border-slate-100">
                        {cert.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-xs">
                    <div className="flex items-center gap-2">
                      {cert.url ? (
                        <>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 font-semibold text-white hover:bg-emerald-700"
                          >
                            <ExternalLink size={12} />
                            View Certificate
                          </a>
                          <button
                            onClick={() => copyText(cert.url, "Certificate URL")}
                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100"
                            title="Copy link"
                          >
                            <Copy size={13} />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs italic">
                          No direct link attached
                        </span>
                      )}
                    </div>

                    {canEditResources && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCertModalState(cert)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                          title="Edit Certificate"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteCertificate(cert._id)}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Prize Money & Financial Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Real-time tracking of prize earnings, disbursements, and account settlements.
                </p>
              </div>

              {canEditResources && (
                <button
                  onClick={() => setMoneyModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
                >
                  <Pencil size={16} />
                  Update Financials
                </button>
              )}
            </div>

            {/* Financial Numbers Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Prize Money */}
              <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-100">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Total Prize Money
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  {currency}
                  {prizeMoney.toLocaleString()}
                </p>
              </div>

              {/* Amount Received */}
              <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Amount Received
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-700 sm:text-3xl">
                  {currency}
                  {receivedAmount.toLocaleString()}
                </p>
              </div>

              {/* Pending Amount */}
              <div className="rounded-2xl bg-blue-50/70 p-4 border border-blue-100">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Pending Payout
                </p>
                <p className="mt-2 text-2xl font-black text-blue-700 sm:text-3xl">
                  {currency}
                  {pendingAmount.toLocaleString()}
                </p>
              </div>

              {/* Sponsor & Ad Total */}
              <div className="rounded-2xl bg-purple-50/70 p-4 border border-purple-100">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Sponsors & Ads Total
                </p>
                <p className="mt-2 text-2xl font-black text-purple-700 sm:text-3xl">
                  {currency}
                  {totalAdRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payout Status & Progress */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 border border-slate-100">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Payout Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        moneyStatus.payoutStatus === "received"
                          ? "bg-emerald-100 text-emerald-800"
                          : moneyStatus.payoutStatus === "disbursed"
                          ? "bg-blue-100 text-blue-800"
                          : moneyStatus.payoutStatus === "processing"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {moneyStatus.payoutStatus === "received" && (
                        <CheckCircle2 size={13} />
                      )}
                      {moneyStatus.payoutStatus === "pending" && (
                        <Clock3 size={13} />
                      )}
                      {moneyStatus.payoutStatus === "processing" && (
                        <TrendingUp size={13} />
                      )}
                      {moneyStatus.payoutStatus}
                    </span>

                    {moneyStatus.payoutMethod && (
                      <span className="text-xs font-medium text-slate-600">
                        via <span className="font-bold">{moneyStatus.payoutMethod}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right sm:w-1/3">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Received Progress</span>
                    <span>
                      {prizeMoney > 0
                        ? Math.min(100, Math.round((receivedAmount / prizeMoney) * 100))
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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
                <div className="mt-4 border-t border-slate-200/70 pt-3 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Financial Notes: </span>
                  {moneyStatus.notes}
                </div>
              )}
            </div>
          </div>

          {/* Sponsors & Ads Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone size={20} className="text-purple-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Sponsorships & Advertisements (Ads)
                  </h3>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Monetization partners, event sponsors, ad placements, and brand deals.
                </p>
              </div>

              {canEditResources && (
                <button
                  onClick={() => setAdModalState("create")}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
                >
                  <Plus size={16} />
                  Add Sponsor / Ad Deal
                </button>
              )}
            </div>

            {ads.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Megaphone size={24} />
                </div>
                <h4 className="mt-3 font-bold text-slate-900">No Sponsors or Ads Added</h4>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                  Track revenue from sponsors, banner ads, and partner deals for this project.
                </p>
                {canEditResources && (
                  <button
                    onClick={() => setAdModalState("create")}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                  >
                    <Plus size={14} />
                    Add First Sponsor
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ads.map((ad) => (
                  <div
                    key={ad._id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-4 transition hover:border-purple-200 hover:bg-white hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900">
                          {ad.name}
                        </h4>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                            ad.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : ad.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : ad.status === "in_discussion"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {ad.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 font-semibold text-purple-700">
                          {ad.type}
                        </span>
                        <span className="font-bold text-slate-900">
                          {currency}
                          {Number(ad.amount || 0).toLocaleString()}
                        </span>
                      </div>

                      {ad.contact && (
                        <p className="mt-2.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">POC: </span>
                          {ad.contact}
                        </p>
                      )}

                      {ad.notes && (
                        <p className="mt-2 rounded-lg bg-white p-2 text-xs text-slate-600 border border-slate-100">
                          {ad.notes}
                        </p>
                      )}
                    </div>

                    {canEditResources && (
                      <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-200/70 pt-2">
                        <button
                          onClick={() => setAdModalState(ad)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                          title="Edit Campaign"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteAd(ad._id)}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete Campaign"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
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
          project={project}
          judge={judgeModalState === "create" ? null : judgeModalState}
          onClose={() => setJudgeModalState(null)}
          onSaved={(newJudges) => {
            if (Array.isArray(newJudges)) {
              setJudges(newJudges);
            } else if (newJudges) {
              setJudges((prev) => {
                const idx = prev.findIndex((j) => String(j._id) === String(newJudges._id));
                if (idx !== -1) {
                  const updated = [...prev];
                  updated[idx] = newJudges;
                  return updated;
                }
                return [newJudges, ...prev];
              });
            }
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}

      {certModalState && (
        <CertificateModal
          project={project}
          certificate={certModalState === "create" ? null : certModalState}
          onClose={() => setCertModalState(null)}
          onSaved={(newCerts) => {
            if (Array.isArray(newCerts)) {
              setCertificates(newCerts);
            } else if (newCerts) {
              setCertificates((prev) => {
                const idx = prev.findIndex((c) => String(c._id) === String(newCerts._id));
                if (idx !== -1) {
                  const updated = [...prev];
                  updated[idx] = newCerts;
                  return updated;
                }
                return [newCerts, ...prev];
              });
            }
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}

      {moneyModalOpen && (
        <MoneyStatusModal
          project={project}
          moneyStatus={moneyStatus}
          onClose={() => setMoneyModalOpen(false)}
          onSaved={(newStatus) => {
            setMoneyStatus(newStatus);
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}

      {adModalState && (
        <AdModal
          project={project}
          ad={adModalState === "create" ? null : adModalState}
          onClose={() => setAdModalState(null)}
          onSaved={(updatedMoneyStatusOrAd) => {
            if (updatedMoneyStatusOrAd && updatedMoneyStatusOrAd.ads) {
              setMoneyStatus(updatedMoneyStatusOrAd);
            } else {
              // Re-fetch or refresh
              setMoneyStatus((prev) => ({
                ...prev,
                ads: prev.ads.map((a) =>
                  String(a._id) === String(updatedMoneyStatusOrAd._id)
                    ? updatedMoneyStatusOrAd
                    : a
                ),
              }));
            }
            if (onProjectUpdated) onProjectUpdated();
          }}
        />
      )}
    </div>
  );
}
