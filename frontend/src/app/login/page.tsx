'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { AuthResponse } from '../../types';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post<AuthResponse>('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      
      if (data.role === 'Student') {
        router.push('/dashboard/student');
      } else if (data.role === 'Alumni') {
        router.push('/dashboard/alumni');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Login</h1>
          <p style={{ color: 'var(--text-muted)' }}>Access your professional network.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 71, 71, 0.1)', color: '#ff4747', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(255, 71, 71, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Enterprise Email</label>
            <input 
              type="email" 
              className="btn btn-outline" 
              style={{ width: '100%', textAlign: 'left', padding: '1rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              required 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              className="btn btn-outline" 
              style={{ width: '100%', textAlign: 'left', padding: '1rem' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          New to Reunify? <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
