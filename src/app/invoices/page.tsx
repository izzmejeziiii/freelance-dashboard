'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInvoices, useClients } from '@/hooks/useDatabase';
import InvoiceForm from '@/components/Invoices/InvoiceForm';
import InvoicePreview from '@/components/Invoices/InvoicePreview';
import Loading from '@/components/Loading';
import { Plus, FileText, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

export default function InvoicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: invoices, loading: invoicesLoading, deleteItem } = useInvoices();
  const { data: clients } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading invoices..." />;
  }

  if (!user) {
    return null;
  }

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = async (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteItem(invoiceId);
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
  };

  const getFilteredInvoices = () => {
    switch (filter) {
      case 'draft':
        return invoices.filter(i => i.status === 'Draft');
      case 'sent':
        return invoices.filter(i => i.status === 'Sent');
      case 'paid':
        return invoices.filter(i => i.status === 'Paid');
      case 'overdue':
        return invoices.filter(i => i.status === 'Overdue');
      default:
        return invoices;
    }
  };

  const filteredInvoices = getFilteredInvoices();

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (invoicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">📄 Invoices</h1>
          <p className="text-stone-600 mt-1">Create and manage your invoices</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-stone-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{invoices.length}</p>
              <p className="text-sm text-stone-600">Total Invoices</p>
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
                {invoices.filter(i => i.status === 'Draft').length}
              </p>
              <p className="text-sm text-stone-600">Draft</p>
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
                {invoices.filter(i => i.status === 'Sent').length}
              </p>
              <p className="text-sm text-stone-600">Sent</p>
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
                {invoices.filter(i => i.status === 'Paid').length}
              </p>
              <p className="text-sm text-stone-600">Paid</p>
            </div>
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
            <option value="all">All Invoices</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <FileText className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No invoices found</h3>
          <p className="text-stone-600 mb-4">
            {filter === 'all' 
              ? 'Start by creating your first invoice'
              : `No invoices match the "${filter}" filter`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Create Your First Invoice
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {getClientName(invoice.clientId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setPreviewInvoice(invoice)}
                          className="text-stone-400 hover:text-stone-600"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-stone-400 hover:text-stone-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-stone-400 hover:text-red-600"
                          title="Delete"
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

      {/* Invoice Form Modal */}
      {showForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onClose={handleCloseForm}
        />
      )}

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-stone-900">Invoice Preview</h2>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <InvoicePreview invoice={previewInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
