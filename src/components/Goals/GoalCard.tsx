'use client';

import { Goal } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Calendar, Target } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 text-blue-800';
      case 'Personal': return 'bg-green-100 text-green-800';
      case 'Financial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    if (progress >= 25) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const isOverdue = () => {
    return new Date(goal.targetDate) < new Date() && goal.status !== 'Completed';
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-stone-900 mb-2">{goal.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
              {goal.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
            {isOverdue() && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Overdue
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-md"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-stone-700">Progress</span>
          <span className="text-sm text-stone-600">{goal.progress}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Target Date */}
      <div className="flex items-center text-sm text-stone-600 mb-3">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Target: {formatDate(goal.targetDate)}</span>
      </div>

      {/* Notes */}
      {goal.notes && (
        <div className="text-sm text-stone-600">
          <p className="line-clamp-2">{goal.notes}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-stone-500">
            <Target className="w-4 h-4 mr-1" />
            <span>
              {goal.status === 'Completed' ? 'Completed!' : 
               goal.progress === 0 ? 'Not started' :
               goal.progress < 25 ? 'Getting started' :
               goal.progress < 50 ? 'In progress' :
               goal.progress < 75 ? 'More than halfway' :
               goal.progress < 100 ? 'Almost there!' : 'Completed!'}
            </span>
          </div>
          {goal.status === 'Active' && goal.progress < 100 && (
            <button
              onClick={() => onEdit(goal)}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium"
            >
              Update Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
