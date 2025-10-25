'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  className?: string;
}

export default function ProgressBar({ label, value, max, className }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="text-stone-500">{value}/{max} ({percentage}%)</span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-2">
        <div
          className="bg-stone-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
