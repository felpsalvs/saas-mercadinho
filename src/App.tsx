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
    <Route element={
      <ThemeProvider>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ThemeProvider>
    }>
      <Route path="/login" element={
        <ProtectedRoute requireAuth={false}>
          <LoginPage />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute requireAuth={false}>
          <RegisterPage />
        </ProtectedRoute>
      } />
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
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Página não encontrada
          </h1>
        </div>
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
