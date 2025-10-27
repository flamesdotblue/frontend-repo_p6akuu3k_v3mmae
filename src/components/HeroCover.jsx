import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover({ onCTAClick }) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/6tUXqVcUA0xgJugv/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Overlay gradients for night-forest vibe */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_60%)]"></div>

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-6">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300">
          Canopy Analytics
        </span>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          Intelligent Speed Monitoring. Safer Roads.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Real-time over-speed detection and analytics built for secure, mission-critical operations.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onCTAClick}
            className="rounded-md bg-lime-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300"
          >
            Access Your Dashboard
          </button>
          <a
            href="#contact"
            className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            Request secure access
          </a>
        </div>
      </div>
    </section>
  );
}
