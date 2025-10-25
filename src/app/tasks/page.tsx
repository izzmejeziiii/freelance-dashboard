'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useDatabase';
import TaskForm from '@/components/Tasks/TaskForm';
import TaskKanban from '@/components/Tasks/TaskKanban';
import Loading from '@/components/Loading';
import { Plus, CheckSquare, Calendar, Filter, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type ViewMode = 'kanban' | 'list' | 'calendar';
type FilterType = 'all' | 'today' | 'overdue' | 'high-priority';

export default function TasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: tasks, loading: tasksLoading, deleteItem } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading tasks..." />;
  }

  if (!user) {
    return null;
  }

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteItem(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getFilteredTasks = () => {
    const today = new Date().toDateString();
    
    switch (filter) {
      case 'today':
        return tasks.filter(task => new Date(task.deadline).toDateString() === today);
      case 'overdue':
        return tasks.filter(task => new Date(task.deadline) < new Date() && task.status !== 'Done');
      case 'high-priority':
        return tasks.filter(task => task.priority === 'High');
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'text-green-600 bg-green-100';
      case 'Doing': return 'text-blue-600 bg-blue-100';
      case 'To Do': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">✅ Tasks</h1>
          <p className="text-stone-600 mt-1">Organize and track your work</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <CheckSquare className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{tasks.length}</p>
              <p className="text-sm text-stone-600">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {tasks.filter(t => t.status === 'To Do').length}
              </p>
              <p className="text-sm text-stone-600">To Do</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {tasks.filter(t => t.status === 'Doing').length}
              </p>
              <p className="text-sm text-stone-600">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {tasks.filter(t => t.status === 'Done').length}
              </p>
              <p className="text-sm text-stone-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              <option value="all">All Tasks</option>
              <option value="today">Today's Tasks</option>
              <option value="overdue">Overdue</option>
              <option value="high-priority">High Priority</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-stone-700">View:</span>
            <div className="flex border border-stone-300 rounded-md">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 text-sm ${viewMode === 'kanban' ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 text-sm ${viewMode === 'calendar' ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <CheckSquare className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No tasks found</h3>
          <p className="text-stone-600 mb-4">
            {filter === 'all' 
              ? 'Start by creating your first task'
              : `No tasks match the "${filter}" filter`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'kanban' && (
            <TaskKanban onEdit={handleEdit} onDelete={handleDelete} />
          )}
          
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-stone-900">
                            {task.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-900">
                          {formatDate(task.deadline)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="text-stone-400 hover:text-stone-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="text-stone-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg border border-stone-200 p-8 text-center">
              <Calendar className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">Calendar View</h3>
              <p className="text-stone-600">Calendar view coming soon!</p>
            </div>
          )}
        </>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
