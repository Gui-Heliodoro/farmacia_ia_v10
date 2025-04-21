import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Pages
import Login from './pages/Login';
import VendorHome from './pages/VendorHome';
import PharmacistHome from './pages/PharmacistHome';
import AdminHome from './pages/AdminHome';
import StockPage from './pages/StockPage';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';

// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute';
import { supabase } from './lib/supabase';

function App() {
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          clearUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/vendor" replace />} />
          
          <Route path="vendor" element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <VendorHome />
            </ProtectedRoute>
          } />
          
          <Route path="pharmacist" element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacistHome />
            </ProtectedRoute>
          } />
          
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          } />
          
          <Route path="stock" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StockPage />
            </ProtectedRoute>
          } />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;