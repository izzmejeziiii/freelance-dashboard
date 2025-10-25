'use client';

import Link from 'next/link';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  DollarSign, 
  Target, 
  BookOpen 
} from 'lucide-react';

const quickLinks = [
  { name: 'Clients', href: '/clients', icon: Users, emoji: '🧾' },
  { name: 'Projects', href: '/projects', icon: FolderOpen, emoji: '📁' },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, emoji: '✅' },
  { name: 'Finances', href: '/finances', icon: DollarSign, emoji: '💰' },
  { name: 'Goals', href: '/goals', icon: Target, emoji: '🎯' },
  { name: 'Resources', href: '/resources', icon: BookOpen, emoji: '📚' },
];

export default function QuickLinks() {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Quick Links</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors group"
          >
            <span className="text-2xl mr-3">{link.emoji}</span>
            <div>
              <p className="font-medium text-stone-900 group-hover:text-stone-700">
                {link.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
