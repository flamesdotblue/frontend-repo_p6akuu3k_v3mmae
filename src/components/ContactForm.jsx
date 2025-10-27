import React, { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative w-full bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Request secure access</h2>
            <p className="mt-2 max-w-prose text-slate-300">
              Submit your details and our operations team will provision a secure account.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li>• SOC 2 aligned operational practices</li>
              <li>• Role-based access control</li>
              <li>• Region-aware data residency</li>
            </ul>
          </div>
          <div>
            <div className="rounded-xl border border-emerald-500/10 bg-slate-950/60 p-6 shadow-inner shadow-emerald-500/5">
              {!submitted ? (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200">Organization</label>
                    <input
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      placeholder="e.g., City Transport Authority"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-200">Full name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200">Work email</label>
                      <input
                        type="email"
                        required
                        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                        placeholder="jane@agency.gov"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200">Message</label>
                    <textarea
                      rows={4}
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      placeholder="Share your use case or required coverage areas"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    Request Access
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    By submitting, you agree to our security and data handling policies.
                  </p>
                </form>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">Request received</h3>
                  <p className="mt-2 text-slate-300">Our team will reach out to verify details and enable your account.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
