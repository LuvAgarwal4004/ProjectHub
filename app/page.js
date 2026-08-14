import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800">
      {/* Navbar */}
      <nav className="border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            Project<span className="text-blue-600">Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pb-20 pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            ✦ One place for all your project resources
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Keep your projects
            <span className="block text-blue-600">
              organized & accessible.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Store your project files, important links, technical information
            and team members in one organized workspace. Share resources with
            your team while keeping access simple and controlled.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-2xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Get Started →
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* What is ProjectHub */}
      <section className="border-y border-slate-200/70 bg-white/60 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              What is ProjectHub?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your project's home on the web.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              ProjectHub gives every project a dedicated workspace where your
              team can keep everything important together instead of searching
              through scattered files, messages and links.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon="📁"
              title="Store Files"
              description="Upload documents, images, presentations, ZIP files and other project resources and access them whenever you need."
            />

            <FeatureCard
              icon="🔗"
              title="Save Links"
              description="Keep GitHub repositories, Figma designs, live websites, documentation and other useful URLs together."
            />

            <FeatureCard
              icon="🧩"
              title="Project Information"
              description="Keep your project's description, technology stack and other important information organized in one place."
            />

            <FeatureCard
              icon="👥"
              title="Work Together"
              description="Invite your teammates and give them the right level of access with Admin, Editor and Viewer roles."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Simple to use
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              How it works
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            <Step
              number="01"
              title="Create a Project"
              description="Create a workspace and add your project's name, description and technical stack."
            />

            <Step
              number="02"
              title="Invite Your Team"
              description="Invite people to your project. New members join as Viewers by default."
            />

            <Step
              number="03"
              title="Add Resources"
              description="Upload files and save useful URLs so everything your team needs is in one place."
            />

            <Step
              number="04"
              title="Collaborate"
              description="Share resources with your team while controlling access through Admin, Editor and Viewer roles."
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="border-y border-slate-200/70 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Controlled access
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everyone gets the right access.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Project owners can manage their team and decide who can edit or
              simply view the project's resources.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <RoleCard
              title="Admin"
              description="Full control over the project, members and resources."
              items={[
                "Manage project information",
                "Invite members",
                "Change member roles",
                "Manage files and links",
              ]}
            />

            <RoleCard
              title="Editor"
              description="Can work with the project's shared resources."
              items={[
                "Upload files",
                "Delete files",
                "Add links",
                "Manage shared resources",
              ]}
            />

            <RoleCard
              title="Viewer"
              description="Can access project information and shared resources."
              items={[
                "View project",
                "View files",
                "Download files",
                "Open saved links",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Why use it?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Stop hunting for project resources.
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                Projects often end up with files in one place, links in
                another and team members working without knowing who has
                access to what. ProjectHub brings all of that together.
              </p>

              <div className="mt-8 space-y-4">
                <Bullet text="Keep important project resources organized." />
                <Bullet text="Give your team one place to access everything." />
                <Bullet text="Quickly find important files and links." />
                <Bullet text="Control who can view or modify resources." />
              </div>
            </div>

            {/* Visual mockup */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      PROJECT
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      HITK Stationary
                    </h3>
                  </div>

                  <div className="rounded-xl bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    Active
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <MiniCard icon="📁" text="Files" count="24" />
                  <MiniCard icon="🔗" text="Links" count="8" />
                  <MiniCard icon="👥" text="Members" count="5" />
                </div>

                <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Team
                    </span>

                    <span className="text-xs text-slate-400">
                      5 members
                    </span>
                  </div>

                  <div className="mt-4 flex -space-x-2">
                    <Avatar letter="L" />
                    <Avatar letter="R" />
                    <Avatar letter="A" />
                    <Avatar letter="P" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-500">
                      +1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center shadow-2xl sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            Ready to organize?
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Want to get started?!
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
            Create your account, start a project and bring your team's
            resources together in one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-2xl bg-white px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Sign Up
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-slate-600 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} ProjectHub. All rights reserved.
          </p>

          <p>Organize. Share. Collaborate.</p>
        </div>
      </footer>
    </main>
  );
}

/* ---------------- Components ---------------- */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function RoleCard({ title, description, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-blue-600">✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
        ✓
      </span>

      <p className="text-slate-600">{text}</p>
    </div>
  );
}

function MiniCard({ icon, text, count }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      <div className="text-xl">{icon}</div>
      <p className="mt-1 text-xs font-medium text-slate-500">{text}</p>
      <p className="mt-1 font-bold text-slate-900">{count}</p>
    </div>
  );
}

function Avatar({ letter }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-700">
      {letter}
    </div>
  );
}