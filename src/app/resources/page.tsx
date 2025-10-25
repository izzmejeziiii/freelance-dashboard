'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useResources } from '@/hooks/useDatabase';
import ResourceForm from '@/components/Resources/ResourceForm';
import ResourceCard from '@/components/Resources/ResourceCard';
import Loading from '@/components/Loading';
import { Plus, BookOpen, Search, Filter, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'tool' | 'article' | 'video';
type ViewMode = 'grid' | 'list';

export default function ResourcesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: resources, loading: resourcesLoading, deleteItem } = useResources();
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading resources..." />;
  }

  if (!user) {
    return null;
  }

  const handleEdit = (resource: any) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDelete = async (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteItem(resourceId);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const getFilteredResources = () => {
    let filtered = resources;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.type.toLowerCase() === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();

  const getStats = () => {
    const total = resources.length;
    const tools = resources.filter(r => r.type === 'Tool').length;
    const articles = resources.filter(r => r.type === 'Article').length;
    const videos = resources.filter(r => r.type === 'Video').length;
    
    return { total, tools, articles, videos };
  };

  const stats = getStats();

  const getCategories = () => {
    const categories = [...new Set(resources.map(r => r.category).filter(Boolean))];
    return categories.sort();
  };

  if (resourcesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">📚 Resources</h1>
          <p className="text-stone-600 mt-1">Your personal library of helpful tools and links</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
              <p className="text-sm text-stone-600">Total Resources</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg">🔧</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.tools}</p>
              <p className="text-sm text-stone-600">Tools</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg">📄</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.articles}</p>
              <p className="text-sm text-stone-600">Articles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg">🎥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.videos}</p>
              <p className="text-sm text-stone-600">Videos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {getCategories().length > 0 && (
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {getCategories().map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <span className="text-sm font-medium text-stone-700">Filter:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="tool">🔧 Tools</option>
              <option value="article">📄 Articles</option>
              <option value="video">🎥 Videos</option>
            </select>

            <div className="flex border border-stone-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid/List */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No resources found</h3>
          <p className="text-stone-600 mb-4">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start building your resource library'
            }
          </p>
          {!searchTerm && filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Add Your First Resource
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Resource Form Modal */}
      {showForm && (
        <ResourceForm
          resource={editingResource}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
