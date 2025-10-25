'use client';

import { useState } from 'react';
import { Task } from '@/types/database';
import { useTasks, useProjects } from '@/hooks/useDatabase';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface TaskKanbanProps {
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const statusColumns = [
  { id: 'To Do', title: 'To Do', color: 'bg-gray-100' },
  { id: 'Doing', title: 'Doing', color: 'bg-blue-100' },
  { id: 'Done', title: 'Done', color: 'bg-green-100' },
];

export default function TaskKanban({ onEdit, onDelete }: TaskKanbanProps) {
  const { data: tasks, updateItem } = useTasks();
  const { data: projects } = useProjects();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      await updateItem(draggedTask, { status: newStatus as 'To Do' | 'Doing' | 'Done' });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
    
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-red-200 bg-red-50';
      case 'Medium': return 'border-yellow-200 bg-yellow-50';
      case 'Low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'High') {
      return <AlertCircle className="w-3 h-3 text-red-600" />;
    }
    return null;
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'No Project';
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
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`bg-white rounded-lg border p-4 cursor-move hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start space-x-2 flex-1">
                      {getPriorityIcon(task.priority)}
                      <h4 className="font-medium text-stone-900 line-clamp-2 flex-1">
                        {task.name}
                      </h4>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-stone-600">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-stone-100 px-2 py-1 rounded">
                        {task.priority}
                      </span>
                      {isOverdue(task.deadline) && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className={isOverdue(task.deadline) ? 'text-red-600' : ''}>
                        {formatDate(task.deadline)}
                      </span>
                    </div>
                    
                    {task.projectId && (
                      <div className="text-xs text-stone-500">
                        Project: {getProjectName(task.projectId)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
