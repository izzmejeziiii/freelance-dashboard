'use client';

import { useState } from 'react';
import { Project } from '@/types/database';
import { useProjects } from '@/hooks/useDatabase';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react';

interface KanbanBoardProps {
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const statusColumns = [
  { id: 'To Do', title: 'To Do', color: 'bg-gray-100' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'Done', title: 'Done', color: 'bg-green-100' },
];

export default function KanbanBoard({ onEdit, onDelete }: KanbanBoardProps) {
  const { data: projects, updateItem } = useProjects();
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedProject) return;

    try {
      await updateItem(draggedProject, { status: newStatus as 'To Do' | 'In Progress' | 'Done' });
    } catch (error) {
      console.error('Error updating project status:', error);
    }
    
    setDraggedProject(null);
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'border-gray-200 bg-gray-50';
      case 'In Progress': return 'border-blue-200 bg-blue-50';
      case 'Done': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {statusColumns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={`${column.color} rounded-lg p-4 min-h-[600px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">{column.title}</h3>
              <span className="text-sm text-stone-600 bg-white px-2 py-1 rounded-full">
                {getProjectsByStatus(column.id).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {getProjectsByStatus(column.id).map((project) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, project.id)}
                  className={`bg-white rounded-lg border p-4 cursor-move hover:shadow-md transition-shadow ${getStatusColor(project.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-stone-900 line-clamp-2">
                      {project.name}
                    </h4>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-stone-600">
                    {project.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(project.dueDate)}</span>
                      </div>
                    )}
                    
                    {project.budget > 0 && (
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span>{formatCurrency(project.budget)}</span>
                      </div>
                    )}
                  </div>
                  
                  {project.notes && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      {project.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
