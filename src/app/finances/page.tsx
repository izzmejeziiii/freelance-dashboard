'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFinances, useClients, useProjects } from '@/hooks/useDatabase';
import FinanceForm from '@/components/Finances/FinanceForm';
import Loading from '@/components/Loading';
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Edit, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'income' | 'expense' | 'this-month' | 'last-month';

export default function FinancesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: finances, loading: financesLoading, deleteItem } = useFinances();
  const { data: clients } = useClients();
  const { data: projects } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const financialStats = useMemo(() => {
    const totalIncome = finances.filter(f => f.type === 'Income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = finances.filter(f => f.type === 'Expense').reduce((sum, f) => sum + f.amount, 0);
    const netIncome = totalIncome - totalExpense;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyIncome = finances
      .filter(f => f.type === 'Income' && new Date(f.date).getMonth() === thisMonth && new Date(f.date).getFullYear() === thisYear)
      .reduce((sum, f) => sum + f.amount, 0);
    const monthlyExpense = finances
      .filter(f => f.type === 'Expense' && new Date(f.date).getMonth() === thisMonth && new Date(f.date).getFullYear() === thisYear)
      .reduce((sum, f) => sum + f.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netIncome,
      monthlyIncome,
      monthlyExpense,
      monthlyNet: monthlyIncome - monthlyExpense
    };
  }, [finances]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading finances..." />;
  }

  if (!user) {
    return null;
  }

  const handleEdit = (finance: any) => {
    setEditingFinance(finance);
    setShowForm(true);
  };

  const handleDelete = async (financeId: string) => {
    if (confirm('Are you sure you want to delete this finance record?')) {
      try {
        await deleteItem(financeId);
      } catch (error) {
        console.error('Error deleting finance record:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFinance(null);
  };

  const getFilteredFinances = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    switch (filter) {
      case 'income':
        return finances.filter(f => f.type === 'Income');
      case 'expense':
        return finances.filter(f => f.type === 'Expense');
      case 'this-month':
        return finances.filter(f => {
          const date = new Date(f.date);
          return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        });
      case 'last-month':
        return finances.filter(f => {
          const date = new Date(f.date);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });
      default:
        return finances;
    }
  };

  const filteredFinances = getFilteredFinances();

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'No Project';
  };

  if (financesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-600">Loading finances...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">💰 Finances</h1>
          <p className="text-stone-600 mt-1">Track your income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{formatCurrency(financialStats.totalIncome)}</p>
              <p className="text-sm text-stone-600">Total Income</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-stone-900">{formatCurrency(financialStats.totalExpense)}</p>
              <p className="text-sm text-stone-600">Total Expenses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-stone-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${financialStats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialStats.netIncome)}
              </p>
              <p className="text-sm text-stone-600">Net Income</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${financialStats.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialStats.monthlyNet)}
              </p>
              <p className="text-sm text-stone-600">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">This Month's Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(financialStats.monthlyIncome)}</p>
            <p className="text-sm text-stone-600">Income</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{formatCurrency(financialStats.monthlyExpense)}</p>
            <p className="text-sm text-stone-600">Expenses</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${financialStats.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(financialStats.monthlyNet)}
            </p>
            <p className="text-sm text-stone-600">Net</p>
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
            <option value="all">All Records</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>
      </div>

      {/* Finance Records */}
      {filteredFinances.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <DollarSign className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No finance records found</h3>
          <p className="text-stone-600 mb-4">
            {filter === 'all' 
              ? 'Start by adding your first income or expense record'
              : `No records match the "${filter}" filter`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Add Your First Record
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredFinances.map((finance) => (
                  <tr key={finance.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {formatDate(finance.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        finance.type === 'Income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {finance.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      {formatCurrency(finance.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {finance.clientId ? getClientName(finance.clientId) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {finance.projectId ? getProjectName(finance.projectId) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-900">
                      {finance.paymentMethod || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(finance)}
                          className="text-stone-400 hover:text-stone-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(finance.id)}
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

      {/* Finance Form Modal */}
      {showForm && (
        <FinanceForm
          finance={editingFinance}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
