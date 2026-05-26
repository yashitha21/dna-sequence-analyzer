import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SectionTitle, StatCard } from '../components/ui';
import { analyticsService } from '../services/api';

// Default offline analytics so the page is always populated
const DEFAULT = {
  totals: { searches: 1247, mutations: 384, patterns: 56, avgTime: 1.42 },
  daily: [
    { day: 'Mon', searches: 142, mutations: 28 },
    { day: 'Tue', searches: 198, mutations: 41 },
    { day: 'Wed', searches: 176, mutations: 35 },
    { day: 'Thu', searches: 234, mutations: 58 },
    { day: 'Fri', searches: 289, mutations: 72 },
    { day: 'Sat', searches: 156, mutations: 32 },
    { day: 'Sun', searches: 187, mutations: 44 },
  ],
  composition: [
    { name: 'Adenine (A)',  value: 28, fill: '#34d399' },
    { name: 'Thymine (T)',  value: 26, fill: '#f87171' },
    { name: 'Guanine (G)',  value: 23, fill: '#facc15' },
    { name: 'Cytosine (C)', value: 23, fill: '#60a5fa' },
  ],
  topPatterns: [
    { pattern: 'TAGC', count: 184 },
    { pattern: 'ATGC', count: 152 },
    { pattern: 'GCAT', count: 128 },
    { pattern: 'CCTG', count: 98  },
    { pattern: 'AGGT', count: 76  },
  ],
  efficiency: [
    { metric: 'Speed',       horspool: 92, naive: 45 },
    { metric: 'Memory',      horspool: 88, naive: 70 },
    { metric: 'Comparisons', horspool: 90, naive: 35 },
    { metric: 'Shifts',      horspool: 95, naive: 50 },
    { metric: 'Scalability', horspool: 89, naive: 42 },
  ],
  history: [
    { id: 1, pattern: 'TAGC', dna: 'ATGCGTAGCTAGCTA...', matches: 2, time: '2h ago' },
    { id: 2, pattern: 'BRCA1-MUT', dna: 'AGCTAGGCAGTC...', matches: 1, time: '5h ago' },
    { id: 3, pattern: 'GGCAG', dna: 'CTGAGGTCAGGAG...', matches: 3, time: '1d ago' },
    { id: 4, pattern: 'CTG repeat', dna: 'CTGCTGCTGCTG...', matches: 4, time: '2d ago' },
  ],
};

const AnalyticsPage = ({ user }) => {
  const [data, setData] = useState(DEFAULT);

  useEffect(() => {
    if (!user) return;
    analyticsService.get()
      .then(res => res?.data && setData({ ...DEFAULT, ...res.data }))
      .catch(() => { /* keep defaults */ });
  }, [user]);

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Platform Analytics"
          title="Analytics Dashboard"
          subtitle="Real-time insights into pattern searches, mutation frequency, algorithm efficiency, and laboratory activity across the platform."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Searches"      value={data.totals.searches.toLocaleString()} color="cyan" />
          <StatCard label="Mutations Detected"  value={data.totals.mutations}                 color="red" />
          <StatCard label="Unique Patterns"     value={data.totals.patterns}                  color="purple" />
          <StatCard label="Avg Execution (ms)"  value={data.totals.avgTime}                   color="emerald" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Daily Activity</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.daily}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#06b6d4" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f87171" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} labelStyle={{ color: '#f8fafc' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Area type="monotone" dataKey="searches"  stroke="#06b6d4" fill="url(#cyanGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="mutations" stroke="#f87171" fill="url(#redGrad)"  strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Base Composition</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.composition} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {data.composition.map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} labelStyle={{ color: '#f8fafc' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Top Searched Patterns</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.topPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="pattern" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} labelStyle={{ color: '#f8fafc' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 text-white">Algorithm Efficiency</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={data.efficiency}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#475569" />
                <Radar name="Horspool" dataKey="horspool" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
                <Radar name="Naive"    dataKey="naive"    stroke="#f87171" fill="#f87171" fillOpacity={0.3} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 text-white">Recent Search History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4">Pattern</th>
                  <th className="py-3 px-4">DNA Sample</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-right">When</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map(h => (
                  <tr key={h.id} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-mono text-cyan-400">{h.pattern}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{h.dna}</td>
                    <td className="py-3 px-4 text-center text-emerald-400">{h.matches}</td>
                    <td className="py-3 px-4 text-right text-slate-500">{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
