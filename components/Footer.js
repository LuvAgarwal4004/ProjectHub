import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#0B0B0A] text-white border-t border-white/10 font-body">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="DEVHOUSE"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-white/20 shrink-0 shadow-2xs"
              />
              <h2 className="text-2xl font-heading font-extrabold uppercase text-white tracking-tight">
                DEV<span className="text-[var(--color-accent)]">HOUSE</span>
              </h2>
            </Link>

            <p className="text-white/70 text-xs font-body mt-1.5">
              Organize, share, and collaborate on your team projects.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-heading font-medium text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/50 text-xs font-body">
          © {new Date().getFullYear()}{" "}
          <span className="font-heading font-bold text-white uppercase tracking-wider">
            DEVHOUSE
          </span>
          . All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;