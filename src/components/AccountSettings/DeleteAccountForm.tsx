'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface DeleteAccountFormData {
  confirmText: string;
  password: string;
}

export default function DeleteAccountForm() {
  const { user, deleteUserAccount } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DeleteAccountFormData>();

  const confirmText = watch('confirmText');

  const onSubmit = async (data: DeleteAccountFormData) => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setLoading(true);

    try {
      await deleteUserAccount(data.password);
      showToast({
        type: 'success',
        title: 'Account Deleted',
        message: 'Your account has been permanently deleted.'
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Failed to delete account. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelDeletion = () => {
    setShowConfirmation(false);
    reset();
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-lg border border-red-200 dark:border-red-800 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white">Delete Account</h3>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Permanently delete your account and all associated data
          </p>
        </div>
      </div>

      {!showConfirmation ? (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-medium mb-2">Warning: This action cannot be undone</p>
                <ul className="space-y-1 text-xs">
                  <li>• All your data will be permanently deleted</li>
                  <li>• Your clients, projects, tasks, and finances will be lost</li>
                  <li>• You will be logged out immediately</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmation(true)}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            I understand, delete my account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-medium mb-2">Final confirmation required</p>
                <p>Please confirm your password and type "DELETE" to permanently delete your account.</p>
              </div>
            </div>
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required to delete account'
                })}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-stone-800 dark:text-white"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmation Text */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              {...register('confirmText', {
                required: 'Please type "DELETE" to confirm',
                validate: (value) => value === 'DELETE' || 'Please type "DELETE" exactly as shown'
              })}
              className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-stone-800 dark:text-white"
              placeholder="Type DELETE"
            />
            {errors.confirmText && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmText.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={cancelDeletion}
              className="flex-1 px-4 py-3 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || confirmText !== 'DELETE'}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
