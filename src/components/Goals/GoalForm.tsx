'use client';

import { useState } from 'react';
import { Goal } from '@/types/database';
import { useGoals } from '@/hooks/useDatabase';

interface GoalFormProps {
  goal?: Goal;
  onClose: () => void;
}

export default function GoalForm({ goal, onClose }: GoalFormProps) {
  const { add, updateItem } = useGoals();
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    category: goal?.category || 'Work' as const,
    progress: goal?.progress || 0,
    targetDate: goal?.targetDate || new Date().toISOString().split('T')[0],
    status: goal?.status || 'Active' as const,
    notes: goal?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (goal) {
        await updateItem(goal.id, formData);
      } else {
        await add(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          {goal ? 'Edit Goal' : 'Add New Goal'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="e.g., Launch new website, Save ₱50,000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Financial">Financial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
              <div className="mt-2">
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div
                    className="bg-stone-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${formData.progress}%` }}
                  />
                </div>
                <div className="text-xs text-stone-500 mt-1">{formData.progress}% complete</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="Additional details, milestones, or action items..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 border border-stone-300 rounded-md hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800"
            >
              {goal ? 'Update' : 'Add'} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
