import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  MessageSquare,
  Bug,
  FlaskConical,
  DollarSign,
  CloudRain,
  User,
  LogOut,
  Users,
  Menu,
  X,
  Sparkles,
  Store,
  Activity,
  Shield,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = user?.role === 'admin'
    ? [
      { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'User Management', path: '/admin/users' },
      { icon: Activity, label: 'System Logs', path: '/admin/logs' },
    ]
    : [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Sprout, label: 'Farm Management', path: '/farm' },
      { icon: TrendingUp, label: 'Yield Prediction', path: '/yield' },
      { icon: MessageSquare, label: 'Crop Advisory', path: '/advisory' },
      { icon: Bug, label: 'Pest Detection', path: '/pest' },
      { icon: Sparkles, label: 'Crop Recommendation', path: '/crop/recommendation' },
      { icon: Store, label: 'Market Prices', path: '/market' },
      { icon: CloudRain, label: 'Weather Alerts', path: '/weather' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-primary" />
              <span className="font-semibold">AgriPredict</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-accent rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-3 p-3 bg-accent rounded-md">
              <p className="text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 hover:bg-accent rounded-md transition-all"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}