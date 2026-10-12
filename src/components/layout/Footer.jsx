import React from 'react';
import { Cloud, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800 dark:text-slate-200">
              SkyCast Forecast Dashboard
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Services Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-sky-500 transition-colors"
            >
              <span>Data by Open-Meteo</span>
              <ExternalLink size={12} />
            </a>
            <span>•</span>
            <span>Zero API Key Required</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with React, Vite & Tailwind CSS
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <span>v1.0.0 Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
