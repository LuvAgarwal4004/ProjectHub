import { jetbrainsMono, inter } from "@/app/fonts";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import RouteLoader from "@/components/RouteLoader";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "DevHouse — Organize, Share & Collaborate",
  description: "Keep your projects organized & accessible. Store project files, important links, technical info, and team members in one workspace.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

const themeScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem('theme');
      var isDark = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-body antialiased">
        <SessionWrapper>
          <RouteLoader>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </RouteLoader>
        </SessionWrapper>
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-ink)",
              borderRadius: "12px",
              padding: "12px 18px",
              fontSize: "14px",
              fontFamily: "var(--font-heading), monospace",
              border: "1px solid var(--color-border)",
            },
            success: {
              iconTheme: {
                primary: "var(--color-accent)",
                secondary: "var(--color-ink)",
              },
            },
            error: {
              iconTheme: {
                primary: "var(--color-danger)",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
