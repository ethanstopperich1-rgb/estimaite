import { FolderKanban, Users, DollarSign, TrendingUp, Plus, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, Badge } from '../components/ui';
import { Header } from '../components/layout';
import { formatCurrency } from '../lib/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
            {change && (
              <p className={`mt-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend === 'up' ? '↑' : '↓'} {change} from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  // Mock data - will be replaced with real data from hooks
  const stats = {
    totalProjects: 24,
    totalCustomers: 156,
    totalRevenue: 485000,
    conversionRate: 68,
  };

  const recentProjects = [
    { id: '1', name: 'Smith Residence', customer: 'John Smith', status: 'proposed', amount: 12500 },
    { id: '2', name: 'Johnson Roof Repair', customer: 'Sarah Johnson', status: 'estimated', amount: 8750 },
    { id: '3', name: 'Williams Re-roof', customer: 'Mike Williams', status: 'accepted', amount: 22000 },
    { id: '4', name: 'Davis Storm Damage', customer: 'Emily Davis', status: 'draft', amount: 0 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="default">Draft</Badge>;
      case 'estimated':
        return <Badge variant="warning">Estimated</Badge>;
      case 'proposed':
        return <Badge variant="info">Proposed</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'declined':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Header
        title="Dashboard"
        description="Overview of your roofing estimation business"
        action={
          <Link to="/projects/new">
            <Button>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value={stats.totalProjects}
          change="12%"
          trend="up"
          icon={FolderKanban}
          color="bg-accent/20 text-accent"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change="8%"
          trend="up"
          icon={Users}
          color="bg-emerald/20 text-emerald"
        />
        <StatCard
          title="Revenue (YTD)"
          value={formatCurrency(stats.totalRevenue)}
          change="24%"
          trend="up"
          icon={DollarSign}
          color="bg-yellow-500/20 text-yellow-400"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="5%"
          trend="up"
          icon={TrendingUp}
          color="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Recent Projects */}
      <Card>
        <div className="px-6 py-4 border-b border-navy-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-accent hover:text-accent-light">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-navy-800">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{project.name}</p>
                  <p className="text-sm text-gray-400">{project.customer}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {project.amount > 0 && (
                  <span className="text-white font-medium">
                    {formatCurrency(project.amount)}
                  </span>
                )}
                {getStatusBadge(project.status)}
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="cursor-pointer">
          <Link to="/projects/new">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <Plus className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-medium text-white">New Project</p>
                <p className="text-sm text-gray-400">Start a new estimate</p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card hover className="cursor-pointer">
          <Link to="/customers">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald/20">
                <Users className="w-6 h-6 text-emerald" />
              </div>
              <div>
                <p className="font-medium text-white">Add Customer</p>
                <p className="text-sm text-gray-400">Create new customer</p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card hover className="cursor-pointer">
          <Link to="/pricing">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-white">Update Pricing</p>
                <p className="text-sm text-gray-400">Manage pricing matrix</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
