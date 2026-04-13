import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL for recovery tokens first
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    console.log('URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

    const initializeRecoverySession = async () => {
      try {
        // If we have tokens in URL, set the session
        if (accessToken && refreshToken && type === 'recovery') {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session setting error:', error);
            toast.error('Invalid or expired reset link. Please try again.', { duration: 2000 });
            navigate('/auth');
            return;
          }

          console.log('Recovery session set successfully');
        } else {
          // Check if we already have a valid session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (!session || error) {
            console.log('No valid session found:', error);
            toast.error('Invalid or expired reset link. Please try again.', { duration: 2000 });
            navigate('/auth');
            return;
          }
        }
      } catch (error) {
        console.error('Recovery initialization error:', error);
        toast.error('Failed to initialize password recovery. Please try again.', { duration: 2000 });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure auth state changes are processed
    const timer = setTimeout(initializeRecoverySession, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { duration: 2000 });
      setIsUpdating(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long', { duration: 2000 });
      setIsUpdating(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success('Password updated successfully! You can now log in.', { duration: 2000 });
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message, { duration: 2000 });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
        <Toaster position="top-right" />
        <div className="text-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-serif text-4xl mx-auto mb-10 shadow-lg shadow-black/10">
            D
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-zinc-500">Verifying recovery link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
      <Toaster position="top-right" />

      {/* Logo Area */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-serif text-4xl mx-auto mb-10 shadow-lg shadow-black/10">
          D
        </div>
        <h1 className="text-[52px] font-serif text-zinc-900 leading-tight mb-4 tracking-tight">Drobe</h1>
        <p className="text-zinc-400 font-sans text-lg">Your fashion companion</p>
      </div>

      {/* Update Password Card */}
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-xl shadow-black/[0.02] border border-zinc-100">
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <h2 className="text-2xl font-serif text-zinc-900 text-center mb-6">Update Password</h2>
          
          <div className="relative">
            <Input
              label=""
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-14 bg-zinc-50/50 border-zinc-100 focus:bg-white pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label=""
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-14 bg-zinc-50/50 border-zinc-100 focus:bg-white pr-12"
            />
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-bold mt-4" loading={isUpdating}>
            Update Password
          </Button>
        </form>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          <button
            onClick={() => navigate('/auth')}
            className="text-zinc-900 font-medium hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
