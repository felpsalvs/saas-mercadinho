/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores principais do tema
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Cores de fundo
        background: {
          light: '#f8fafc', // Cinza muito claro
          dark: '#0f172a',  // Azul escuro
        },
        // Cores de superfície (cards, dropdowns, etc)
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        // Cores de borda
        border: {
          light: '#e2e8f0',
          dark: '#334155',
        },
        // Cores de texto
        text: {
          light: {
            primary: '#0f172a',    // Texto principal
            secondary: '#475569',   // Texto secundário
            tertiary: '#94a3b8',   // Texto terciário
            disabled: '#cbd5e1',    // Texto desabilitado
          },
          dark: {
            primary: '#f8fafc',    // Texto principal
            secondary: '#cbd5e1',   // Texto secundário
            tertiary: '#64748b',   // Texto terciário
            disabled: '#475569',    // Texto desabilitado
          },
        },
      },
      // Estados de interação
      backgroundColor: {
        hover: {
          light: '#f1f5f9',
          dark: '#334155',
        },
        active: {
          light: '#e2e8f0',
          dark: '#475569',
        },
        selected: {
          light: '#f1f5f9',
          dark: '#334155',
        },
      },
      // Sombras
      boxShadow: {
        'sm-light': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm-dark': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        'md-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26)',
        'lg-light': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
      },
      // Transições
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
        'shadow': 'box-shadow',
        'transform': 'transform',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
