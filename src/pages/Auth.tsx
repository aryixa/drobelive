import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'http://localhost:5173/update-password',
      });

      if (error) throw error;
      toast.success('Check your email for the reset link!', { duration: 2000 });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast.error(error.message, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in', { duration: 2000 });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          if (error.message.toLowerCase().includes('already')) {
            toast.error('An account with this email already exists. Please sign in instead.', { duration: 2000 });
            setIsLogin(true);
          } else {
            toast.error(error.message, { duration: 2000 });
          }
        } else {
          toast.success('Check your email for confirmation', { duration: 2000 });
          navigate('/auth');
        }
      }
    } catch (error: any) {
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists. Please sign in instead.', { duration: 2000 });
        setIsLogin(true);
      } else {
        toast.error(error.message, { duration: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

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

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-xl shadow-black/[0.02] border border-zinc-100">
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <h2 className="text-2xl font-serif text-zinc-900 text-center mb-6">Reset Password</h2>
            <Input
              label=""
              type="email"
              placeholder="Enter your email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="h-14 bg-zinc-50/50 border-zinc-100 focus:bg-white"
            />
            <Button type="submit" className="w-full h-14 text-lg font-bold mt-4" loading={loading}>
              Send Reset Link
            </Button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-center text-zinc-500 text-sm hover:text-zinc-700 transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <Input
              label=""
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 bg-zinc-50/50 border-zinc-100 focus:bg-white"
            />
            <div className="relative">
              <Input
                label=""
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <Button type="submit" className="w-full h-14 text-lg font-bold mt-4" loading={loading}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        )}

        {!showForgotPassword && (
          <div className="mt-8 text-center text-zinc-500 text-sm space-y-2">
            {isLogin && (
              <button
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(email);
                }}
                className="text-zinc-900 font-medium hover:underline block w-full"
              >
                Forgot your password?
              </button>
            )}
            <p>
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-zinc-900 font-medium hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-zinc-900 font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
