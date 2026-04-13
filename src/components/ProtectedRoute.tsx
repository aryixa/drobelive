import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};
