import React from "react";
import {
  Menu,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Keyboard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ShortcutsHelp } from "./ShortcutsHelp";

interface MenuItemProps {
  icon: React.ElementType;
  text: string;
  path: string;
  shortcut: string;
  isActive: boolean;
}

function MenuItem({
  icon: Icon,
  text,
  path,
  shortcut,
  isActive,
}: MenuItemProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors
        ${isActive ? "bg-orange-50 text-orange-600" : ""}`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span className="flex-1 text-left">{text}</span>
      <kbd className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
        {shortcut}
      </kbd>
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const shortcuts = useKeyboardShortcuts({
    f1: {
      handler: () => navigate("/sales"),
      description: "Ir para Vendas",
    },
    f2: {
      handler: () => navigate("/products"),
      description: "Ir para Produtos",
    },
    f3: {
      handler: () => navigate("/reports"),
      description: "Ir para Relatórios",
    },
    f4: {
      handler: () => navigate("/settings"),
      description: "Ir para Configurações",
    },
    "/": {
      handler: () =>
        document
          .querySelector<HTMLInputElement>('input[type="search"]')
          ?.focus(),
      description: "Focar na busca",
    },
    escape: {
      handler: () => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('button[type="button"]');
          closeButton?.click();
        }
      },
      description: "Fechar modal/diálogo",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-orange-500">Bem+ Economia</h1>
        </div>
        <nav className="mt-8">
          <MenuItem
            icon={ShoppingCart}
            text="Vendas"
            path="/sales"
            shortcut="F1"
            isActive={location.pathname === "/sales"}
          />
          <MenuItem
            icon={Package}
            text="Produtos"
            path="/products"
            shortcut="F2"
            isActive={location.pathname === "/products"}
          />
          <MenuItem
            icon={BarChart3}
            text="Relatórios"
            path="/reports"
            shortcut="F3"
            isActive={location.pathname === "/reports"}
          />
          <MenuItem
            icon={Settings}
            text="Configurações"
            path="/settings"
            shortcut="F4"
            isActive={location.pathname === "/settings"}
          />
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="p-4 md:ml-64 md:p-8 pt-16 md:pt-8">{children}</main>

      {/* Atalhos de Teclado */}
      <ShortcutsHelp shortcuts={shortcuts} />
    </div>
  );
}
