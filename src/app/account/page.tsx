'use client';

import { useAuth } from '@/hooks/useAuth';
import ProfileForm from '@/components/AccountSettings/ProfileForm';
import PasswordForm from '@/components/AccountSettings/PasswordForm';
import ThemeSettings from '@/components/AccountSettings/ThemeSettings';
import DeleteAccountForm from '@/components/AccountSettings/DeleteAccountForm';
import Image from 'next/image';
import { User, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600 dark:text-stone-400">Loading account settings...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Account Settings</h1>
            <p className="text-stone-600 dark:text-stone-400 mt-1">Manage your account preferences</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center overflow-hidden">
            {userProfile?.photoURL && userProfile.photoURL !== null ? (
              <Image
                src={userProfile.photoURL}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-stone-500" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
              {userProfile?.displayName || 'User'}
            </h2>
            <p className="text-stone-600 dark:text-stone-400">{userProfile?.email}</p>
            <div className="flex items-center mt-2">
              <Settings className="w-4 h-4 text-stone-400 mr-1" />
              <span className="text-sm text-stone-500 dark:text-stone-400">
                Member since {new Date(userProfile?.createdAt || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm />
        <PasswordForm />
      </div>

      <ThemeSettings />

      {/* Danger Zone */}
      <DeleteAccountForm />
    </div>
  );
}
