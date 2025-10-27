import React from 'react';
import { Shield, BellRing, BarChart3, Activity } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '24/7 Real-Time Monitoring',
    desc: 'Always-on telemetry streams with secure, encrypted transport.',
  },
  {
    icon: BellRing,
    title: 'Instant Over-Speed Alerts',
    desc: 'High-priority notifications when thresholds are breached.',
  },
  {
    icon: BarChart3,
    title: 'Robust Analytics & Reporting',
    desc: 'Historical insights, trends, and exportable reports.',
  },
  {
    icon: Activity,
    title: 'Operational Health',
    desc: 'System status and sensor diagnostics in one view.',
  },
];

export default function Features() {
  return (
    <section className="relative w-full border-t border-emerald-500/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Built for oversight and action</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          A secure platform for internal monitoring teams and transportation authorities.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-lg border border-emerald-500/10 bg-slate-900/60 p-5 shadow-inner shadow-emerald-500/5 transition hover:border-emerald-400/30 hover:shadow-emerald-400/10"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-500/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
