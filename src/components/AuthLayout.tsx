import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkUrl: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkUrl,
}: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - Banner/Imagem */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 text-white">
        <div className="flex flex-col justify-center items-center p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <h1 className="text-4xl font-bold mb-6">Bem+ Economia</h1>
            <p className="text-xl mb-8">
              Sistema completo para gestão de PDV e controle de estoque para seu negócio
            </p>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Vendas Rápidas</h3>
                <p>Interface otimizada para agilidade no atendimento</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Controle Total</h3>
                <p>Gerencie estoque, vendas e relatórios em um só lugar</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
                <p>Interface intuitiva e atalhos de teclado para maior produtividade</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Relatórios</h3>
                <p>Dados e métricas para tomar as melhores decisões</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-background-light dark:bg-background-dark">
        <button
          onClick={toggleTheme}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full",
            "bg-surface-light dark:bg-surface-dark",
            "border border-border-light dark:border-border-dark",
            "hover:bg-hover-light dark:hover:bg-hover-dark",
            "transition-all duration-200"
          )}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <FiSun className="w-6 h-6 text-pdv-warning" />
          ) : (
            <FiMoon className="w-6 h-6 text-primary-500" />
          )}
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-full max-w-md p-8 rounded-xl",
            "bg-surface-light dark:bg-surface-dark",
            "border border-border-light dark:border-border-dark",
            "shadow-lg-light dark:shadow-lg-dark"
          )}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
              {title}
            </h2>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="mt-6 text-center">
            <p className="text-sm text-text-light-tertiary dark:text-text-dark-tertiary">
              {footerText}{' '}
              <Link
                to={footerLinkUrl}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                {footerLinkText}
              </Link>
            </p>
            <p className="text-sm text-text-light-tertiary dark:text-text-dark-tertiary mt-4">
              Precisa de ajuda?{' '}
              <a
                href="mailto:suporte@bemeconomia.com.br"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Entre em contato
              </a>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-text-light-tertiary dark:text-text-dark-tertiary">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Bem+ Economia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
} 