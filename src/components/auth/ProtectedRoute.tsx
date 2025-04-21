import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, profile, loading } = useAuthStore();
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // No user logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If we have a user but no profile yet
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if user role is allowed for this route
  if (!allowedRoles.includes(profile.role)) {
    // Redirect based on role
    if (profile.role === 'vendor') {
      return <Navigate to="/vendor" replace />;
    } else if (profile.role === 'pharmacist') {
      return <Navigate to="/pharmacist" replace />;
    } else if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      // Fallback if role doesn't match any known route
      return <Navigate to="/login" replace />;
    }
  }
  
  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;