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
        // Cores principais do tema PDV
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
          950: '#001a4d',
        },
        // Cores de fundo para PDV
        background: {
          light: '#f0f2f5', // Cinza claro para fundo
          dark: '#001529',  // Azul escuro profundo
        },
        // Cores de superfície (cards, dropdowns, etc)
        surface: {
          light: '#ffffff',
          dark: '#0d2538',
        },
        // Cores de borda
        border: {
          light: '#d9d9d9',
          dark: '#1f3a4d',
        },
        // Cores de texto
        text: {
          light: {
            primary: '#000000',    // Texto principal - preto para máximo contraste
            secondary: '#262626',   // Texto secundário
            tertiary: '#595959',   // Texto terciário
            disabled: '#bfbfbf',    // Texto desabilitado
          },
          dark: {
            primary: '#ffffff',    // Texto principal - branco para máximo contraste
            secondary: '#e6e6e6',   // Texto secundário
            tertiary: '#a6a6a6',   // Texto terciário
            disabled: '#595959',    // Texto desabilitado
          },
        },
        // Cores para PDV
        pdv: {
          highlight: '#ffcc00', // Amarelo para destaque
          success: '#52c41a',   // Verde para sucesso
          error: '#f5222d',     // Vermelho para erro
          info: '#1890ff',      // Azul para informação
          warning: '#faad14',   // Laranja para aviso
        }
      },
      // Estados de interação
      backgroundColor: {
        hover: {
          light: '#e6f7ff',
          dark: '#1f3a4d',
        },
        active: {
          light: '#bae7ff',
          dark: '#296d98',
        },
        selected: {
          light: '#e6f7ff',
          dark: '#1f3a4d',
        },
      },
      // Sombras
      boxShadow: {
        'sm-light': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm-dark': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        'md-light': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'md-dark': '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'lg-light': '0 4px 6px 0 rgba(0, 0, 0, 0.1)',
        'lg-dark': '0 4px 6px 0 rgba(0, 0, 0, 0.3)',
      },
      // Fontes maiores para PDV
      fontSize: {
        'pdv-xs': '1rem',      // 16px
        'pdv-sm': '1.125rem',  // 18px
        'pdv-base': '1.25rem', // 20px
        'pdv-lg': '1.5rem',    // 24px
        'pdv-xl': '1.75rem',   // 28px
        'pdv-2xl': '2rem',     // 32px
        'pdv-3xl': '2.5rem',   // 40px
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
