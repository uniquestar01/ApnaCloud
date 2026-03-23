import React from 'react';

export const FileSkeleton = () => (
  <div className="bg-white/40 dark:bg-slate-800/40 rounded-[2.5rem] p-8 border border-white/20 dark:border-white/5 animate-pulse">
    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-[2rem] mx-auto mb-6" />
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 mx-auto mb-2" />
    <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded-full w-1/2 mx-auto" />
  </div>
);

export const DashboardSkeleton = () => (
    <div className="space-y-12 animate-pulse overflow-hidden">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[3rem] w-full" />
    </div>
);
