import { useState, useEffect } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  updatePassword,
  updateEmail,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
// Removed Firebase Storage imports - using Cloudinary instead
import { auth, googleProvider, database } from '@/lib/firebase';
import { uploadToCloudinary } from '@/lib/cloudinary';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  theme: 'light' | 'dark';
  isNewUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // Fetch user profile from database
        const profileRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        } else {
          // Create new user profile
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || null,
            theme: 'light',
            isNewUser: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await set(profileRef, newProfile);
          setUserProfile(newProfile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    return user;
  };

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  };

  const signInWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    return user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    const profileRef = ref(database, `users/${user.uid}`);
    
    // Filter out undefined values to prevent Firebase errors
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    const updatedProfile: UserProfile = {
      ...userProfile,
      ...cleanUpdates,
      updatedAt: new Date().toISOString(),
    };
    
    await set(profileRef, updatedProfile);
    setUserProfile(updatedProfile);
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!user) return;
    await updatePassword(user, newPassword);
  };

  const updateUserEmail = async (newEmail: string) => {
    if (!user) return;
    await updateEmail(user, newEmail);
  };

  const uploadProfilePhoto = async (file: File) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      console.log('Starting photo upload for user:', user.uid);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      console.log('Uploading to Cloudinary...');
      const photoURL = await uploadToCloudinary(file);
      console.log('Cloudinary upload completed, URL:', photoURL);
      
      console.log('Updating Firebase Auth profile...');
      await updateProfile(user, { photoURL });
      console.log('Firebase Auth profile updated');
      
      console.log('Updating database profile...');
      await updateUserProfile({ photoURL });
      console.log('Database profile updated');
      
      return photoURL;
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const deleteUserAccount = async (password: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user data from database
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, null);
      
      // Delete the user account from Firebase Auth
      await deleteUser(user);
      
      // Clear local state
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please sign in again before deleting your account');
      }
      throw new Error(error.message || 'Failed to delete account');
    }
  };

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    uploadProfilePhoto,
    resetPassword,
    deleteUserAccount,
  };
}
