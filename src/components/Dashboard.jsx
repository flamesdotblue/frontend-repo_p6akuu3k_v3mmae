import React, { useMemo } from 'react';
import { Home, Video, FileBarChart, Settings, LogOut, Activity } from 'lucide-react';

const StatCard = ({ label, value, accent = 'text-lime-400' }) => (
  <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
  </div>
);

function useHourCounts(data, windowHours = 12) {
  return useMemo(() => {
    if (!data || data.length === 0) return { hours: Array.from({ length: windowHours }, (_, i) => i), counts: Array(windowHours).fill(0) };
    const now = new Date();
    const hours = Array.from({ length: windowHours }, (_, i) => ((now.getHours() - (windowHours - 1) + i + 24) % 24));
    const map = new Map(hours.map((h) => [h, 0]));
    data.forEach((d) => {
      const ts = String(d.capture_time || '');
      // expects YYYYMMDDHHMMSS
      const h = Number(ts.slice(8, 10));
      if (!Number.isNaN(h) && map.has(h)) map.set(h, (map.get(h) || 0) + 1);
    });
    const counts = hours.map((h) => map.get(h) || 0);
    return { hours, counts };
  }, [data, windowHours]);
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

function useSpeedTrend(data, windowHours = 24) {
  return useMemo(() => {
    const now = new Date();
    const hours = Array.from({ length: windowHours }, (_, i) => ((now.getHours() - (windowHours - 1) + i + 24) % 24));
    const sums = new Map(hours.map(h => [h, 0]));
    const counts = new Map(hours.map(h => [h, 0]));
    (data || []).forEach(d => {
      const ts = String(d.capture_time || '');
      const h = Number(ts.slice(8,10));
      const sp = Number(d.speed || 0);
      if (!Number.isNaN(h) && counts.has(h)) {
        sums.set(h, (sums.get(h) || 0) + sp);
        counts.set(h, (counts.get(h) || 0) + 1);
      }
    });
    const avg = hours.map(h => {
      const c = counts.get(h) || 0;
      return c ? (sums.get(h) || 0) / c : 0;
    });
    return { hours, avg };
  }, [data, windowHours]);
}

function LineChart({ data }) {
  const { hours, avg } = useSpeedTrend(data);
  const max = Math.max(60, ...avg, 1);
  const min = 0;
  const points = avg.map((v, i) => {
    const x = (i / (avg.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Average Speed Trend</h3>
        <span className="text-xs text-slate-400">Last 24 hours</span>
      </div>
      <div className="h-40 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polyline fill="none" stroke="url(#grad)" strokeWidth="2" points={points} />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        {hours.map((h, i) => (
          <span key={i}>{String(h).padStart(2,'0')}</span>
        ))}
      </div>
    </div>
  );
}

function useHeatmap(data) {
  return useMemo(() => {
    // Matrix: rows = days (Mon..Sun), cols = hours 0..23
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));
    (data || []).forEach(d => {
      const ts = String(d.capture_time || '');
      // YYYYMMDDHHMMSS -> get day from JS Date if possible, else compute rough
      if (ts.length >= 10) {
        const y = Number(ts.slice(0,4));
        const m = Number(ts.slice(4,6)) - 1;
        const day = Number(ts.slice(6,8));
        const h = Number(ts.slice(8,10));
        const dt = new Date(y, m, day, h);
        const wd = (dt.getDay() + 6) % 7; // Mon=0
        if (Number.isFinite(wd) && Number.isFinite(h)) matrix[wd][h] += 1;
      }
    });
    const flat = matrix.flat();
    const max = Math.max(1, ...flat);
    return { days, matrix, max };
  }, [data]);
}

function HeatMap({ data }) {
  const { days, matrix, max } = useHeatmap(data);
  return (
    <div className="rounded-lg border border-emerald-500/10 bg-slate-900/70 p-4 shadow-inner shadow-emerald-500/5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Traffic Intensity Heatmap</h3>
        <span className="text-xs text-slate-400">Week view</span>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="flex flex-col gap-1 text-[10px] text-slate-400">
          {days.map(d => (
            <span key={d} className="h-6 leading-6">{d}</span>
          ))}
        </div>
        <div className="grid grid-rows-7 gap-1">
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-24 gap-1">
              {row.map((val, cIdx) => {
                const intensity = val / max; // 0..1
                const bg = `rgba(16,185,129,${0.12 + intensity * 0.88})`;
                return <div key={cIdx} title={`H${cIdx}: ${val}`} className="h-6 rounded" style={{ backgroundColor: bg }} />;
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
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
            {(data || []).slice(0, 12).map((d, i) => {
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
  const avgSpeed = useMemo(() => {
    const vals = (data || []).map(d => Number(d.speed || 0));
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a,b)=>a+b,0) / vals.length);
  }, [data]);

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
          <StatCard label="Average Speed" value={`${avgSpeed} km/h`} />
          <StatCard label="Active Cameras" value="58" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BarChart data={data} />
          </div>
          <div className="lg:col-span-2">
            <LineChart data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ViolationsTable data={data} />
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
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Activity className="h-4 w-4 text-emerald-300" />
                <span>All services within SLA</span>
              </div>
            </div>
          </div>
        </div>

        <HeatMap data={data} />
      </main>
    </div>
  );
}
