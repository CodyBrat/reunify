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
    <div className="bauhaus-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
      
      {/* Decorative background shapes */}
      <div className="bauhaus-shape" style={{ top: '5%', right: '5%', width: '200px', height: '200px', background: 'var(--primary-yellow)', transform: 'rotate(-10deg)' }} />
      <div className="bauhaus-shape" style={{ bottom: '10%', left: '8%', width: '150px', height: '150px', border: '10px solid var(--primary-blue)' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '700px' }}>
        {/* Architectural Accent Line */}
        <div className="bauhaus-line" style={{ position: 'absolute', top: '-15px', right: '-30px', width: '100px' }} />
        
        <div style={{ border: '6px solid black', background: 'white', boxShadow: '25px 25px 0 black', padding: '4rem' }}>
          <div style={{ marginBottom: '4rem' }}>
            <h1 className="heading-display" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>REGISTER</h1>
            <p className="label-caps" style={{ color: 'var(--primary-red)', fontWeight: 900 }}>CREATE YOUR REUNIFY PROFILE</p>
          </div>

          {/* Role Toggle Bauhaus Style */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
            {(['Student', 'Alumni'] as const).map(r => (
              <button 
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{ 
                  flex: 1, padding: '1.2rem', border: '4px solid black', cursor: 'pointer',
                  background: role === r ? 'black' : 'white',
                  color: role === r ? 'white' : 'black',
                  fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
                  boxShadow: role === r ? 'none' : '6px 6px 0 black',
                  transform: role === r ? 'translate(4px, 4px)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {r === 'Student' ? 'STUDENT' : 'ALUMNI'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ border: '3px solid black', background: 'var(--primary-red)', color: 'white', padding: '1rem', marginBottom: '3rem', fontWeight: 900, fontSize: '0.8rem' }}>
              ⚠ ERROR: {error.toUpperCase()}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ENTER FULL NAME" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
            </div>
            
            <div>
              <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@univ.edu" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
            </div>
            
            <div>
              <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
            </div>

            {role === 'Student' ? (
              <>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>University Name</label>
                  <input type="text" value={university} onChange={e => setUniversity(e.target.value)} placeholder="UNIVERSITY NAME" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Course / Specialization</label>
                  <input type="text" value={course} onChange={e => setCourse(e.target.value)} placeholder="E.G. COMPUTER SCIENCE" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Graduation Year</label>
                  <input type="number" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} placeholder="202X" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
                </div>
              </>
            ) : (
              <>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Current Company</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="CURRENT ORGANIZATION" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Job Designation</label>
                  <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} placeholder="ROLE TITLE" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Experience (Years)</label>
                  <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} placeholder="YEARS" required style={{ border: '3px solid black', padding: '1rem', fontWeight: 700 }} />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '1.5rem', marginTop: '1rem', background: 'black', color: 'white' }} disabled={loading}>
              {loading ? 'REGISTERING...' : 'REGISTER →'}
            </button>
          </form>

          <div style={{ marginTop: '4rem', borderTop: '3px solid black', paddingTop: '2.5rem', textAlign: 'center' }}>
             <p className="label-caps" style={{ marginBottom: '1.2rem' }}>Already Registered?</p>
             <Link href="/login" style={{ 
               display: 'inline-block', padding: '1rem 3rem', border: '3px solid black', 
               color: 'white', fontWeight: 900, textDecoration: 'none', 
               background: 'var(--primary-blue)', boxShadow: '6px 6px 0 black' 
             }}>
               LOGIN NOW
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
