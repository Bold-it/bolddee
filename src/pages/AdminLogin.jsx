import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess }) => {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('bolddee_admin_session', 'authenticated');
      if (data.token) {
        localStorage.setItem('bolddee_admin_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('bolddee_admin_user', JSON.stringify(data.user));
      }

      if (onLoginSuccess) onLoginSuccess();
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#051a10] relative">
      <div className="glass-panel w-full max-w-md p-8 border border-emerald-800/60 shadow-2xl relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-300/80 hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
            INTERNAL
          </span>
        </div>

        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="BOLDDEE RENTALS"
            className="h-16 w-auto mx-auto mb-4 object-contain"
          />
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Management Portal</h1>
          <p className="text-xs text-emerald-300/80 mt-1">
            Enter the authorized admin master key to manage equipment, sashes, and orders.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-emerald-200 mb-1.5">
              Admin Secret Key
            </label>
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="e.g. bolddee2026"
              className="w-full px-4 py-3 rounded-lg bg-[#072416] border border-emerald-800/80 text-white placeholder-emerald-400/40 text-sm focus:border-amber-400 focus:outline-none transition-colors"
            />
            <span className="text-[11px] text-emerald-400/60 block mt-1">
              Hint: Default password is <strong className="text-amber-400">bolddee2026</strong> or <strong className="text-amber-400">admin</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold text-base py-3 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-emerald-900/60 text-center text-xs text-emerald-400/60 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Restricted to Bold-Services & Bull-Dee Management</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
