'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { AuthResponse } from '../../types';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<'Student' | 'Alumni'>('Student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific
  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  // Alumni specific
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = role === 'Student' ? '/auth/register/student' : '/auth/register/alumni';
      const payload = role === 'Student' 
        ? { name, email, password, university, course, graduationYear: parseInt(graduationYear) }
        : { name, email, password, company, designation, experienceYears: parseInt(experienceYears) };

      const data = await api.post<AuthResponse>(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', data.name || name);
      
      if (role === 'Student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/alumni');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Join the Network</h1>
          <p style={{ color: 'var(--text-muted)' }}>Empowering students and alumni together.</p>
        </div>

        <div style={{ display: 'flex', background: 'var(--surface)', padding: '0.4rem', borderRadius: '30px', marginBottom: '2.5rem', border: '1px solid var(--surface-border)' }}>
          <button 
            type="button"
            onClick={() => setRole('Student')}
            style={{ 
              flex: 1, padding: '0.8rem', borderRadius: '25px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
              background: role === 'Student' ? 'var(--accent)' : 'transparent',
              color: role === 'Student' ? 'white' : 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('Alumni')}
            style={{ 
               flex: 1, padding: '0.8rem', borderRadius: '25px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
               background: role === 'Alumni' ? 'var(--accent)' : 'transparent',
               color: role === 'Alumni' ? 'white' : 'var(--text-muted)',
               fontWeight: 600
            }}
          >
            Alumni
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 71, 71, 0.1)', color: '#ff4747', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(255, 71, 71, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Full Name</label>
             <input type="text" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Email Adress</label>
             <input type="email" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Secure Password</label>
             <input type="password" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {role === 'Student' ? (
            <>
              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>University / College</label>
                 <input type="text" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={university} onChange={e => setUniversity(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Course / Specialization</label>
                 <input type="text" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={course} onChange={e => setCourse(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Graduation Year</label>
                 <input type="number" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={graduationYear} onChange={e => setGraduationYear(e.target.value)} required />
              </div>
            </>
          ) : (
            <>
              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Current Company</label>
                 <input type="text" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={company} onChange={e => setCompany(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Designation</label>
                 <input type="text" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={designation} onChange={e => setDesignation(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>Experience (Years)</label>
                 <input type="number" className="btn btn-outline" style={{ width: '100%', textAlign: 'left', padding: '1rem' }} value={experienceYears} onChange={e => setExperienceYears(e.target.value)} required />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '1.5rem', padding: '1rem' }} disabled={loading}>
            {loading ? 'Creating Identity...' : 'Register as ' + role}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Already part of the network? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Log in here</Link>
        </div>
      </div>
    </div>
  );
}
