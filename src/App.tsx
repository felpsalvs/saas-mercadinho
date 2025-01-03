import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Sales from './pages/Sales';
import Products from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/sales" replace />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reports" element={<div>Em desenvolvimento</div>} />
          <Route path="/settings" element={<div>Em desenvolvimento</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;