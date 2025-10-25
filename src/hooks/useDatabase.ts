import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { Client, Project, Task, Finance, Goal, Resource, Invoice } from '@/types/database';

// Generic hook for Firebase operations
export function useFirebaseData<T>(path: string) {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const userPath = `users/${user.uid}/${path}`;
    const dataRef = ref(database, userPath);
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data).map(([id, item]) => ({
            id,
            ...(item as Omit<T, 'id'>),
          })) as T[];
          setData(dataArray);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [path, user]);

  const add = async (item: Omit<T, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const userPath = `users/${user.uid}/${path}`;
      const newRef = push(ref(database, userPath));
      await set(newRef, {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newRef.key;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const userPath = `users/${user.uid}/${path}`;
      const itemRef = ref(database, `${userPath}/${id}`);
      await update(itemRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const userPath = `users/${user.uid}/${path}`;
      const itemRef = ref(database, `${userPath}/${id}`);
      await remove(itemRef);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  return { data, loading, error, add, updateItem, deleteItem };
}

// Specific hooks for each data type
export function useClients() {
  return useFirebaseData<Client>('clients');
}

export function useProjects() {
  return useFirebaseData<Project>('projects');
}

export function useTasks() {
  return useFirebaseData<Task>('tasks');
}

export function useFinances() {
  return useFirebaseData<Finance>('finances');
}

export function useGoals() {
  return useFirebaseData<Goal>('goals');
}

export function useResources() {
  return useFirebaseData<Resource>('resources');
}

export function useInvoices() {
  return useFirebaseData<Invoice>('invoices');
}
