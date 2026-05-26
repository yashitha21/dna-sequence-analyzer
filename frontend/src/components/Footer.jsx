import React from 'react';
import { Logo } from './ui.jsx';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800/60 py-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <Logo />
          <p className="text-slate-500 mt-3 text-xs leading-relaxed">
            A DAA + Bioinformatics project showcasing Horspool string matching applied to DNA pattern detection.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Features</div>
          <ul className="space-y-1.5 text-slate-500">
            <li>DNA Pattern Search</li>
            <li>Mutation Detection</li>
            <li>Algorithm Visualizer</li>
            <li>Analytics Dashboard</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Algorithm</div>
          <ul className="space-y-1.5 text-slate-500">
            <li>Horspool (1980)</li>
            <li>Boyer-Moore family</li>
            <li>O(n/m) avg-case</li>
            <li>O(nm) worst-case</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-slate-800/40 text-xs text-slate-600 text-center">
        © 2026 GeneTrace Lab — Built with Horspool, React, and a lot of caffeine.
      </div>
    </footer>
  );
}
