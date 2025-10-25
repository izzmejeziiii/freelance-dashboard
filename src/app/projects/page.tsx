'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useDatabase';
import { Project } from '@/types/database';
import ProjectForm from '@/components/Projects/ProjectForm';
import KanbanBoard from '@/components/Projects/KanbanBoard';
import Loading from '@/components/Loading';
import { Plus, FolderOpen, Calendar, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type ViewMode = 'kanban' | 'list' | 'calendar';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: projects, loading: projectsLoading, deleteItem } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading projects..." />;
  }

  if (!user) {
    return null;
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteItem(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">📁 Projects</h1>
          <p className="text-stone-600 mt-1">Manage your project pipeline</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <FolderOpen className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{projects.length}</p>
              <p className="text-sm text-stone-600">Total Projects</p>
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
                {projects.filter(p => p.status === 'To Do').length}
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
                {projects.filter(p => p.status === 'In Progress').length}
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
                {projects.filter(p => p.status === 'Done').length}
              </p>
              <p className="text-sm text-stone-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <div className="flex justify-between items-center">
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
          
          <div className="text-sm text-stone-600">
            Total Budget: {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
          </div>
        </div>
      </div>

      {/* Projects Content */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No projects yet</h3>
          <p className="text-stone-600 mb-4">Start by creating your first project</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'kanban' && (
            <KanbanBoard onEdit={handleEdit} onDelete={handleDelete} />
          )}
          
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-stone-900">
                              {project.name}
                            </div>
                            {project.notes && (
                              <div className="text-sm text-stone-500 line-clamp-1">
                                {project.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === 'Done' ? 'bg-green-100 text-green-800' :
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-900">
                          {project.dueDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-900">
                          {formatCurrency(project.budget)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-stone-400 hover:text-stone-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
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

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject || undefined}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
