import React, { useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon, Menu, ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUserStore, useUIStore } from '../stores';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const { user } = useUserStore();
  const { isLoading } = useUIStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { path: '/sales', label: 'Vendas', icon: ShoppingCart },
    { path: '/products', label: 'Produtos', icon: Package },
    { path: '/reports', label: 'Relatórios', icon: BarChart3 },
    { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  // Backdrop for mobile
  const Backdrop = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsSidebarOpen(false)}
      className="fixed inset-0 bg-black lg:hidden z-40"
    />
  );

  return (
    <div className={cn(
      "min-h-screen flex",
      "bg-background-light dark:bg-background-dark",
      "text-text-light-primary dark:text-text-dark-primary"
    )}>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      <AnimatePresence>
        {isMobile && isSidebarOpen && <Backdrop />}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: -256 } : false}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50",
          "w-64 h-full",
          "bg-surface-light dark:bg-surface-dark",
          "border-r border-border-light dark:border-border-dark",
          "transform lg:transform-none",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 border-b border-border-light dark:border-border-dark"
          >
            <h1 className="text-xl font-bold text-orange-500">Bem+ Economia</h1>
          </motion.div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-hover-light dark:hover:bg-hover-dark",
                      isActive && "bg-primary-500 text-white hover:bg-primary-600",
                      "transform hover:scale-105"
                    )}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 border-t border-border-light dark:border-border-dark"
          >
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center justify-center px-4 py-2 rounded-lg",
                "hover:bg-hover-light dark:hover:bg-hover-dark",
                "transition-all duration-200 transform hover:scale-105"
              )}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "sticky top-0 z-40 h-16",
            "bg-surface-light dark:bg-surface-dark",
            "border-b border-border-light dark:border-border-dark",
            "flex items-center justify-between px-4"
          )}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg",
              "hover:bg-hover-light dark:hover:bg-hover-dark",
              "transition-all duration-200 transform hover:scale-105"
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 p-4"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default Layout;
