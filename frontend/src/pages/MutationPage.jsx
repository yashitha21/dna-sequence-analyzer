import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle, StatCard, DNAInput } from '../components/ui';
import { detectMutations, calculateSimilarity } from '../utils/horspool';
import { mutationService } from '../services/api';

const SAMPLE_ORIGINAL = 'ATGCGTAGCTAGCTAGCATGCGTAGCAATGCTAGCTAGCTAGCATGCAGCTAGCGTATGCGT';
const SAMPLE_MUTATED  = 'ATGCGTAACTAGCTAGCATGCGTAGCAATGCTAGCTAGGTAGCATGCAGCTACCGTATGCGT';

const colorOf = (base) => {
  switch (base) {
    case 'A': return '#34d399';
    case 'T': return '#f87171';
    case 'G': return '#facc15';
    case 'C': return '#60a5fa';
    default:  return '#94a3b8';
  }
};

const MutationPage = ({ user }) => {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [mutated, setMutated]   = useState(SAMPLE_MUTATED);
  const [result, setResult]     = useState(null);

  const analyze = async () => {
    const o = original.toUpperCase().replace(/[^ATGC]/g, '');
    const m = mutated.toUpperCase().replace(/[^ATGC]/g, '');
    if (!o || !m) return;
    const mutations = detectMutations(o, m);
    const similarity = calculateSimilarity(o, m);
    const data = { mutations, similarity, original: o, mutated: m };
    setResult(data);

    // Build density buckets of length 10
    if (user) {
      try { await mutationService.detect({ original: o, mutated: m, mutations, similarity }); }
      catch (e) { /* offline ok */ }
    }
  };

  // Heatmap density: split into 10 buckets
  const density = result ? (() => {
    const len = Math.max(result.original.length, result.mutated.length);
    const buckets = 10;
    const data = [];
    for (let b = 0; b < buckets; b++) {
      const start = Math.floor((b * len) / buckets);
      const end = Math.floor(((b + 1) * len) / buckets);
      const count = result.mutations.filter(mu => mu.position >= start && mu.position < end).length;
      data.push({ region: `R${b + 1}`, mutations: count });
    }
    return data;
  })() : [];

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Comparative Genomics"
          title="Mutation Detection"
          subtitle="Compare an original and a mutated DNA sequence to identify point mutations, calculate similarity, and visualize mutation density across genomic regions."
        />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DNAInput label="Original Sequence" value={original} onChange={setOriginal} placeholder="Enter original DNA..." />
          <DNAInput label="Mutated Sequence"  value={mutated}  onChange={setMutated}  placeholder="Enter mutated DNA..."  />
        </div>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={analyze}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
            Detect Mutations
          </motion.button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard label="Mutations Detected" value={result.mutations.length} color="red" />
              <StatCard label="Similarity"          value={`${result.similarity}%`} color="cyan" />
              <StatCard label="Sequence Length"     value={Math.max(result.original.length, result.mutated.length)} color="purple" />
              <StatCard label="Identity Regions"    value={Math.max(result.original.length, result.mutated.length) - result.mutations.length} color="emerald" />
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 text-white">Aligned Sequence Comparison</h3>
              <div className="space-y-4 font-mono text-sm overflow-x-auto">
                <div>
                  <div className="text-slate-400 mb-2 text-xs uppercase tracking-wider">Original</div>
                  <div className="flex flex-wrap gap-1">
                    {result.original.split('').map((b, i) => {
                      const isMut = result.mutations.some(m => m.position === i);
                      return (
                        <span
                          key={`o${i}`}
                          className={`base-cell ${isMut ? 'mismatch' : 'match'}`}
                          style={{ color: isMut ? '#fff' : colorOf(b) }}
                        >{b}</span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-2 text-xs uppercase tracking-wider">Mutated</div>
                  <div className="flex flex-wrap gap-1">
                    {result.mutated.split('').map((b, i) => {
                      const isMut = result.mutations.some(m => m.position === i);
                      return (
                        <span
                          key={`m${i}`}
                          className={`base-cell ${isMut ? 'mismatch' : 'match'}`}
                          style={{ color: isMut ? '#fff' : colorOf(b) }}
                        >{b}</span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6 text-white">Mutation List</h3>
                {result.mutations.length === 0 ? (
                  <div className="text-emerald-400 text-center py-10">No mutations detected — sequences are identical.</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {result.mutations.map((m, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                        <div className="text-slate-300 text-sm">Position <span className="text-cyan-400 font-mono">{m.position}</span></div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="base-cell match" style={{ color: colorOf(m.original) }}>{m.original}</span>
                          <span className="text-slate-500">→</span>
                          <span className="base-cell mismatch text-white">{m.mutated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6 text-white">Mutation Density Heatmap</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={density}>
                    <defs>
                      <linearGradient id="mutGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#f87171" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#f87171" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="region" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                      labelStyle={{ color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="mutations" stroke="#f87171" fill="url(#mutGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MutationPage;
