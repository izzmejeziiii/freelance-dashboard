'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-12 h-12 text-stone-600 dark:text-stone-400 animate-spin mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white mb-2">
          {message}
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Please wait while we set things up for you...
        </p>
      </div>
    </div>
  );
}
