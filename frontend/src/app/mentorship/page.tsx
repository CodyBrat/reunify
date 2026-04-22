'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { MentorshipSession, OfficeHours } from '../../types';

export default function MentorshipPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [availabilityEnabled, setAvailabilityEnabled] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) { router.push('/login'); return; }
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const userRole = localStorage.getItem('role');
      setTimeout(() => setRole(userRole), 0);

      const endpoint = userRole === 'Student' 
        ? `/mentorships/student/${payload.userId}` 
        : `/mentorships/alumni/${payload.userId}`;
      
      const data = await api.get<MentorshipSession[]>(endpoint);
      setSessions(data);

      if (userRole === 'Alumni') {
        const ohData = await api.get<OfficeHours>(`/mentorships/office-hours/${payload.userId}`);
        setAvailabilityEnabled(ohData?.enabled || false);
      }
    } catch {
      console.error('Failed to load mentorship data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Syncing Sessions...</div>;

  const upcoming = sessions.filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledAt) > new Date());
  const past = sessions.filter(s => s.status === 'COMPLETED' || (s.status === 'SCHEDULED' && new Date(s.scheduledAt) <= new Date()));

  return (
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* ── TOP NAVIGATION ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', borderBottom: '6px solid black', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3rem', lineHeight: 1 }}>MENTORSHIP_HUB_</h1>
          <p className="label-caps" style={{ color: 'var(--primary-blue)', fontWeight: 900 }}>GUIDANCE_PROTOCOL_V2</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={() => router.back()} className="btn btn-outline" style={{ border: '3px solid black' }}>✕ CLOSE</button>
          {role === 'Student' && (
            <button onClick={() => router.push('/mentorship/book')} className="btn btn-primary" style={{ padding: '1rem 2rem', background: 'var(--primary-red)', border: '3px solid black' }}>
              + BOOK_SESSION
            </button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem', alignItems: 'flex-start' }}>
        
        {/* ── LEFT SIDEBAR: STATUS & PROFILE ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2rem' }}>
          
          {/* Status Indicator Card */}
          <div style={{ border: '4px solid black', background: 'white', boxShadow: '12px 12px 0 black', padding: '2.5rem' }}>
            <div style={{ 
              width: '80px', height: '80px', background: 'black', 
              border: '4px solid black', marginBottom: '2rem', transform: 'rotate(-5deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2.5rem', fontWeight: 900, color: 'white'
            }}>
              M
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem' }}>Identity_Link</h2>
            <p className="label-caps" style={{ marginBottom: '2rem' }}>Status: {role?.toUpperCase() || 'UNKNOWN'}</p>
            
            {role === 'Alumni' && (
              <div style={{ borderTop: '3px solid black', paddingTop: '1.5rem' }}>
                 <p className="label-caps" style={{ marginBottom: '1rem', color: availabilityEnabled ? 'var(--primary-blue)' : 'var(--primary-red)' }}>
                    {availabilityEnabled ? 'PROTOCOL_LIVE' : 'PROTOCOL_HIDDEN'}
                 </p>
                 <button 
                  onClick={() => router.push('/dashboard/alumni/mentorship-settings')}
                  className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem' }}>
                   CONFIG_OFFICE_HOURS
                 </button>
              </div>
            )}
          </div>

          {/* Impact Stats Sidebar */}
          <div style={{ padding: '1.5rem', border: '4px solid black', background: 'var(--primary-yellow)' }}>
             <h4 className="label-caps" style={{ marginBottom: '1rem', color: 'black' }}>Network_Pulse</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', paddingBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>SESSIONS_TOTAL</span>
                   <span style={{ fontWeight: 900 }}>{sessions.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid black', paddingBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>UPCOMING</span>
                   <span style={{ fontWeight: 900 }}>{upcoming.length}</span>
                </div>
             </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main>
          {/* Active Sessions Feed */}
          <section style={{ marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '3rem', letterSpacing: '-0.05em' }}>Scheduled_Events</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem', border: '4px dashed #ccc' }}>
                   <p className="label-caps" style={{ color: '#888' }}>No frequency detected. Book a session to initialize.</p>
                </div>
              ) : (
                upcoming.map(session => (
                  <article key={session.id} className="hover-lift" style={{ 
                    border: '4px solid black', background: 'white', padding: '2.5rem', 
                    boxShadow: '10px 10px 0 black', display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: '2.5rem', alignItems: 'center'
                  }}>
                    {/* Geometric Date Badge */}
                    <div style={{ 
                      background: 'black', color: 'white', height: '120px', display: 'flex', 
                      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid black'
                    }}>
                      <p style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{new Date(session.scheduledAt).getDate()}</p>
                      <p className="label-caps" style={{ color: 'white', fontSize: '0.7rem' }}>{new Date(session.scheduledAt).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</p>
                    </div>

                    <div>
                      <span className="label-caps" style={{ color: 'var(--primary-blue)', fontSize: '0.7rem' }}>{session.type}</span>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', margin: '0.5rem 0' }}>
                        {role === 'Student' ? session.alumniName : session.studentNames?.join(', ')}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {session.topics.map(t => (
                          <span key={t} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', border: '2px solid black', background: '#f0f0f0' }}>{t.toUpperCase()}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                       <p style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '1rem' }}>{new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       <button 
                        onClick={() => router.push(`/mentorship/session/${session.id}`)}
                        className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>
                         HUB_ACCESS →
                       </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* History Feed */}
          <section>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '3rem', letterSpacing: '-0.05em' }}>History_Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {past.length === 0 ? (
                <p className="label-caps" style={{ color: '#888' }}>No archive detected.</p>
              ) : (
                past.map(session => (
                  <div key={session.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '1.5rem 2.5rem', border: '3px solid black', background: '#fafafa',
                    transition: 'transform 0.2s'
                  }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '48px', height: '48px', background: 'var(--primary-blue)', 
                        border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontWeight: 900, color: 'white'
                      }}>
                        {(role === 'Student' ? session.alumniName : session.studentNames?.[0])?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 900, textTransform: 'uppercase' }}>{role === 'Student' ? session.alumniName : session.studentNames?.join(', ')}</h4>
                        <p className="label-caps" style={{ fontSize: '0.65rem' }}>{new Date(session.scheduledAt).toLocaleDateString()} · {session.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/mentorship/session/${session.id}`)}
                      className="btn btn-outline" style={{ fontSize: '0.75rem' }}>
                      SUMMARY_
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
