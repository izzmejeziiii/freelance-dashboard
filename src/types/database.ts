export interface Client {
  id: string;
  name: string;
  company: string;
  contactInfo: string;
  status: 'Active' | 'Completed' | 'Lead';
  startDate: string;
  endDate?: string;
  notes: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  budget: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  name: string;
  projectId: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'Doing' | 'Done';
  createdAt: string;
  updatedAt: string;
}

export interface Finance {
  id: string;
  date: string;
  clientId: string;
  projectId: string;
  type: 'Income' | 'Expense';
  amount: number;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  category: 'Work' | 'Personal' | 'Financial';
  progress: number; // 0-100
  targetDate: string;
  status: 'Active' | 'Completed' | 'Paused';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'Tool' | 'Article' | 'Video';
  url: string;
  notes: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
