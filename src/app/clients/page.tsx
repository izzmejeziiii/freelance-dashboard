'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useDatabase';
import ClientCard from '@/components/Clients/ClientCard';
import ClientForm from '@/components/Clients/ClientForm';
import Loading from '@/components/Loading';
import { Plus, Users, Grid, List, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Client } from '@/types/database';

type ViewMode = 'grid' | 'list' | 'board';

export default function ClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: clients, loading: clientsLoading, deleteItem } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading clients..." />;
  }

  if (!user) {
    return null;
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteItem(clientId);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  if (clientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">🧾 Clients</h1>
          <p className="text-stone-600 mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
            >
              <option value="all">All Status</option>
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{clients.length}</p>
              <p className="text-sm text-stone-600">Total Clients</p>
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
                {clients.filter(c => c.status === 'Active').length}
              </p>
              <p className="text-sm text-stone-600">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {clients.filter(c => c.status === 'Lead').length}
              </p>
              <p className="text-sm text-stone-600">Leads</p>
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
                {clients.filter(c => c.status === 'Completed').length}
              </p>
              <p className="text-sm text-stone-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <Users className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No clients found</h3>
          <p className="text-stone-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first client'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Add Your First Client
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          client={editingClient || undefined}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
