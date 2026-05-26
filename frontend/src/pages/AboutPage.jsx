import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui';

const STEPS = [
  { n: 1, title: 'Build Shift Table',  desc: 'Precompute character shifts using the bad-character heuristic from the pattern.' },
  { n: 2, title: 'Align Right-to-Left', desc: 'Align the pattern to the text and compare characters from right to left.' },
  { n: 3, title: 'Smart Shift',         desc: 'On mismatch, use the shift table to skip multiple characters at once.' },
  { n: 4, title: 'Record Matches',      desc: 'When all characters match, record the position and continue searching.' },
];

const APPS = [
  { icon: '🧬', title: 'Genetic Disease Detection', desc: 'Locate disease-marker genes such as BRCA1/BRCA2, TP53, CFTR, and HTT in patient samples.' },
  { icon: '💊', title: 'Drug Target Discovery',     desc: 'Identify conserved binding motifs and target regions for pharmaceutical research.' },
  { icon: '🦠', title: 'Pathogen Identification',   desc: 'Rapidly screen viral and bacterial sequences to identify infection-causing organisms.' },
  { icon: '🌾', title: 'Crop Genomics',             desc: 'Trace beneficial alleles for yield, disease resistance, and stress tolerance.' },
  { icon: '🔬', title: 'Cancer Research',           desc: 'Detect mutations and structural variants associated with various tumor types.' },
  { icon: '🧪', title: 'Forensic Analysis',         desc: 'Match DNA samples against reference databases for criminal and identity investigations.' },
];

const STACK = [
  { name: 'React 18',      color: 'text-cyan-400' },
  { name: 'Vite 5',        color: 'text-purple-400' },
  { name: 'Tailwind CSS',  color: 'text-cyan-400' },
  { name: 'Framer Motion', color: 'text-purple-400' },
  { name: 'Recharts',      color: 'text-emerald-400' },
  { name: 'Node.js',       color: 'text-emerald-400' },
  { name: 'Express',       color: 'text-yellow-400' },
  { name: 'MongoDB Atlas', color: 'text-green-400' },
  { name: 'JWT Auth',      color: 'text-red-400' },
];

const AboutPage = () => (
  <div className="pt-28 pb-20 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionTitle
        eyebrow="The Science"
        title="About GeneTrace"
        subtitle="A research-grade platform that brings the Horspool string-matching algorithm to bioinformatics — built to demonstrate Design and Analysis of Algorithms in a real-world setting."
      />

      {/* DNA basics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-3xl p-10 mb-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-white">What is DNA?</h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          Deoxyribonucleic acid (DNA) is the molecule that carries the genetic instructions for every living
          organism. It is composed of four nucleotide bases — <span className="text-emerald-400 font-semibold">Adenine (A)</span>,{' '}
          <span className="text-red-400 font-semibold">Thymine (T)</span>,{' '}
          <span className="text-yellow-400 font-semibold">Guanine (G)</span> and{' '}
          <span className="text-blue-400 font-semibold">Cytosine (C)</span> — that pair across two complementary
          strands twisted into the famous double helix.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: 'A', n: 'Adenine',  bg: 'bg-emerald-500/10', br: 'border-emerald-500/30', tx: 'text-emerald-400' },
            { l: 'T', n: 'Thymine',  bg: 'bg-red-500/10',     br: 'border-red-500/30',     tx: 'text-red-400' },
            { l: 'G', n: 'Guanine',  bg: 'bg-yellow-500/10',  br: 'border-yellow-500/30',  tx: 'text-yellow-400' },
            { l: 'C', n: 'Cytosine', bg: 'bg-blue-500/10',    br: 'border-blue-500/30',    tx: 'text-blue-400' },
          ].map(b => (
            <div key={b.l} className={`${b.bg} border ${b.br} rounded-2xl p-6 text-center`}>
              <div className={`text-5xl font-bold ${b.tx} mb-2 font-mono`}>{b.l}</div>
              <div className="text-slate-300 font-medium">{b.n}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Horspool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-3xl p-10 mb-10"
      >
        <h2 className="text-3xl font-bold mb-4 text-white">The Horspool Algorithm</h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          The <span className="text-cyan-400 font-semibold">Horspool string-matching algorithm</span> is a
          simplified variant of the Boyer-Moore algorithm developed by R. Nigel Horspool in 1980. It uses a
          precomputed shift table and right-to-left comparison to skip large portions of the text on mismatch,
          giving it an average-case complexity of <span className="font-mono text-cyan-400">O(n/m)</span> compared
          to <span className="font-mono text-red-400">O(n·m)</span> for the naive approach — a critical advantage
          when scanning long genomic sequences.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(s => (
            <div key={s.n} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold mb-3">{s.n}</div>
              <div className="text-white font-semibold mb-2">{s.title}</div>
              <div className="text-slate-400 text-sm">{s.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Real-World Applications</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:border-cyan-500/40 transition-colors"
            >
              <div className="text-4xl mb-3">{a.icon}</div>
              <div className="text-white font-semibold mb-2">{a.title}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-3xl p-10 text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-white">Built With</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {STACK.map(t => (
            <span key={t.name} className={`px-4 py-2 rounded-full bg-slate-900/70 border border-slate-700 font-mono text-sm ${t.color}`}>
              {t.name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default AboutPage;
