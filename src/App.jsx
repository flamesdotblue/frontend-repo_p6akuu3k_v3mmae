import React, { useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import Features from './components/Features';
import ContactForm from './components/ContactForm';
import Dashboard from './components/Dashboard';

function LoginScreen({ onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      onSuccess();
    } else {
      setError('Please enter your credentials');
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1695740633675-d060b607f5c4?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjE1MDAxMzd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="rounded-xl border border-emerald-500/10 bg-slate-950/70 p-8 shadow-inner shadow-emerald-500/5 backdrop-blur">
          <div className="mb-6 text-center">
            <div className="text-xl font-semibold text-white">Canopy Analytics</div>
            <div className="text-xs text-emerald-300">Secure Access</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                placeholder="user@agency.gov"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-amber-300">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Back to homepage
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-400">
            For authorized personnel only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

function pad2(n){return String(n).padStart(2,'0');}
function fmtStamp(d){
  const y = d.getFullYear();
  const m = pad2(d.getMonth()+1);
  const da = pad2(d.getDate());
  const h = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  const s = pad2(d.getSeconds());
  return `${y}${m}${da}${h}${mi}${s}`;
}

function useDummyData() {
  return useMemo(() => {
    // Generate ~360 samples over past 72 hours
    const types = ['Light-duty Vehicle','Oversize Vehicle','Tricycle'];
    const dirs = ['Up','Down'];
    const out = [];
    const now = new Date();
    for (let i = 0; i < 360; i++) {
      const d = new Date(now.getTime() - Math.random() * 72 * 3600 * 1000);
      const speedBase = 20 + Math.random() * 70; // 20..90
      const rush = [7,8,9,17,18,19].includes(d.getHours()) ? 1.2 : 0.9;
      const speed = Math.max(0, Math.round(speedBase * rush + (Math.random()*8-4)));
      out.push({
        license_plate_number: `CAN-${Math.floor(1000+Math.random()*9000)}`,
        car_type: types[Math.floor(Math.random()*types.length)],
        direction: dirs[Math.floor(Math.random()*dirs.length)],
        channel_no: String(1 + Math.floor(Math.random()*4)),
        list_type: 'None',
        capture_time: fmtStamp(d),
        speed: String(speed),
        lane_no: String(1 + Math.floor(Math.random()*3)),
        data_type: 'Normal Data',
        plate_picture: 'Plate Picture',
        picture: 'Picture1'
      });
    }
    // Sort newest first
    out.sort((a,b) => (a.capture_time > b.capture_time ? -1 : 1));
    return out;
  }, []);
}

export default function App() {
  const [route, setRoute] = useState('home'); // 'home' | 'login' | 'app'
  const data = useDummyData();

  if (route === 'login') {
    return <LoginScreen onSuccess={() => setRoute('app')} onBack={() => setRoute('home')} />;
    }

  if (route === 'app') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.6)]" />
              <span className="text-sm font-semibold text-emerald-300">Canopy Application</span>
            </div>
            <button
              onClick={() => setRoute('home')}
              className="text-sm font-medium text-slate-300 hover:text-white"
            >
              Exit
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 pb-16">
          <Dashboard onLogout={() => setRoute('home')} data={data} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeroCover onCTAClick={() => setRoute('login')} />
      <main>
        <Features />
        <ContactForm />
      </main>
      <footer className="border-t border-emerald-500/10 bg-slate-950/90 py-8">
        <div className="mx-auto max-w-6xl px-6 text-sm text-slate-400">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} Canopy Analytics. All rights reserved.</p>
            <p>
              Need help? <button onClick={() => setRoute('login')} className="text-emerald-300 hover:text-emerald-200">Secure Portal Login</button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
