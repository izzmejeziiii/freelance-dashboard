'use client';

import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-stone-200 p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-600">{title}</p>
          <p className="text-2xl font-bold text-stone-900">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm mt-1',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className="text-stone-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
