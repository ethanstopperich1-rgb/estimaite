import {
  FolderKanban,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  Phone,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, trend, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

// Pipeline Stage Card
function PipelineStage({
  title,
  count,
  amount,
  color,
  items
}: {
  title: string;
  count: number;
  amount: number;
  color: string;
  items: Array<{ id: string; name: string; customer: string; amount: number; daysOld: number }>;
}) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({count})</span>
        </div>
        <span className="text-sm font-medium text-gray-600">{formatCurrency(amount)}</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/estimate/${item.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">{item.name}</h4>
              <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">{item.customer}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.daysOld}d ago
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const stats = {
    totalProjects: 24,
    totalCustomers: 156,
    totalRevenue: 485000,
    conversionRate: 68,
  };

  // Pipeline data - CRM style
  const pipeline = {
    draft: {
      items: [
        { id: '1', name: 'Davis Storm Damage', customer: 'Emily Davis', amount: 15000, daysOld: 1 },
      ],
      total: 15000
    },
    estimated: {
      items: [
        { id: '2', name: 'Johnson Roof Repair', customer: 'Sarah Johnson', amount: 8750, daysOld: 3 },
        { id: '5', name: 'Martinez Re-roof', customer: 'Carlos Martinez', amount: 18500, daysOld: 5 },
      ],
      total: 27250
    },
    proposed: {
      items: [
        { id: '3', name: 'Smith Residence', customer: 'John Smith', amount: 12500, daysOld: 2 },
        { id: '6', name: 'Thompson Estate', customer: 'Linda Thompson', amount: 32000, daysOld: 4 },
      ],
      total: 44500
    },
    accepted: {
      items: [
        { id: '4', name: 'Williams Re-roof', customer: 'Mike Williams', amount: 22000, daysOld: 7 },
      ],
      total: 22000
    },
  };

  const recentActivity = [
    { id: '1', type: 'estimate', message: 'New estimate created for Smith Residence', time: '2 hours ago' },
    { id: '2', type: 'call', message: 'Inbound call from Sarah Johnson', time: '4 hours ago' },
    { id: '3', type: 'accepted', message: 'Williams Re-roof estimate accepted', time: '1 day ago' },
    { id: '4', type: 'scheduled', message: 'Inspection scheduled with Emily Davis', time: '1 day ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'estimate': return <FileText className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <Link
          to="/estimate/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          New Estimate
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Estimates"
          value={stats.totalProjects}
          change="12%"
          trend="up"
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change="8%"
          trend="up"
          icon={Users}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Revenue (YTD)"
          value={formatCurrency(stats.totalRevenue)}
          change="24%"
          trend="up"
          icon={DollarSign}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="5%"
          trend="up"
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Pipeline View - Kanban Style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Estimate Pipeline</h2>
          <Link to="/projects" className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <PipelineStage
            title="Draft"
            count={pipeline.draft.items.length}
            amount={pipeline.draft.total}
            color="bg-gray-400"
            items={pipeline.draft.items}
          />
          <PipelineStage
            title="Estimated"
            count={pipeline.estimated.items.length}
            amount={pipeline.estimated.total}
            color="bg-amber-400"
            items={pipeline.estimated.items}
          />
          <PipelineStage
            title="Proposed"
            count={pipeline.proposed.items.length}
            amount={pipeline.proposed.total}
            color="bg-blue-400"
            items={pipeline.proposed.items}
          />
          <PipelineStage
            title="Accepted"
            count={pipeline.accepted.items.length}
            amount={pipeline.accepted.total}
            color="bg-green-500"
            items={pipeline.accepted.items}
          />
        </div>
      </div>

      {/* Bottom Section - Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/estimate/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Estimate</p>
                <p className="text-xs text-gray-500">Start a new project</p>
              </div>
            </Link>

            <Link
              to="/customers"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Customer</p>
                <p className="text-xs text-gray-500">Create new customer</p>
              </div>
            </Link>

            <Link
              to="/pricing"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Update Pricing</p>
                <p className="text-xs text-gray-500">Manage pricing matrix</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
