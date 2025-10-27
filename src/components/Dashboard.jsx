import React, { useMemo } from 'react';
import { Home, Video, FileBarChart, Settings, LogOut } from 'lucide-react';

const StatCard = ({ label, value, accent = 'text-lime-400' }) => (
  <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
  </div>
);

function useHourCounts(data) {
  return useMemo(() => {
    if (!data || data.length === 0) return { hours: Array.from({ length: 12 }, (_, i) => i + 8), counts: Array(12).fill(0) };
    const nowHour = 23; // use 12 slots, demo purposes
    const hours = Array.from({ length: 12 }, (_, i) => ((nowHour - 11 + i + 24) % 24));
    const map = new Map(hours.map((h) => [h, 0]));
    data.forEach((d) => {
      const ts = String(d.capture_time || '');
      const h = Number(ts.slice(8, 10));
      if (map.has(h)) map.set(h, (map.get(h) || 0) + 1);
    });
    const counts = hours.map((h) => map.get(h) || 0);
    return { hours, counts };
  }, [data]);
}

function BarChart({ data }) {
  const { hours, counts } = useHourCounts(data);
  const max = Math.max(1, ...counts);
  return (
    <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Violations by Hour</h3>
          <p className="text-xs text-slate-400">Last 12 hours</p>
        </div>
      </div>
      <div className="mt-2 flex h-40 items-end gap-2">
        {counts.map((val, idx) => (
          <div key={idx} className="flex w-full flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-lime-400"
              style={{ height: `${(val / max) * 100}%` }}
            />
            <span className="text-[10px] text-slate-400">{String(hours[idx]).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(ts) {
  if (!ts || String(ts).length < 12) return '-';
  const h = String(ts).slice(8, 10);
  const m = String(ts).slice(10, 12);
  return `${h}:${m}`;
}

function ViolationsTable({ data }) {
  return (
    <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
      <h3 className="mb-3 text-sm font-semibold text-white">Latest Violations</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-emerald-300">
              <th className="px-3 py-2 text-left font-semibold">Plate</th>
              <th className="px-3 py-2 text-left font-semibold">Speed</th>
              <th className="px-3 py-2 text-left font-semibold">Limit</th>
              <th className="px-3 py-2 text-left font-semibold">Type</th>
              <th className="px-3 py-2 text-left font-semibold">Direction</th>
              <th className="px-3 py-2 text-left font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((d, i) => {
              const limit = 60; // demo limit
              const spd = Number(d.speed || 0);
              const over = spd > limit;
              return (
                <tr key={i} className="border-t border-slate-800 text-slate-200">
                  <td className="px-3 py-2">{d.license_plate_number}</td>
                  <td className={`px-3 py-2 font-semibold ${over ? 'text-amber-300' : 'text-slate-200'}`}>{spd} km/h</td>
                  <td className="px-3 py-2 text-slate-300">{limit} km/h</td>
                  <td className="px-3 py-2 text-slate-300">{d.car_type}</td>
                  <td className="px-3 py-2 text-slate-300">{d.direction}</td>
                  <td className="px-3 py-2 text-slate-400">{formatTime(d.capture_time)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard({ onLogout, data }) {
  const peak = useMemo(() => Math.max(0, ...((data || []).map((d) => Number(d.speed || 0)))) , [data]);
  const total = data ? data.length : 0;

  return (
    <div className="grid min-h-[70vh] grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-12 h-full rounded-xl border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5 sm:col-span-3 lg:col-span-2">
        <div className="mb-6">
          <div className="text-lg font-semibold text-white">Canopy</div>
          <div className="text-xs text-emerald-300">Secure Portal</div>
        </div>
        <nav className="space-y-1 text-sm">
          <a className="flex items-center gap-2 rounded-md px-3 py-2 text-emerald-300 hover:bg-slate-800" href="#">
            <Home className="h-4 w-4" /> Dashboard
          </a>
          <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-200 hover:bg-slate-800" href="#">
            <Video className="h-4 w-4" /> Live Feed
          </a>
          <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-200 hover:bg-slate-800" href="#">
            <FileBarChart className="h-4 w-4" /> Reports
          </a>
          <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-200 hover:bg-slate-800" href="#">
            <Settings className="h-4 w-4" /> Alert Settings
          </a>
        </nav>
        <button onClick={onLogout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="col-span-12 space-y-6 sm:col-span-9 lg:col-span-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Detections (Recent)" value={String(total)} />
          <StatCard label="Peak Speed Recorded" value={`${peak} km/h`} />
          <StatCard label="Active Cameras" value="58" />
          <StatCard label="Alerts Dispatched" value="94" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BarChart data={data} />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
              <h3 className="mb-3 text-sm font-semibold text-white">System Status</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between text-slate-300">
                  Ingestion Pipeline <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">Healthy</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  Alert Queue <span className="rounded-full bg-lime-400/20 px-2 py-0.5 text-lime-300">Normal</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  DB Replication <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-amber-300">Synced</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ViolationsTable data={data} />
      </main>
    </div>
  );
}
