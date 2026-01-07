import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';
import { SidebarToggle } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { NetworkStatus } from '../network/NetworkStatus';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch('/api/notifications/', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchNotifications();
      // Poll every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarToggle onClick={onMenuClick} />
          <h1 className="text-lg font-semibold hidden sm:block">Agricultural Management System</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-accent rounded-md transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-xl rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-border flex justify-between items-center bg-accent/20">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-border/50 hover:bg-accent/40 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
                      >
                        <p className="text-xs font-medium">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p className="text-xs">No notifications yet</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 text-center border-top border-border">
                    <button className="text-[10px] text-muted-foreground hover:text-primary">View all alerts</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <NetworkStatus />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-accent rounded-md transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
