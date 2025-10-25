'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/Auth/AuthForm';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { user, userProfile, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      // Redirect based on user status
      if (userProfile?.isNewUser) {
        router.push('/account');
      } else {
        router.push('/');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode={mode} onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')} />
    </div>
  );
}
