import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
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
                  <h1 className="text-2xl font-bold">Página não encontrada</h1>
                </div>
              }
            />
            <Route path="/reports" element={<div>Em desenvolvimento</div>} />
            <Route path="/settings" element={<div>Em desenvolvimento</div>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
