import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Loading weather dashboard">
      {/* Top Banner Skeleton */}
      <div className="w-full h-72 rounded-3xl bg-slate-200 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700/60 rounded-md" />
          </div>
          <div className="h-16 w-16 bg-slate-300 dark:bg-slate-700 rounded-2xl" />
        </div>
        <div className="flex items-baseline gap-6">
          <div className="h-20 w-36 bg-slate-300 dark:bg-slate-700 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700/60 rounded-md" />
          </div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="h-6 w-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="h-7 w-20 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-14 bg-slate-300 dark:bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>

      {/* Interactive Charts & Hourly Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-200 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-6">
          <div className="h-6 w-40 bg-slate-300 dark:bg-slate-700 rounded mb-6" />
          <div className="h-56 w-full bg-slate-300/60 dark:bg-slate-700/40 rounded-xl" />
        </div>
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="h-6 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-300/30 dark:border-slate-700/40">
              <div className="h-4 w-14 bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="h-6 w-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-4 w-12 bg-slate-300 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
