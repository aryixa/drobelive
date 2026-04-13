import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { Auth } from './pages/Auth';
import { UpdatePassword } from './pages/UpdatePassword';
import { Dashboard } from './pages/Dashboard';
import { Wardrobe } from './pages/Wardrobe';
import { StylistChat } from './pages/StylistChat';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/stylist" element={<StylistChat />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
