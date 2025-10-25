'use client';

import { useState } from 'react';
import { Resource } from '@/types/database';
import { useResources } from '@/hooks/useDatabase';

interface ResourceFormProps {
  resource?: Resource;
  onClose: () => void;
}

export default function ResourceForm({ resource, onClose }: ResourceFormProps) {
  const { add, updateItem } = useResources();
  const [formData, setFormData] = useState({
    name: resource?.name || '',
    type: resource?.type || 'Tool' as const,
    url: resource?.url || '',
    notes: resource?.notes || '',
    category: resource?.category || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (resource) {
        await updateItem(resource.id, formData);
      } else {
        await add(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tool': return '🔧';
      case 'Article': return '📄';
      case 'Video': return '🎥';
      default: return '📚';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">
          {resource ? 'Edit Resource' : 'Add New Resource'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Resource Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="e.g., Figma, React Documentation, YouTube Tutorial"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="Tool">🔧 Tool</option>
                <option value="Article">📄 Article</option>
                <option value="Video">🎥 Video</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                placeholder="e.g., Design, Development, Marketing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="https://example.com"
            />
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
              placeholder="Description, usage tips, or why this resource is useful..."
            />
          </div>

          {/* Preview */}
          <div className="bg-stone-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-stone-700 mb-2">Preview:</h4>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTypeIcon(formData.type)}</span>
              <div className="flex-1">
                <div className="font-medium text-stone-900">
                  {formData.name || 'Resource Name'}
                </div>
                <div className="text-sm text-stone-600">
                  {formData.type} {formData.category && `• ${formData.category}`}
                </div>
                {formData.url && (
                  <div className="text-xs text-blue-600 truncate">
                    {formData.url}
                  </div>
                )}
              </div>
            </div>
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
              {resource ? 'Update' : 'Add'} Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
