'use client';

import { useAuth } from '@/hooks/useAuth';
import { useClients, useProjects, useTasks, useFinances, useGoals } from '@/hooks/useDatabase';
import StatsCard from '@/components/Dashboard/StatsCard';
import ProgressBar from '@/components/Dashboard/ProgressBar';
import QuickLinks from '@/components/Dashboard/QuickLinks';
import Loading from '@/components/Loading';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  DollarSign, 
  Target,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: clients } = useClients();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();
  const { data: finances } = useFinances();
  const { data: goals } = useGoals();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (!user) {
    return null;
  }

  // Calculate statistics
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const activeProjects = projects.filter(p => p.status !== 'Done').length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;
  const monthlyIncome = finances
    .filter(f => f.type === 'Income' && new Date(f.date).getMonth() === new Date().getMonth())
    .reduce((sum, f) => sum + f.amount, 0);
  const completedGoals = goals.filter(g => g.status === 'Completed').length;

  // Get today's tasks
  const today = new Date().toDateString();
  const todaysTasks = tasks.filter(t => new Date(t.deadline).toDateString() === today);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Freelancer OS</h1>
        <p className="text-lg text-stone-600">
          Manage your clients, tasks, and finances in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Clients"
          value={activeClients}
          icon={<Users className="w-8 h-8" />}
        />
        <StatsCard
          title="Active Projects"
          value={activeProjects}
          icon={<FolderOpen className="w-8 h-8" />}
        />
        <StatsCard
          title="Completed Tasks"
          value={`${completedTasks}/${totalTasks}`}
          icon={<CheckSquare className="w-8 h-8" />}
        />
        <StatsCard
          title="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          icon={<DollarSign className="w-8 h-8" />}
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Progress */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Task Progress
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label="Overall Completion"
              value={completedTasks}
              max={totalTasks}
            />
            <ProgressBar
              label="High Priority Tasks"
              value={tasks.filter(t => t.priority === 'High' && t.status === 'Done').length}
              max={tasks.filter(t => t.priority === 'High').length}
            />
            <ProgressBar
              label="This Week's Tasks"
              value={tasks.filter(t => {
                const taskDate = new Date(t.deadline);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return taskDate >= weekStart && taskDate <= weekEnd && t.status === 'Done';
              }).length}
              max={tasks.filter(t => {
                const taskDate = new Date(t.deadline);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return taskDate >= weekStart && taskDate <= weekEnd;
              }).length}
            />
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Goals Progress
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label="Completed Goals"
              value={completedGoals}
              max={goals.length}
            />
            <ProgressBar
              label="Work Goals"
              value={goals.filter(g => g.category === 'Work' && g.status === 'Completed').length}
              max={goals.filter(g => g.category === 'Work').length}
            />
            <ProgressBar
              label="Financial Goals"
              value={goals.filter(g => g.category === 'Financial' && g.status === 'Completed').length}
              max={goals.filter(g => g.category === 'Financial').length}
            />
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Today's Focus
        </h3>
        {todaysTasks.length > 0 ? (
          <div className="space-y-2">
            {todaysTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div>
                  <p className="font-medium text-stone-900">{task.name}</p>
                  <p className="text-sm text-stone-600">
                    Priority: <span className={`font-medium ${
                      task.priority === 'High' ? 'text-red-600' :
                      task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{task.priority}</span>
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === 'Done' ? 'bg-green-100 text-green-800' :
                  task.status === 'Doing' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 text-center py-8">No tasks scheduled for today. Great job! 🎉</p>
        )}
      </div>

      {/* Quick Links */}
      <QuickLinks />
    </div>
  );
}