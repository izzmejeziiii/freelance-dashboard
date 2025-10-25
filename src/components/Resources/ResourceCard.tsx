'use client';

import { Resource } from '@/types/database';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
}

export default function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tool': return '🔧';
      case 'Article': return '📄';
      case 'Video': return '🎥';
      default: return '📚';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tool': return 'bg-blue-100 text-blue-800';
      case 'Article': return 'bg-green-100 text-green-800';
      case 'Video': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-2xl">{getTypeIcon(resource.type)}</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-900 mb-1">{resource.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                {resource.type}
              </span>
              {resource.category && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-800">
                  {resource.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(resource)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-md"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* URL Link */}
      <div className="mb-3">
        <a
          href={resource.url}
          onClick={handleLinkClick}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          <span className="truncate">{resource.url}</span>
        </a>
      </div>

      {/* Notes */}
      {resource.notes && (
        <div className="text-sm text-stone-600">
          <p className="line-clamp-3">{resource.notes}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <button
          onClick={handleLinkClick}
          className="w-full flex items-center justify-center px-4 py-2 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition-colors text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Resource
        </button>
      </div>
    </div>
  );
}
