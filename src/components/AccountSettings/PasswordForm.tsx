'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Lock, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordForm() {
  const { updateUserPassword } = useAuth();
  const { showToast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Only update password if new password is provided
      if (data.newPassword && data.newPassword.trim() !== '') {
        if (data.newPassword !== data.confirmPassword) {
          setError('New passwords do not match');
          return;
        }

        await updateUserPassword(data.newPassword);
        setSuccess('Password updated successfully!');
        showToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your password has been updated successfully!'
        });
        reset();
      } else {
        showToast({
          type: 'info',
          title: 'No Changes',
          message: 'No password changes were made'
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'An error occurred while updating your password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-6">Change Password</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
          <span className="text-green-700 dark:text-green-300 text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword')}
              className="w-full pl-10 pr-12 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:bg-stone-800 dark:text-white"
              placeholder="Enter your current password (optional)"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword', { 
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              className="w-full pl-10 pr-12 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:bg-stone-800 dark:text-white"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', { 
                validate: (value) => {
                  if (!value && !newPassword) return true; // Both empty is OK
                  if (!value && newPassword) return 'Please confirm your new password';
                  if (value !== newPassword) return 'Passwords do not match';
                  return true;
                }
              })}
              className="w-full pl-10 pr-12 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:bg-stone-800 dark:text-white"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
