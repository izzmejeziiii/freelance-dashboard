'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  Target, 
  BookOpen,
  Settings,
  LogOut,
  Sun,
  Moon,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Finances', href: '/finances', icon: DollarSign },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Resources', href: '/resources', icon: BookOpen },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Don't render layout for auth pages
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-stone-200 dark:border-stone-700">
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">Freelancer OS</h1>
          </div>
          
          {/* User Info */}
          <div className="px-4 py-4 border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center overflow-hidden">
                {userProfile?.photoURL && userProfile.photoURL !== null ? (
                  <img
                    src={userProfile.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-stone-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 dark:text-white truncate">
                  {userProfile?.displayName || 'User'}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {userProfile?.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 py-4 border-t border-stone-200 dark:border-stone-700 space-y-2">
            <Link
              href="/account"
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === '/account'
                  ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
              )}
            >
              <Settings className="w-5 h-5 mr-3" />
              Account Settings
            </Link>
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 mr-3" />
              ) : (
                <Sun className="w-5 h-5 mr-3" />
              )}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
