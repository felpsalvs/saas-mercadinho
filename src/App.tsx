import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { ProductGrid } from "./components/sales/ProductGrid";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
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
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
              <Route
                path="/products"
                element={<ProtectedRoute><Products /></ProtectedRoute>}
              />
              {/* <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} /> */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Página não encontrada</h1>
                  </div>
                }
              />
              <Route path="/reports" element={<div>Em desenvolvimento</div>} />
              <Route path="/settings" element={<div>Em desenvolvimento</div>} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
