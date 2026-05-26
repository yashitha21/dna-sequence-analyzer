import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './ui.jsx';

const LINKS = [
  ['/', 'Home'],
  ['/search', 'DNA Search'],
  ['/visualize', 'Visualizer'],
  ['/mutation', 'Mutation'],
  ['/analytics', 'Analytics'],
  ['/about', 'About'],
];

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/"><Logo /></Link>

        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map(([path, label]) => (
            <Link key={path} to={path}
              className={`nav-link text-sm font-medium hover:text-cyan-400 ${pathname === path ? 'active' : 'text-slate-300'}`}>
              {label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Hi, {user.name}</span>
              <button onClick={onLogout}
                className="text-sm px-4 py-1.5 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 transition">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary text-sm px-5 py-2 rounded-full font-medium text-white">
              Sign In
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-slate-300 p-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-slate-800/60 px-4 py-4 space-y-2">
          {LINKS.map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={`block w-full text-left py-2 px-3 rounded-lg ${pathname === path ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'}`}>
              {label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { onLogout(); setOpen(false); }}
              className="block w-full text-left py-2 px-3 text-rose-400">Logout</button>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}
              className="block w-full text-left py-2 px-3 text-cyan-400">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
