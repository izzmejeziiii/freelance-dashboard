'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGoals } from '@/hooks/useDatabase';
import GoalForm from '@/components/Goals/GoalForm';
import GoalCard from '@/components/Goals/GoalCard';
import Loading from '@/components/Loading';
import { Plus, Target, Filter, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'work' | 'personal' | 'financial' | 'active' | 'completed' | 'paused';

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: goals, loading: goalsLoading, deleteItem } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading goals..." />;
  }

  if (!user) {
    return null;
  }

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteItem(goalId);
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const getFilteredGoals = () => {
    switch (filter) {
      case 'work':
        return goals.filter(g => g.category === 'Work');
      case 'personal':
        return goals.filter(g => g.category === 'Personal');
      case 'financial':
        return goals.filter(g => g.category === 'Financial');
      case 'active':
        return goals.filter(g => g.status === 'Active');
      case 'completed':
        return goals.filter(g => g.status === 'Completed');
      case 'paused':
        return goals.filter(g => g.status === 'Paused');
      default:
        return goals;
    }
  };

  const filteredGoals = getFilteredGoals();

  const getStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'Completed').length;
    const active = goals.filter(g => g.status === 'Active').length;
    const averageProgress = total > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total) : 0;
    
    return { total, completed, active, averageProgress };
  };

  const stats = getStats();

  if (goalsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">🎯 Goals</h1>
          <p className="text-stone-600 mt-1">Track your personal and professional goals</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
              <p className="text-sm text-stone-600">Total Goals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.active}</p>
              <p className="text-sm text-stone-600">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.completed}</p>
              <p className="text-sm text-stone-600">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.averageProgress}%</p>
              <p className="text-sm text-stone-600">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Goals by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {goals.filter(g => g.category === 'Work').length}
            </div>
            <div className="text-sm text-blue-800">Work Goals</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {goals.filter(g => g.category === 'Personal').length}
            </div>
            <div className="text-sm text-green-800">Personal Goals</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {goals.filter(g => g.category === 'Financial').length}
            </div>
            <div className="text-sm text-yellow-800">Financial Goals</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <span className="text-sm font-medium text-stone-700">Filter:</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-1 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm"
          >
            <option value="all">All Goals</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="financial">Financial</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <Target className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No goals found</h3>
          <p className="text-stone-600 mb-4">
            {filter === 'all' 
              ? 'Start by setting your first goal'
              : `No goals match the "${filter}" filter`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Set Your First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
