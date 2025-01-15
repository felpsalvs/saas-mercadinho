import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Bem-vindo ao Mercadinho
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#404040",
                  brandAccent: "#2d2d2d",
                  brandButtonText: "white",
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
                "bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors",
              input:
                "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent",
              label: "block text-sm font-medium text-gray-700",
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
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Cadastrar",
                loading_button_label: "Cadastrando...",
                email_input_placeholder: "seu@email.com",
                password_input_placeholder: "Escolha uma senha",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
