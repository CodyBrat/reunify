'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    (async () => {
      setMounted(true);
      const token = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role') || '';
      setIsAuthenticated(!!token);
      setRole(savedRole);
    })();
  }, []);

  // Use this to render server-consistent HTML initially
  const isAuth = mounted && isAuthenticated;
  const userRole = mounted ? role : '';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', overflow: 'hidden' }}>
      
      {/* --- NAVIGATION --- */}
      <nav style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--border-thick) solid black', background: 'white' }}>
        <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.05em' }}>
          REUNIFY<span style={{ color: 'var(--primary-blue)' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/posts" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'black', textDecoration: 'none' }}>Community</Link>
          <Link href="/mentorship" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'black', textDecoration: 'none' }}>Mentors</Link>
          {isAuth ? (
            <Link href={userRole === 'Student' ? '/dashboard/student' : '/dashboard/alumni'} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Workspace</Link>
          ) : (
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>Login</Link>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', padding: '10rem 3rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        
        {/* Geometric Background Decorations */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'var(--primary-yellow)', borderRadius: '50%', border: '4px solid black', zIndex: 0, opacity: 0.8 }}></div>
        <div style={{ position: 'absolute', bottom: '20%', left: '40%', width: '150px', height: '150px', background: 'var(--primary-red)', border: '4px solid black', zIndex: 0, opacity: 0.8 }}></div>
        <div style={{ position: 'absolute', top: '40%', right: '35%', width: '100px', height: '100px', background: 'var(--primary-blue)', border: '4px solid black', transform: 'rotate(15deg)', zIndex: 0, opacity: 0.8 }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="heading-display" style={{ marginBottom: '2rem' }}>
            BRIDGE THE<br />
            <span style={{ color: 'var(--primary-blue)' }}>NETWORK</span> GAP.
          </h1>
          <p style={{ fontSize: '1.4rem', maxWidth: '600px', color: 'var(--text-main)', fontWeight: 500, marginBottom: '3rem', lineHeight: 1.4 }}>
            The exclusive professional ecosystem where university students and high-tier alumni collaborate, innovate, and refer.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {isAuth ? (
               <Link href={userRole === 'Student' ? '/dashboard/student' : '/dashboard/alumni'} className="btn btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>Enter Dashboard</Link>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>Join Now</Link>
                <Link href="/posts" className="btn btn-outline" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>Read Feed</Link>
              </>
            )}
          </div>
        </div>

        <div className="animate-fade-in delay-2" style={{ position: 'relative', zIndex: 1 }}>
          <div className="glass-card" style={{ padding: '4rem', transform: 'rotate(-2deg)' }}>
             <div style={{ marginBottom: '2rem' }}>
                <span className="label-caps" style={{ color: 'var(--primary-red)' }}>Active Success</span>
                <h2 className="heading-section" style={{ fontSize: '3.5rem' }}>1,240+</h2>
                <p style={{ fontWeight: 700 }}>Direct alumni referrals this month.</p>
             </div>
             <hr style={{ border: '2px solid black', marginBottom: '2rem' }} />
             <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'black' }}></div>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary-blue)' }}></div>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary-yellow)' }}></div>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary-red)' }}></div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section style={{ padding: '10rem 3rem', background: 'white', borderTop: 'var(--border-thick) solid black' }}>
        <h2 className="heading-section" style={{ textAlign: 'center', marginBottom: '6rem', fontSize: '3.5rem' }}>THE ARCHITECTURE OF SUCCESS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ width: '80px', height: '80px', background: 'var(--primary-yellow)', border: '4px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>★</div>
             <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>MENTORSHIP</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Connect 1-on-1 with industry veterans who graduated from your own campus. Bridge theory and reality.</p>
             <Link href="/mentorship" style={{ fontWeight: 900, color: 'var(--primary-blue)', textDecoration: 'none', borderBottom: '2px solid' }}>BROWSE MENTORS →</Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ width: '80px', height: '80px', background: 'var(--primary-blue)', border: '4px solid black' }}></div>
             <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>REFERRALS</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Skip the ATS. Get direct referrals from alumni working at Google, Microsoft, and top startups globally.</p>
             <Link href="/login" style={{ fontWeight: 900, color: 'var(--primary-blue)', textDecoration: 'none', borderBottom: '2px solid' }}>GET REFERRED →</Link>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ width: '0', height: '0', borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '80px solid var(--primary-red)', filter: 'drop-shadow(4px 4px 0px black)' }}></div>
             <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>COMMUNITY</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Participate in deep-dive discussions about salary negotiation, interview prep, and career pivots.</p>
             <Link href="/posts" style={{ fontWeight: 900, color: 'var(--primary-blue)', textDecoration: 'none', borderBottom: '2px solid' }}>JOIN DISCUSSION →</Link>
          </div>

        </div>
      </section>

      {/* --- STAT TICKER --- */}
      <section style={{ padding: '4rem 0', background: 'black', color: 'white', display: 'flex', gap: '6rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.2em' }}>REUNIFY NETWORK</span>
            <span style={{ width: '20px', height: '20px', background: 'var(--primary-red)' }}></span>
            <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.2em' }}>ALUMNI POWER</span>
            <span style={{ width: '20px', height: '20px', background: 'var(--primary-yellow)', borderRadius: '50%' }}></span>
          </div>
        ))}
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '12rem 3rem', textAlign: 'center', background: 'var(--bg-color)' }}>
         <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem', background: 'white' }}>
            <h2 className="heading-display" style={{ fontSize: '4rem', marginBottom: '2rem' }}>READY TO<br /><span style={{ color: 'var(--primary-red)' }}>RECONNECT?</span></h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>Whether you are giving back or moving up, Reunify is where the network lives.</p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
               <Link href="/register" className="btn btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.1rem' }}>Create Account</Link>
               <Link href="/login" className="btn btn-outline" style={{ padding: '1.5rem 4rem', fontSize: '1.1rem' }}>Sign In</Link>
            </div>
         </div>
      </section>

      <footer style={{ padding: '4rem 3rem', borderTop: 'var(--border-thick) solid black', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
         <div>
            <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '1rem' }}>REUNIFY<span style={{ color: 'var(--primary-red)' }}>.</span></h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&copy; 2026. The Bauhaus Alumni Project.<br />All rights reserved.</p>
         </div>
         <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
               <p className="label-caps" style={{ marginBottom: '1rem' }}>Network</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 700, fontSize: '0.8rem' }}>
                  <Link href="/posts" style={{ color: 'black', textDecoration: 'none' }}>COMMUNITY</Link>
                  <Link href="/mentorship" style={{ color: 'black', textDecoration: 'none' }}>MENTORS</Link>
                  <Link href="/login" style={{ color: 'black', textDecoration: 'none' }}>JOBS</Link>
               </div>
            </div>
            <div>
               <p className="label-caps" style={{ marginBottom: '1rem' }}>Social</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 700, fontSize: '0.8rem' }}>
                  <span style={{ cursor: 'pointer' }}>LINKEDIN</span>
                  <span style={{ cursor: 'pointer' }}>TWITTER</span>
                  <span style={{ cursor: 'pointer' }}>INSTANCE</span>
               </div>
            </div>
         </div>
      </footer>

    </main>
  );
}
