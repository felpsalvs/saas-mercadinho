import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { Notifications } from './components/ui/Notifications';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Rotas de autenticação - sem o Layout principal */}
      <Route path="/login" element={
        <ThemeProvider>
          <AuthProvider>
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      } />
      <Route path="/register" element={
        <ThemeProvider>
          <AuthProvider>
            <ProtectedRoute requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      } />

      {/* Rotas protegidas - com o Layout principal */}
      <Route element={
        <ThemeProvider>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </ThemeProvider>
      }>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <div>Em desenvolvimento</div>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <div>Em desenvolvimento</div>
          </ProtectedRoute>
        } />
      </Route>

      {/* Rota para página não encontrada */}
      <Route path="*" element={
        <ThemeProvider>
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="text-center max-w-md">
              <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Página não encontrada
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                A página que você está procurando não existe ou foi movida.
              </p>
              <a 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Voltar para o início
              </a>
            </div>
          </div>
        </ThemeProvider>
      } />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Notifications />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
