import React from 'react';
import { Home, BarChart3, FileText, Users, Settings, HelpCircle, LogOut, Menu, X, Bell, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  userName = 'Admin User',
  userRole = 'SUPER_ADMIN',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">MX</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-slate-900">Metalex</h1>
              <p className="text-xs text-slate-500">Invoice Management</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold flex items-center justify-center hover:shadow-lg transition">
                {userName.charAt(0)}
              </button>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-slate-50 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center gap-3 transition ${
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
