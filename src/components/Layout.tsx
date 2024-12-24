import React from 'react';
import { Menu, ShoppingCart, Package, BarChart3, Settings, Keyboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ShortcutsHelp } from './ShortcutsHelp';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const shortcuts = useKeyboardShortcuts({
    'f1': {
      handler: () => navigate('/sales'),
      description: 'Ir para Vendas'
    },
    'f2': {
      handler: () => navigate('/products'),
      description: 'Ir para Produtos'
    },
    'f3': {
      handler: () => navigate('/reports'),
      description: 'Ir para Relatórios'
    },
    'f4': {
      handler: () => navigate('/settings'),
      description: 'Ir para Configurações'
    },
    '/': {
      handler: () => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus(),
      description: 'Focar na busca'
    },
    'escape': {
      handler: () => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('button[type="button"]');
          closeButton?.click();
        }
      },
      description: 'Fechar modal/diálogo'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Market System</h1>
        </div>
        <nav className="mt-8">
          <MenuItem 
            icon={ShoppingCart} 
            text="Vendas" 
            path="/sales"
            shortcut="F1"
            isActive={location.pathname === '/sales'}
          />
          <MenuItem 
            icon={Package} 
            text="Produtos" 
            path="/products"
            shortcut="F2"
            isActive={location.pathname === '/products'}
          />
          <MenuItem 
            icon={BarChart3} 
            text="Relatórios" 
            path="/reports"
            shortcut="F3"
            isActive={location.pathname === '/reports'}
          />
          <MenuItem 
            icon={Settings} 
            text="Configurações" 
            path="/settings"
            shortcut="F4"
            isActive={location.pathname === '/settings'}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>

      {/* Atalhos de Teclado */}
      <ShortcutsHelp shortcuts={shortcuts} />
    </div>
  );
}

interface MenuItemProps {
  icon: React.ElementType;
  text: string;
  path: string;
  shortcut: string;
  isActive: boolean;
}

function MenuItem({ icon: Icon, text, path, shortcut, isActive }: MenuItemProps) {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(path)}
      className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors
        ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span className="flex-1 text-left">{text}</span>
      <kbd className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
        {shortcut}
      </kbd>
    </button>
  );
}