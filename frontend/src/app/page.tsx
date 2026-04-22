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
    <main className="bauhaus-grid" style={{ minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      
      {/* Dynamic Background Geometric Shapes */}
      <div className="bauhaus-shape" style={{ top: '5%', left: '2%', width: '120px', height: '120px', background: 'var(--primary-red)', transform: 'rotate(15deg)' }}></div>
      <div className="bauhaus-shape" style={{ top: '15%', right: '8%', width: '200px', height: '200px', background: 'var(--primary-yellow)', borderRadius: '50%' }}></div>
      <div className="bauhaus-shape" style={{ bottom: '10%', left: '5%', width: '150px', height: '150px', background: 'var(--primary-blue)', borderRight: '15px solid black' }}></div>
      <div className="bauhaus-shape" style={{ top: '40%', right: '20%', width: '0', height: '0', borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: '120px solid var(--primary-red)' }}></div>

      {/* --- NAVIGATION --- */}
      <nav style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--border-thick) solid black', background: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '24px', height: '24px', background: 'var(--primary-red)', border: '2px solid black' }}></div>
          REUNIFY_
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <Link href="/posts" className="label-caps" style={{ color: 'black', textDecoration: 'none', borderBottom: '2px solid transparent' }}>COMMUNITY</Link>
          <Link href="/mentorship" className="label-caps" style={{ color: 'black', textDecoration: 'none' }}>MENTORS</Link>
          {isAuth ? (
            <Link href={userRole === 'Student' ? '/dashboard/student' : '/dashboard/alumni'} className="btn btn-primary" style={{ padding: '0.6rem 2rem' }}>WORKSPACE</Link>
          ) : (
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.6rem 2rem' }}>LOGIN</Link>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', padding: '12rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '6px solid black' }}>
        <div style={{ zIndex: 1, maxWidth: '1000px' }}>
          <span className="label-caps" style={{ background: 'black', color: 'white', padding: '0.3rem 1rem', marginBottom: '2rem', display: 'inline-block' }}>EST. 2026 / UNIVERSAL ALUMNI PROTOCOL</span>
          <h1 className="heading-display" style={{ fontSize: '7rem', marginBottom: '1.5rem', letterSpacing: '-0.06em' }}>
            CONNECT<br />
            <span style={{ background: 'var(--primary-blue)', color: 'white', padding: '0 1rem', border: '4px solid black' }}>THE DOTS.</span>
          </h1>
          <p style={{ fontSize: '1.6rem', maxWidth: '700px', margin: '0 auto 4rem auto', color: 'var(--foreground)', fontWeight: 600, lineHeight: 1.2 }}>
            A high-density ecosystem for university students and global alumni to facilitate direct referrals and architectural mentorship.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            {isAuth ? (
               <Link href={userRole === 'Student' ? '/dashboard/student' : '/dashboard/alumni'} className="btn btn-primary" style={{ padding: '1.8rem 4rem', fontSize: '1.2rem', boxShadow: '10px 10px 0 black' }}>GO TO DASHBOARD</Link>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary" style={{ padding: '1.8rem 4rem', fontSize: '1.2rem', boxShadow: '10px 10px 0 black' }}>REGISTER_NOW</Link>
                <Link href="/posts" className="btn btn-outline" style={{ padding: '1.8rem 4rem', fontSize: '1.2rem', background: 'var(--primary-yellow)' }}>READ_FEED</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- ARCHITECTURAL BREAKDOWN --- */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '6px solid black', background: 'white' }}>
        {[
          { title: 'AUTH', color: 'var(--primary-red)', desc: 'VERIFIED CREDENTIALS' },
          { title: 'MENTOR', color: 'var(--primary-blue)', desc: '1-ON-1 GUIDANCE' },
          { title: 'REFER', color: 'var(--primary-yellow)', desc: 'DIRECT PIPELINES' },
          { title: 'DISCUSS', color: 'black', desc: 'COMMUNITY FEED' }
        ].map((item, i) => (
          <div key={i} style={{ padding: '3rem', borderRight: i < 3 ? '4px solid black' : 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: item.color, border: '3px solid black' }}></div>
            <h3 className="heading-section" style={{ fontSize: '2rem' }}>{item.title}</h3>
            <p className="label-caps">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* --- MAIN FEATURES WITH VISUALS --- */}
      <section style={{ padding: '10rem 3rem', display: 'flex', flexDirection: 'column', gap: '10rem' }}>
        
        {/* Feature 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div className="glass-card hover-lift" style={{ height: '450px', background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ width: '70%', height: '70%', border: '8px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '8rem', fontWeight: 900, color: 'white' }}>M</span>
             </div>
          </div>
          <div>
            <h2 className="heading-display" style={{ fontSize: '4.5rem', marginBottom: '2.5rem' }}>STRUCTURED MENTORSHIP_</h2>
            <p style={{ fontSize: '1.4rem', lineHeight: '1.4', marginBottom: '3rem' }}>
              Schedule 1-on-1 sessions with alumni who have walked your path. Our built-in **Office Hours** engine ensures availability is always live and verified.
            </p>
            <Link href="/mentorship" className="btn btn-outline" style={{ padding: '1.2rem 3rem' }}>EXPLORE MENTORS →</Link>
          </div>
        </div>

        {/* Feature 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div style={{ order: 2 }}>
             <div className="glass-card hover-lift" style={{ height: '450px', background: 'var(--primary-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '0', height: '0', borderLeft: '80px solid transparent', borderRight: '80px solid transparent', borderBottom: '160px solid black' }}></div>
             </div>
          </div>
          <div style={{ order: 1 }}>
            <h2 className="heading-display" style={{ fontSize: '4.5rem', marginBottom: '2.5rem' }}>DIRECT REFERRALS_</h2>
            <p style={{ fontSize: '1.4rem', lineHeight: '1.4', marginBottom: '3rem' }}>
              Bypass the black hole of automated application systems. Get referred by alumni working at the world's most innovative organizations.
            </p>
            <Link href="/login" className="btn btn-outline" style={{ padding: '1.2rem 3rem' }}>START REQUEST →</Link>
          </div>
        </div>
      </section>

      {/* --- STAT TICKER (RE-DESIGNED) --- */}
      <section style={{ borderTop: '6px solid black', borderBottom: '6px solid black', background: 'black', padding: '1.5rem 0', overflow: 'hidden' }}>
        <div className="label-caps" style={{ color: 'white', display: 'flex', gap: '6rem', fontSize: '1.5rem', whiteSpace: 'nowrap' }}>
           {[...Array(20)].map((_, i) => (
             <span key={i}>● REUNIFY_V2_PROTOCOL_CONNECTED ● TOTAL_REFERRALS_1240+ ● MENTORS_ONLINE_45</span>
           ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '15rem 3rem', background: 'var(--primary-red)', textAlign: 'center', borderBottom: '6px solid black' }}>
          <h2 className="heading-display" style={{ fontSize: '7rem', color: 'white', marginBottom: '4rem', letterSpacing: '-0.08em' }}>
            JOIN THE<br />GEOMETRY.
          </h2>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
             <Link href="/register" className="btn btn-outline" style={{ padding: '2rem 5rem', fontSize: '1.5rem', background: 'white' }}>CREATE ACCOUNT</Link>
             <Link href="/login" className="btn btn-outline" style={{ padding: '2rem 5rem', fontSize: '1.5rem', background: 'var(--primary-yellow)' }}>SIGN IN</Link>
          </div>
      </section>

      <footer style={{ padding: '6rem 3rem', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
         <div>
            <div style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem' }}>REUNIFY_</div>
            <p className="label-caps" style={{ maxWidth: '300px', lineHeight: '1.5' }}>
              THE ARCHITECTURAL BRIDGE BETWEEN CAMPUS AND INDUSTRY. BUILT WITH PASSION AND BOLD BORDERS.
            </p>
         </div>
         <div style={{ display: 'flex', gap: '8rem' }}>
            <div>
               <p className="label-caps" style={{ marginBottom: '2rem', color: 'black' }}>DIRECTORY</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontWeight: 900, fontSize: '0.9rem' }}>
                  <Link href="/posts" style={{ color: 'black', textDecoration: 'none' }}>COMMUNITY_FEED</Link>
                  <Link href="/mentorship" style={{ color: 'black', textDecoration: 'none' }}>MENTOR_HUB</Link>
                  <Link href="/login" style={{ color: 'black', textDecoration: 'none' }}>REFERRAL_PORTAL</Link>
               </div>
            </div>
            <div>
               <p className="label-caps" style={{ marginBottom: '2rem', color: 'black' }}>OFFICE</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontWeight: 900, fontSize: '0.9rem' }}>
                  <span>NEW_DELHI_IN</span>
                  <span>SAN_FRANCISCO_US</span>
                  <span>BERLIN_DE</span>
               </div>
            </div>
         </div>
      </footer>

    </main>
  );
}
