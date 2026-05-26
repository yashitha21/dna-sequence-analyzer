import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParticleField, AnimatedDNA, SectionTitle } from '../components/ui.jsx';

const FEATURES = [
  { icon: '🧬', title: 'DNA Pattern Search', desc: 'Lightning-fast subsequence detection using Horspool string matching.' },
  { icon: '⚡', title: 'Real-time Visualization', desc: 'Watch the algorithm shift, compare, and skip — frame by frame.' },
  { icon: '🔬', title: 'Mutation Detection', desc: 'Pinpoint base substitutions between original and modified sequences.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track searches, mutations, and algorithm efficiency in one place.' },
  { icon: '🩺', title: 'Disease Marker Scan', desc: 'Screen sequences against BRCA, TP53, sickle-cell and more.' },
  { icon: '📈', title: 'Naive vs Horspool', desc: 'Side-by-side benchmark of classic DAA algorithms.' },
];

const STATS = [
  { label: 'DNA Bases Analyzed', value: '12.4M' },
  { label: 'Avg. Speed-up vs Naive', value: '7.2×' },
  { label: 'Mutations Catalogued', value: '48,210' },
  { label: 'Disease Markers', value: '5' },
];

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/10" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
        <ParticleField />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-cyan-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Powered by Horspool String Matching
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Analyze DNA Sequences <span className="gradient-text">Faster</span> Using Horspool Algorithm
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              A modern bioinformatics platform that detects patterns, mutations and disease markers in DNA sequences — with full visualization of the algorithm's inner workings.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search" className="btn-primary px-7 py-3.5 rounded-full font-semibold text-white">
                Start Analyzing →
              </Link>
              <Link to="/visualize" className="px-7 py-3.5 rounded-full font-semibold border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 transition">
                See Visualizer
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-cyan-500/30 blur-[80px] rounded-full" />
            <AnimatedDNA size={220} />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-12 border-y border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <SectionTitle eyebrow="Capabilities" title="Built for Genome Research"
            subtitle="A research-grade toolkit packing classical DAA into a slick biotech interface." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
                className="glass p-6 rounded-2xl hover:border-cyan-400/40 transition group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ALGORITHM PREVIEW */}
      <section className="relative py-24 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle eyebrow="The Algorithm" title="Horspool — The Smarter Search"
            subtitle="A 1980 simplification of Boyer-Moore that skips comparisons using a single bad-character table." />
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="glass p-6 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto">
              <div className="text-slate-500 mb-2">{'// Horspool core loop'}</div>
              <pre className="text-slate-200">{`function horspool(text, pattern) {
  const m = pattern.length, n = text.length;
  const table = buildShiftTable(pattern);
  let i = m - 1;
  while (i < n) {
    let k = 0;
    while (k < m && pattern[m-1-k] === text[i-k]) k++;
    if (k === m) return i - m + 1; // match!
    i += table[text[i]] ?? m;       // skip
  }
}`}</pre>
            </div>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Preprocess', desc: 'Build a shift table mapping each character to its rightmost position in the pattern.' },
                { step: '02', title: 'Compare right-to-left', desc: 'Align pattern with text and check matches from the tail backwards.' },
                { step: '03', title: 'Smart shifting', desc: 'On mismatch, jump forward by the table value of the aligned text character.' },
                { step: '04', title: 'Repeat', desc: 'Continue until the pattern walks past the end of the text.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 glass p-4 rounded-xl">
                  <div className="font-mono text-2xl text-cyan-400 font-bold">{s.step}</div>
                  <div>
                    <div className="font-semibold mb-1">{s.title}</div>
                    <div className="text-sm text-slate-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="glass-strong p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/30 blur-[100px] rounded-full" />
            <h2 className="relative font-display text-3xl sm:text-4xl font-bold mb-4">Ready to explore your DNA?</h2>
            <p className="relative text-slate-400 mb-8 max-w-xl mx-auto">
              Paste a sequence, hit analyze, and watch Horspool tear through millions of bases in milliseconds.
            </p>
            <Link to="/search" className="relative inline-block btn-primary px-8 py-4 rounded-full font-semibold">
              Launch DNA Analyzer →
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
