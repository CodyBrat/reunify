'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('userName');
    if (storedRole !== role) {
      setTimeout(() => setRole(storedRole), 0);
    }
    if (storedName !== userName) {
      setTimeout(() => setUserName(storedName), 0);
    }
  }, [pathname, role, userName]);

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  
  if (isAuthPage) return null;

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <nav style={{ 
      position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px', 
      background: '#ffffff',
      borderRight: '4px solid #121212',
      padding: '2.5rem 2rem',
      display: 'flex', flexDirection: 'column', zIndex: 100
    }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '3.5rem', textTransform: 'uppercase', letterSpacing: '-0.03em', borderBottom: '4px solid #121212', paddingBottom: '1.5rem' }}>
        Reunify<span style={{ color: 'var(--primary-red)' }}>.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        <Link 
          href={role === 'Student' ? '/dashboard/student' : '/dashboard/alumni'} 
          className={`btn ${pathname.includes('dashboard') ? 'btn-primary' : 'btn-outline'}`} 
          style={{ justifyContent: 'flex-start' }}
        >
           🏠 My Workspace
        </Link>
        <Link 
          href="/mentorship" 
          className={`btn ${pathname === '/mentorship' ? 'btn-primary' : 'btn-outline'}`} 
          style={{ justifyContent: 'flex-start' }}
        >
           🤝 Mentorship
        </Link>
        <Link href="/posts" className={`btn ${pathname === '/posts' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
           💬 Community Feed
        </Link>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', border: '2px solid #121212', background: 'var(--primary-yellow)', fontSize: '0.8rem', color: '#121212' }}>
           Logged in as <br />
           <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>{userName || role || 'User'}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--primary-red)', borderColor: 'var(--primary-red)', boxShadow: '4px 4px 0px 0px var(--primary-red)' }}>
          LOGOUT
        </button>
      </div>
    </nav>
  );
}
