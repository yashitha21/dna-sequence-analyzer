import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle, DNAInput } from '../components/ui.jsx';
import { horspoolSearch } from '../utils/horspool.js';

export default function VisualizationPage() {
  const [dna, setDna] = useState('ATGCGTAGCTAGCTAGC');
  const [pattern, setPattern] = useState('TAGC');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const analysis = useMemo(() => horspoolSearch(dna, pattern), [dna, pattern]);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= analysis.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStepIdx(s => s + 1), speed);
    return () => clearTimeout(id);
  }, [playing, stepIdx, speed, analysis.steps.length]);

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [dna, pattern]);

  const step = analysis.steps[stepIdx];
  const completedAlignments = analysis.steps
    .slice(0, stepIdx + 1)
    .filter(s => s.fullMatch)
    .map(s => s.alignmentStart);

  const compMap = {};
  if (step) {
    step.comparisons.forEach(c => {
      compMap[c.textIdx] = c.matched ? 'match' : 'mismatch';
    });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-28 pb-20 min-h-screen relative bg-grid">
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle eyebrow="Step-by-Step" title="Horspool Visualizer"
          subtitle="Watch the pattern slide along the text, with right-to-left comparisons, mismatches, and smart shifts." />

        <div className="glass p-5 rounded-2xl mb-6 grid md:grid-cols-2 gap-4">
          <DNAInput label="Text (DNA)" value={dna} onChange={setDna} rows={2} />
          <DNAInput label="Pattern" value={pattern} onChange={setPattern} rows={2} />
        </div>

        <div className="glass p-5 rounded-2xl mb-6 flex flex-wrap items-center gap-4">
          <button onClick={() => setPlaying(!playing)} className="btn-primary px-5 py-2.5 rounded-lg font-semibold text-sm">
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
          <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0}
            className="px-4 py-2.5 rounded-lg border border-slate-700 text-sm disabled:opacity-40">◀ Prev</button>
          <button onClick={() => setStepIdx(Math.min(analysis.steps.length - 1, stepIdx + 1))}
            disabled={stepIdx >= analysis.steps.length - 1}
            className="px-4 py-2.5 rounded-lg border border-slate-700 text-sm disabled:opacity-40">Next ▶</button>
          <button onClick={() => { setStepIdx(0); setPlaying(false); }}
            className="px-4 py-2.5 rounded-lg border border-slate-700 text-sm">⟲ Reset</button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Speed</span>
            <input type="range" min="200" max="2000" step="100" value={2200 - speed}
              onChange={e => setSpeed(2200 - parseInt(e.target.value))} className="accent-cyan-500" />
          </div>
          <div className="font-mono text-sm text-cyan-400">
            Step {stepIdx + 1} / {analysis.steps.length}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl mb-6 overflow-x-auto">
          {step ? (
            <div className="min-w-max">
              <div className="flex mb-1 text-[10px] text-slate-600 font-mono">
                {dna.split('').map((_, i) => (
                  <div key={i} className="text-center" style={{ width: 40 }}>{i}</div>
                ))}
              </div>

              <div className="flex mb-6">
                {dna.split('').map((c, i) => {
                  const state = compMap[i];
                  const inWindow = i >= step.alignmentStart && i < step.alignmentStart + pattern.length;
                  const isFound = completedAlignments.some(start => i >= start && i < start + pattern.length);
                  let cls = `base-cell base-${c}`;
                  if (state === 'match') cls += ' match';
                  else if (state === 'mismatch') cls += ' mismatch';
                  else if (isFound && !inWindow) cls += ' found';
                  else if (!inWindow && i < step.alignmentStart) cls += ' skipped';
                  return <div key={i} className={cls} style={{ width: 40 }}>{c}</div>;
                })}
              </div>

              <div className="flex" style={{ marginLeft: step.alignmentStart * 40 }}>
                {pattern.split('').map((c, i) => {
                  const textIdx = step.alignmentStart + i;
                  const state = compMap[textIdx];
                  let cls = `base-cell base-${c}`;
                  if (state === 'match') cls += ' match';
                  else if (state === 'mismatch') cls += ' mismatch';
                  return <div key={i} className={cls} style={{ width: 40 }}>{c}</div>;
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6 text-sm">
                <div className="px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 font-mono">
                  shift = {step.shift}
                </div>
                {step.fullMatch && (
                  <div className="px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-mono">
                    ✓ MATCH at index {step.alignmentStart}
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  Bad char: <span className="font-mono text-slate-300">{step.badChar}</span> → table lookup ={' '}
                  <span className="font-mono text-cyan-400">{step.shift}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-center py-8">Enter a DNA sequence and pattern to begin visualization</div>
          )}
        </div>

        <div className="glass p-4 rounded-2xl flex flex-wrap gap-4 text-sm mb-6">
          <div className="flex items-center gap-2"><div className="base-cell match" style={{ width: 24, height: 24 }}></div> Matched</div>
          <div className="flex items-center gap-2"><div className="base-cell mismatch" style={{ width: 24, height: 24 }}></div> Mismatch</div>
          <div className="flex items-center gap-2"><div className="base-cell found" style={{ width: 24, height: 24 }}></div> Already Matched</div>
          <div className="flex items-center gap-2"><div className="base-cell skipped" style={{ width: 24, height: 24 }}>A</div> Skipped Region</div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-semibold mb-3">Shift Table for "{pattern}"</h3>
            <div className="grid grid-cols-4 gap-2">
              {['A', 'T', 'G', 'C'].map(c => {
                const val = analysis.shiftTable[c] !== undefined ? analysis.shiftTable[c] : pattern.length;
                return (
                  <div key={c} className="bg-slate-950/60 rounded-lg p-3 text-center border border-slate-800/50">
                    <div className={`font-mono font-bold text-2xl base-${c}`}>{c}</div>
                    <div className="font-mono text-lg text-slate-200">{val}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Pattern</span><span className="font-mono text-cyan-400">{pattern}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Text length</span><span className="font-mono">{dna.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Matches found</span><span className="font-mono text-purple-400">{analysis.matches.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total comparisons</span><span className="font-mono">{analysis.comparisons}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Pattern shifts</span><span className="font-mono">{analysis.shifts}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Execution time</span><span className="font-mono text-emerald-400">{analysis.executionTime.toFixed(3)} ms</span></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
