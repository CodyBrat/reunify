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
    <div className="bauhaus-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      {/* Decorative background shapes */}
      <div className="bauhaus-shape" style={{ top: '10%', left: '5%', width: '150px', height: '150px', background: 'var(--primary-red)', transform: 'rotate(15deg)' }} />
      <div className="bauhaus-shape" style={{ bottom: '15%', right: '10%', width: '120px', height: '120px', background: 'var(--primary-blue)', borderRadius: '50%' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
        {/* Architectural Accent Line */}
        <div className="bauhaus-line" style={{ position: 'absolute', top: '-10px', left: '-20px', width: '60px' }} />
        
        <div style={{ border: '6px solid black', background: 'white', boxShadow: '20px 20px 0 black', padding: '4rem' }}>
          <div style={{ marginBottom: '4rem' }}>
            <h1 className="heading-display" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>LOGIN</h1>
            <p className="label-caps" style={{ color: 'var(--primary-blue)', fontWeight: 900 }}>WELCOME BACK TO REUNIFY</p>
          </div>

          {error && (
            <div style={{ border: '3px solid black', background: 'var(--primary-red)', color: 'white', padding: '1rem', marginBottom: '2.5rem', fontWeight: 900, fontSize: '0.8rem' }}>
              ⚠ ERROR: {error.toUpperCase()}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@university.edu"
                required 
                style={{ border: '3px solid black', padding: '1.2rem', fontWeight: 700 }}
              />
            </div>
            
            <div>
              <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                style={{ border: '3px solid black', padding: '1.2rem', fontWeight: 700 }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN →'}
            </button>
          </form>

          <div style={{ marginTop: '3.5rem', borderTop: '3px solid black', paddingTop: '2rem', textAlign: 'center' }}>
            <p className="label-caps" style={{ marginBottom: '1rem' }}>No Account Detected?</p>
            <Link href="/register" style={{ 
              display: 'block', padding: '1rem', border: '3px solid black', 
              color: 'black', fontWeight: 900, textDecoration: 'none', 
              background: 'var(--primary-yellow)', boxShadow: '6px 6px 0 black' 
            }}>
              REGISTER NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
