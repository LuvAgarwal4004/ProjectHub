import React from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-xl overflow-hidden grid md:grid-cols-2">
          {/* Left Side */}
          <div
            style={{ backgroundColor: "#0B0B0A" }}
            className="text-white p-8 md:p-10 flex flex-col justify-center border-r border-[var(--color-border)]"
          >
            <h1 className="text-4xl font-heading font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-white/70 leading-7 font-body text-sm">
              Have questions about a bug in website or an error or anything?!
              We'd love to hear from you.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-[var(--color-accent)]" size={24} />
                <div>
                  <p className="text-white/60 text-xs font-heading">
                    Email
                  </p>
                  <p className="font-body font-medium break-all text-sm">
                    luvag0707@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-[var(--color-accent)]" size={24} />
                <div>
                  <p className="text-white/60 text-xs font-heading">
                    Phone
                  </p>
                  <p className="font-body font-medium text-sm">
                    +91 7278717660
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="text-[var(--color-accent)]" size={24} />
                <div>
                  <p className="text-white/60 text-xs font-heading">
                    Business Hours
                  </p>
                  <p className="font-body font-medium text-sm">
                    Monday - Saturday
                  </p>
                  <p className="text-xs text-white/60">
                    9:00 AM – 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-8 md:p-10 flex flex-col justify-center bg-[var(--color-surface)]">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-ink)] mb-3">
              Get In Touch
            </h2>

            <p className="text-[var(--color-ink-muted)] mb-8 leading-7 text-sm">
              Whether you have a question about your projects or need help, we're here to help.
            </p>

            <div className="space-y-5">
              <div className="rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-accent-deep)] transition">
                <div className="flex items-center gap-3">
                  <Mail className="text-[var(--color-accent-deep)]" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-[var(--color-ink)]">
                      Email Support
                    </p>
                    <p className="text-[var(--color-ink-muted)] text-xs break-all">
                      luvag0707@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-accent-deep)] transition">
                <div className="flex items-center gap-3">
                  <Phone className="text-[var(--color-accent-deep)]" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-[var(--color-ink)]">
                      Phone Support
                    </p>
                    <p className="text-[var(--color-ink-muted)] text-xs">
                      +91 9874448947
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-accent-deep)] transition">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[var(--color-danger)]" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-[var(--color-ink)]">
                      Service Area
                    </p>
                    <p className="text-[var(--color-ink-muted)] text-xs">
                      Available across India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;