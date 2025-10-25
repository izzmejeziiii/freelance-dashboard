'use client';

import { Client } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Mail, Building } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Lead': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">{client.name}</h3>
          {client.company && (
            <div className="flex items-center text-stone-600 mt-1">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">{client.company}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-md"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {client.contactInfo && (
          <div className="flex items-center text-stone-600">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm">{client.contactInfo}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
            {client.status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(client.paymentStatus)}`}>
            {client.paymentStatus}
          </span>
        </div>

        <div className="text-sm text-stone-600">
          <p>Started: {formatDate(client.startDate)}</p>
          {client.endDate && <p>Ended: {formatDate(client.endDate)}</p>}
        </div>

        {client.notes && (
          <div className="text-sm text-stone-600">
            <p className="line-clamp-2">{client.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
