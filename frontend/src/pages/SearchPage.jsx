import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle, StatCard, DNAInput } from '../components/ui.jsx';
import { horspoolSearch, naiveSearch, DISEASE_MARKERS } from '../utils/horspool.js';

const SAMPLE_DNA = 'ATGCGTAGCTAGCTAGCATGCGTAGCAATGCTAGCTAGCTAGCATGCAGCTAGCGTATGCGT';

export default function SearchPage({ addHistory }) {
  const [dna, setDna] = useState(SAMPLE_DNA);
  const [pattern, setPattern] = useState('TAGC');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const runSearch = () => {
    if (!pattern || !dna) return;
    setRunning(true);
    setTimeout(() => {
      const horspool = horspoolSearch(dna, pattern);
      const naive = naiveSearch(dna, pattern);
      const r = { horspool, naive, pattern, dna };
      setResult(r);
      addHistory({ pattern, dnaLen: dna.length, matches: horspool.matches.length, time: horspool.executionTime });
      setRunning(false);
    }, 400);
  };

  const HighlightedDNA = ({ dna, matches, pattern }) => {
    const matchSet = new Set();
    matches.forEach(start => {
      for (let i = 0; i < pattern.length; i++) matchSet.add(start + i);
    });
    return (
      <div className="font-mono text-sm leading-loose break-all">
        {dna.split('').map((c, i) => (
          <span key={i}
            className={`inline-block px-0.5 ${matchSet.has(i) ? 'bg-purple-500/40 text-purple-200 rounded' : `base-${c}`}`}>
            {c}
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-28 pb-20 min-h-screen relative bg-grid">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle eyebrow="Core Tool" title="DNA Pattern Search"
          subtitle="Search any sub-sequence inside a DNA strand using Horspool's algorithm — and benchmark it against naive matching." />

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass p-6 rounded-2xl space-y-5">
            <DNAInput label="DNA Sequence" value={dna} onChange={setDna}
              placeholder="Paste your DNA sequence here..." rows={4} />
            <DNAInput label="Pattern to Search" value={pattern} onChange={setPattern}
              placeholder="e.g. TAGC" rows={2} />
            <div className="flex flex-wrap gap-3">
              <button disabled={running || !pattern} onClick={runSearch}
                className="btn-primary px-6 py-3 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                {running ? 'Analyzing…' : '▶ Analyze Sequence'}
              </button>
              <button onClick={() => { setDna(SAMPLE_DNA); setPattern('TAGC'); }}
                className="px-6 py-3 rounded-xl border border-slate-700 hover:border-cyan-400 text-sm">
                Load Sample
              </button>
              <button onClick={() => { setDna(''); setPattern(''); setResult(null); }}
                className="px-6 py-3 rounded-xl border border-slate-700 hover:border-rose-400 text-sm">
                Clear
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Disease Marker Scan</div>
            <div className="space-y-2 text-sm">
              {DISEASE_MARKERS.map(m => (
                <button key={m.name} onClick={() => setPattern(m.pattern)}
                  className="w-full text-left flex items-center justify-between gap-2 p-2.5 rounded-lg hover:bg-slate-800/60 transition">
                  <div>
                    <div className="font-medium" style={{ color: m.color }}>{m.name}</div>
                    <div className="text-[10px] text-slate-500">{m.disease}</div>
                  </div>
                  <span className="font-mono text-xs text-slate-300">{m.pattern}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatCard label="Matches Found" value={result.horspool.matches.length} color="purple" />
                <StatCard label="Comparisons" value={result.horspool.comparisons} />
                <StatCard label="Total Shifts" value={result.horspool.shifts} />
                <StatCard label="Skipped" value={result.horspool.skippedComparisons} sub="theoretical" />
                <StatCard label="Horspool Time" value={result.horspool.executionTime.toFixed(3) + ' ms'} />
                <StatCard label="Naive Time" value={result.naive.executionTime.toFixed(3) + ' ms'} color="purple" />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 rounded-2xl">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    DNA Highlight View
                  </h3>
                  <div className="bg-slate-950/60 p-4 rounded-xl max-h-72 overflow-auto border border-slate-800/60">
                    <HighlightedDNA dna={result.dna} matches={result.horspool.matches} pattern={result.pattern} />
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Matched positions:{' '}
                    <span className="text-purple-400 font-mono">
                      {result.horspool.matches.join(', ') || 'none'}
                    </span>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                  <h3 className="font-semibold mb-3">Shift Table</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['A', 'T', 'G', 'C'].map(c => {
                      const val = result.horspool.shiftTable[c] !== undefined
                        ? result.horspool.shiftTable[c] : result.pattern.length;
                      return (
                        <div key={c} className="bg-slate-950/60 rounded-lg p-3 text-center border border-slate-800/50">
                          <div className={`font-mono font-bold text-2xl base-${c}`}>{c}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">shift</div>
                          <div className="font-mono text-lg text-slate-200">{val}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold mb-4">Naive vs Horspool — Comparisons</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { name: 'Naive', comparisons: result.naive.comparisons },
                    { name: 'Horspool', comparisons: result.horspool.comparisons },
                  ]}>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
                    <Bar dataKey="comparisons" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center text-sm text-slate-400 mt-2">
                  Horspool used <span className="text-cyan-400 font-bold">{result.horspool.comparisons}</span> comparisons vs{' '}
                  <span className="text-rose-400 font-bold">{result.naive.comparisons}</span> for naive — that's a{' '}
                  <span className="text-purple-400 font-bold">
                    {(result.naive.comparisons / Math.max(result.horspool.comparisons, 1)).toFixed(2)}×
                  </span>{' '}
                  reduction.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
