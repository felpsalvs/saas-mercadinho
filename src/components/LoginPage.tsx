import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeProvider";
import { FiMoon, FiSun } from "react-icons/fi";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Alternar tema"
      >
        {theme === "dark" ? (
          <FiSun className="w-6 h-6 text-orange-500" />
        ) : (
          <FiMoon className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div className="max-w-md w-full p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Bem-vindo ao <span className="text-orange-600">Bem+ Economia</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
            Faça login para continuar
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: theme === "dark" ? "#ea580c" : "#404040",
                  brandAccent: theme === "dark" ? "#f97316" : "#2d2d2d",
                  brandButtonText: "white",
                  defaultButtonBackground:
                    theme === "dark" ? "#374151" : "#f3f4f6",
                  defaultButtonBackgroundHover:
                    theme === "dark" ? "#4b5563" : "#e5e7eb",
                  inputBackground: theme === "dark" ? "#374151" : "white",
                  inputBorder: theme === "dark" ? "#4b5563" : "#e5e7eb",
                  inputText: theme === "dark" ? "#f3f4f6" : "#1f2937",
                  inputPlaceholder: theme === "dark" ? "#9ca3af" : "#9ca3af",
                },
                borderWidths: {
                  buttonBorderWidth: "1px",
                  inputBorderWidth: "1px",
                },
                radii: {
                  buttonBorderRadius: "0.5rem",
                  inputBorderRadius: "0.5rem",
                },
                fontSizes: {
                  baseBodySize: "14px",
                  baseInputSize: "14px",
                  baseLabelSize: "14px",
                  baseButtonSize: "14px",
                },
              },
            },
            className: {
              container: "flex flex-col gap-4",
              button:
                "w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out transform hover:translate-y-[-1px]",
              input:
                "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200",
              label:
                "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
              loader: "border-orange-600",
              anchor:
                "text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors",
            },
          }}
          view="sign_in"
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Entrar",
                loading_button_label: "Entrando...",
                email_input_placeholder: "seu@email.com",
                password_input_placeholder: "Sua senha",
              },
            },
          }}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-orange-600 hover:text-orange-500 font-medium"
            >
              Criar conta
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Precisa de ajuda?{" "}
            <a
              href="mailto:suporte@mercadinho.com"
              className="text-orange-600 hover:text-orange-500 font-medium"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
