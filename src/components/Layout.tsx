import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon, Menu, ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { path: '/sales', label: 'Vendas', icon: ShoppingCart },
    { path: '/products', label: 'Produtos', icon: Package },
    { path: '/reports', label: 'Relatórios', icon: BarChart3 },
    { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className={cn(
      "min-h-screen flex",
      "bg-background-light dark:bg-background-dark",
      "text-text-light-primary dark:text-text-dark-primary"
    )}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50",
          "w-64 transform transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0",
          "bg-surface-light dark:bg-surface-dark",
          "border-r border-border-light dark:border-border-dark"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <h1 className="text-xl font-bold">Market SaaS</h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg transition-colors",
                    "hover:bg-hover-light dark:hover:bg-hover-dark",
                    isActive && "bg-primary-500 text-white hover:bg-primary-600"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-border-light dark:border-border-dark">
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center justify-center px-4 py-2 rounded-lg",
                "hover:bg-hover-light dark:hover:bg-hover-dark",
                "transition-colors"
              )}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className={cn(
          "sticky top-0 z-40 h-16",
          "bg-surface-light dark:bg-surface-dark",
          "border-b border-border-light dark:border-border-dark",
          "flex items-center justify-between px-4"
        )}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg",
              "hover:bg-hover-light dark:hover:bg-hover-dark",
              "transition-colors"
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
