import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon, Menu, ShoppingCart, Package, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUserStore, useUIStore } from '../stores';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './ui/KeyboardShortcutsHelp';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const { user, logout } = useUserStore();
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
    { path: '/sales', label: 'Vendas (F2)', icon: ShoppingCart, shortcut: 'F2' },
    { path: '/products', label: 'Produtos (F3)', icon: Package, shortcut: 'F3' },
    { path: '/reports', label: 'Relatórios (F4)', icon: BarChart3, shortcut: 'F4' },
    { path: '/settings', label: 'Configurações (F5)', icon: Settings, shortcut: 'F5' },
  ];

  // Configuração dos atalhos de teclado
  const shortcuts = {
    'F1': {
      handler: () => setIsShortcutsHelpOpen(true),
      description: 'Exibir ajuda de atalhos',
    },
    'F2': {
      handler: () => navigate('/sales'),
      description: 'Ir para Vendas',
    },
    'F3': {
      handler: () => navigate('/products'),
      description: 'Ir para Produtos',
    },
    'F4': {
      handler: () => navigate('/reports'),
      description: 'Ir para Relatórios',
    },
    'F5': {
      handler: () => navigate('/settings'),
      description: 'Ir para Configurações',
    },
    'ESCAPE': {
      handler: () => setIsShortcutsHelpOpen(false),
      description: 'Fechar janelas/diálogos',
    },
    'SHIFT+T': {
      handler: () => toggleTheme(),
      description: 'Alternar tema claro/escuro',
    },
    'SHIFT+L': {
      handler: () => logout(),
      description: 'Sair do sistema',
    },
    '?': {
      handler: () => setIsShortcutsHelpOpen(true),
      description: 'Exibir ajuda de atalhos',
    },
  };

  const { getShortcutsList } = useKeyboardShortcuts(shortcuts);

  // Backdrop para mobile
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
            <h1 className="text-pdv-xl font-bold text-primary-600 dark:text-primary-400">Bem+ Economia</h1>
          </motion.div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
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
                      "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-hover-light dark:hover:bg-hover-dark",
                      isActive 
                        ? "bg-primary-500 text-white hover:bg-primary-600" 
                        : "border border-border-light dark:border-border-dark",
                      "transform hover:scale-105"
                    )}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <Icon className="h-6 w-6 mr-3" />
                    <span className="text-pdv-base font-medium">{item.label}</span>
                    <kbd className={cn(
                      "ml-auto px-2 py-1 text-pdv-xs rounded",
                      isActive 
                        ? "bg-primary-600 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                      "border border-gray-300 dark:border-gray-600"
                    )}>
                      {item.shortcut}
                    </kbd>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Ações do Rodapé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 border-t border-border-light dark:border-border-dark space-y-2"
          >
            {/* Ajuda */}
            <button
              onClick={() => setIsShortcutsHelpOpen(true)}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg",
                "hover:bg-hover-light dark:hover:bg-hover-dark",
                "border border-border-light dark:border-border-dark",
                "transition-all duration-200 transform hover:scale-105"
              )}
            >
              <HelpCircle className="h-6 w-6 mr-3 text-pdv-highlight" />
              <span className="text-pdv-base font-medium">Ajuda (F1)</span>
            </button>

            {/* Alternar Tema */}
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg",
                "hover:bg-hover-light dark:hover:bg-hover-dark",
                "border border-border-light dark:border-border-dark",
                "transition-all duration-200 transform hover:scale-105"
              )}
            >
              {theme === 'dark' 
                ? <Sun className="h-6 w-6 mr-3 text-pdv-warning" /> 
                : <Moon className="h-6 w-6 mr-3 text-primary-500" />
              }
              <span className="text-pdv-base font-medium">
                Tema {theme === 'dark' ? 'Claro' : 'Escuro'} (Shift+T)
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg",
                "hover:bg-hover-light dark:hover:bg-hover-dark",
                "border border-border-light dark:border-border-dark",
                "transition-all duration-200 transform hover:scale-105"
              )}
            >
              <LogOut className="h-6 w-6 mr-3 text-pdv-error" />
              <span className="text-pdv-base font-medium">Sair (Shift+L)</span>
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
            <Menu className="h-6 w-6" />
          </button>

          {/* Informações do usuário */}
          <div className="flex items-center ml-auto">
            <div className="text-right mr-4">
              <p className="text-pdv-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                {user?.email}
              </p>
              <p className="text-pdv-xs text-text-light-secondary dark:text-text-dark-secondary">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-pdv-base font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
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

        {/* Status Bar */}
        <div className={cn(
          "h-8 px-4 text-pdv-xs",
          "bg-surface-light dark:bg-surface-dark",
          "border-t border-border-light dark:border-border-dark",
          "flex items-center justify-between"
        )}>
          <div className="flex items-center space-x-4">
            <span>F1: Ajuda</span>
            <span>F2: Vendas</span>
            <span>F3: Produtos</span>
            <span>F4: Relatórios</span>
          </div>
          <div>
            <span>Versão 1.0.0</span>
          </div>
        </div>
      </main>

      {/* Ajuda de Atalhos de Teclado */}
      <KeyboardShortcutsHelp 
        shortcuts={getShortcutsList()}
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
    </div>
  );
}

export default Layout;
