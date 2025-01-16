import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Bem-vindo ao Mercadinho
          </h2>
          <p className="text-gray-600 text-center mt-2">
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
                  brand: "#404040",
                  brandAccent: "#2d2d2d",
                  brandButtonText: "white",
                  defaultButtonBackground: "#f3f4f6",
                  defaultButtonBackgroundHover: "#e5e7eb",
                  inputBackground: "white",
                  inputBorder: "#e5e7eb",
                  inputText: "#1f2937",
                  inputPlaceholder: "#9ca3af",
                },
                borderWidths: {
                  buttonBorderWidth: "1px",
                  inputBorderWidth: "1px",
                },
                borderRadius: {
                  button: "0.5rem",
                  input: "0.5rem",
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
                "w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out transform hover:translate-y-[-1px]",
              input:
                "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200",
              label: "block text-sm font-medium text-gray-700 mb-1",
              loader: "border-gray-800",
              anchor:
                "text-sm text-gray-600 hover:text-gray-800 transition-colors",
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
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{" "}
            <a
              href="mailto:suporte@mercadinho.com"
              className="text-gray-800 hover:text-gray-900 font-medium"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
