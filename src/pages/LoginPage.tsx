import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeProvider";
import { AuthLayout } from "../components/AuthLayout";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Faça login para continuar"
      footerText="Não tem uma conta?"
      footerLinkText="Criar conta"
      footerLinkUrl="/register"
    >
      <Auth
        supabaseClient={supabase}
        providers={[]}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: theme === "dark" ? "#1890ff" : "#1890ff",
                brandAccent: theme === "dark" ? "#096dd9" : "#096dd9",
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
              "w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out transform hover:translate-y-[-1px]",
            input:
              "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
            label:
              "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
            loader: "border-primary-500",
            anchor:
              "text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors",
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
    </AuthLayout>
  );
}
