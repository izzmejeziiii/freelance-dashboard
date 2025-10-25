'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { User, Mail, Camera, Save, AlertCircle } from 'lucide-react';

interface ProfileFormData {
  displayName: string;
  email: string;
}

export default function ProfileForm() {
  const { userProfile, updateUserProfile, updateUserEmail, uploadProfilePhoto } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: userProfile?.displayName || '',
      email: userProfile?.email || '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Update timed out. Please try again.');
      showToast({
        type: 'error',
        title: 'Update Timeout',
        message: 'The update took too long. Please try again.'
      });
    }, 30000); // 30 second timeout

    try {
      let hasChanges = false;

      // Update display name if provided and different
      if (data.displayName && data.displayName.trim() !== '' && data.displayName !== userProfile?.displayName) {
        await updateUserProfile({ displayName: data.displayName.trim() });
        hasChanges = true;
      }

      // Update email if provided, valid, and different
      if (data.email && data.email.trim() !== '' && data.email !== userProfile?.email) {
        await updateUserEmail(data.email.trim());
        hasChanges = true;
      }

      // Upload profile photo if a new file is selected
      if (selectedFile) {
        try {
          await uploadProfilePhoto(selectedFile);
          setSelectedFile(null);
          setPreviewImage(null);
          hasChanges = true;
        } catch {
          throw new Error('Failed to upload profile photo. Please try again.');
        }
      }

      if (hasChanges) {
        setSuccess('Profile updated successfully!');
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully!'
        });
      } else {
        showToast({
          type: 'info',
          title: 'No Changes',
          message: 'No changes were made to your profile'
        });
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred');
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: (err as Error).message || 'An error occurred while updating your profile'
      });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      showToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select an image smaller than 5MB'
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      showToast({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select a valid image file'
      });
      return;
    }

    // Store the selected file and show preview
    setSelectedFile(file);
    setError('');

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-6">Profile Information</h3>

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
        {/* Profile Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : userProfile?.photoURL && userProfile.photoURL !== null ? (
                <Image
                  src={userProfile.photoURL}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-stone-500" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full flex items-center justify-center hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-stone-900 dark:text-white">Profile Photo</h4>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {previewImage ? 'New photo selected. Click "Save Changes" to upload.' : 'Click the camera icon to upload a new photo'}
            </p>
            {previewImage && (
              <button
                type="button"
                onClick={clearSelectedImage}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Remove selected image
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              {...register('displayName', { 
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:bg-stone-800 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>
          {errors.displayName && (
            <p className="text-red-600 text-sm mt-1">{errors.displayName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="email"
              {...register('email', { 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 dark:bg-stone-800 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : selectedFile ? 'Save Changes & Upload Photo' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
