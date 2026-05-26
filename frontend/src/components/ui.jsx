import React, { useMemo, useEffect, useState } from 'react';

export const Logo = () => (
  <div className="flex items-center gap-2.5">
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M8 6 Q16 12 24 6 M8 12 Q16 18 24 12 M8 18 Q16 24 24 18 M8 24 Q16 30 24 24"
        stroke="url(#logoGrad)" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <circle cx="8" cy="6" r="2" fill="#06B6D4" />
      <circle cx="24" cy="6" r="2" fill="#8B5CF6" />
      <circle cx="8" cy="18" r="2" fill="#8B5CF6" />
      <circle cx="24" cy="18" r="2" fill="#06B6D4" />
    </svg>
    <div>
      <div className="font-display font-bold text-lg leading-none tracking-tight">GeneTrace</div>
      <div className="text-[9px] tracking-[0.2em] text-cyan-400 uppercase">Bioinformatics Lab</div>
    </div>
  </div>
);

export const ParticleField = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        color: Math.random() > 0.5 ? '#06B6D4' : '#8B5CF6',
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export const AnimatedDNA = ({ size = 200 }) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    let id = requestAnimationFrame(function loop() {
      setT(prev => prev + 0.02);
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const bases = ['A', 'T', 'G', 'C'];
  const colors = { A: '#34d399', T: '#f87171', G: '#facc15', C: '#60a5fa' };
  const rungs = 14;

  return (
    <svg viewBox="0 0 200 400" width={size} height={size * 2}
      className="drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
      <defs>
        <linearGradient id="strand1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="strand2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      {Array.from({ length: rungs }).map((_, i) => {
        const y = (i / (rungs - 1)) * 380 + 10;
        const phase = i * 0.5 + t;
        const x1 = 100 + Math.sin(phase) * 50;
        const x2 = 100 - Math.sin(phase) * 50;
        const base1 = bases[i % 4];
        const base2 = { A: 'T', T: 'A', G: 'C', C: 'G' }[base1];
        const zFront = Math.sin(phase) > 0;
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y}
              stroke={zFront ? 'rgba(148,163,184,0.4)' : 'rgba(148,163,184,0.15)'}
              strokeWidth="1.5" strokeDasharray="2 3" />
            <circle cx={x1} cy={y} r="6" fill={colors[base1]} opacity={zFront ? 1 : 0.5} />
            <circle cx={x2} cy={y} r="6" fill={colors[base2]} opacity={zFront ? 0.5 : 1} />
          </g>
        );
      })}
      <path d={(() => {
        let d = '';
        for (let i = 0; i <= 100; i++) {
          const y = (i / 100) * 380 + 10;
          const x = 100 + Math.sin(i * 0.1 + t) * 50;
          d += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
        }
        return d;
      })()} stroke="url(#strand1)" strokeWidth="3" fill="none" />
      <path d={(() => {
        let d = '';
        for (let i = 0; i <= 100; i++) {
          const y = (i / 100) * 380 + 10;
          const x = 100 - Math.sin(i * 0.1 + t) * 50;
          d += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
        }
        return d;
      })()} stroke="url(#strand2)" strokeWidth="3" fill="none" />
    </svg>
  );
};

export const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <div className="text-center mb-12">
    {eyebrow && (
      <div className="inline-block text-xs tracking-[0.3em] text-cyan-400 uppercase font-medium mb-3 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-500/5">
        {eyebrow}
      </div>
    )}
    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>}
  </div>
);

export const StatCard = ({ label, value, sub, color = 'cyan' }) => (
  <div className="glass p-4 rounded-xl">
    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">{label}</div>
    <div className={`font-display text-2xl font-bold text-${color}-400`}>{value}</div>
    {sub && <div className="text-[10px] text-slate-500 mt-1">{sub}</div>}
  </div>
);

export const DNAInput = ({ value, onChange, label, placeholder, rows = 3 }) => {
  const sanitized = (value || '').toUpperCase();
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-2">
        {label}
      </label>
      <textarea
        value={sanitized}
        onChange={e => onChange(e.target.value.toUpperCase().replace(/[^ATGC]/g, ''))}
        placeholder={placeholder}
        rows={rows}
        className="w-full glass rounded-xl p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-600"
      />
      <div className="flex justify-between text-[10px] mt-1.5 uppercase tracking-wider">
        <span className="text-slate-500">
          Length: <span className="text-cyan-400">{sanitized.length}</span>
        </span>
        <span className="text-slate-500">Only A, T, G, C accepted</span>
      </div>
    </div>
  );
};
