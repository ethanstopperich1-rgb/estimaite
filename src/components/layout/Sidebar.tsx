import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  DollarSign,
  Package,
  Settings,
  LogOut,
  FileText,
  Plus,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Estimates', href: '/projects', icon: FileText },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Pricing Matrix', href: '/pricing', icon: DollarSign, adminOnly: true },
  { name: 'Products', href: '/products', icon: Package, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo & Company Selector */}
        <div className="border-b border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-secondary-900">EstimAIte</span>
              <p className="text-xs text-gray-500">Roofing Estimator</p>
            </div>
          </div>

          {/* Company Selector - CRM style */}
          <button
            onClick={() => setIsCompanyOpen(!isCompanyOpen)}
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="w-8 h-8 bg-secondary-900 rounded-md flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">Roofing Pros USA</p>
              <p className="text-xs text-gray-500">Florida Region</p>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isCompanyOpen && "rotate-180"
            )} />
          </button>
        </div>

        {/* Quick Action */}
        <div className="px-4 py-4">
          <NavLink
            to="/estimate/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Estimate
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </p>
          {navigation.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-3 border-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-800 to-secondary-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {profile?.role || 'viewer'}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
