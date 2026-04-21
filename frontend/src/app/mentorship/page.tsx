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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3rem' }}>Mentorship</h1>
          <p style={{ color: 'var(--text-muted)' }}>Structured guidance for the next chapter of your journey.</p>
        </div>
        {role === 'Student' && (
          <button onClick={() => router.push('/mentorship/book')} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            + BOOK NEW SESSION
          </button>
        )}
      </header>
      
      {role === 'Alumni' && (
        <div style={{ 
          marginBottom: '3rem', padding: '1.5rem 2rem', border: '4px solid black', 
          background: availabilityEnabled ? '#e6fffa' : '#fff5f5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '8px 8px 0 black'
        }}>
          <div>
            <span className="label-caps" style={{ color: availabilityEnabled ? '#2c7a7b' : '#c53030' }}>
              Current Status: {availabilityEnabled ? 'DISCOVERABLE' : 'HIDDEN'}
            </span>
            <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>
              {availabilityEnabled 
                ? 'Your office hours are live! Students can see your profile and book slots.' 
                : 'Your profile is currently hidden from students. They cannot book sessions.'}
            </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/alumni/mentorship-settings')}
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.5rem', background: 'black', color: 'white', border: 'none' }}
          >
            MANAGE SETTINGS
          </button>
        </div>
      )}

      {/* Active Sessions */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 className="heading-section" style={{ marginBottom: '2.5rem' }}>Upcoming Sessions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
          {upcoming.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
              <p style={{ color: '#888' }}>No sessions scheduled. {role === 'Student' ? 'Time to book your first one!' : 'Your schedule is currently clear.'}</p>
            </div>
          ) : (
            upcoming.map(session => (
              <div key={session.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '10px solid var(--primary-yellow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="label-caps" style={{ fontSize: '0.6rem', color: 'var(--primary-blue)' }}>{session.type}</span>
                    <h3 style={{ fontWeight: 900, fontSize: '1.4rem', marginTop: '0.2rem' }}>{role === 'Student' ? session.alumniName : session.studentNames?.join(', ')}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{new Date(session.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {session.topics.map(t => (
                    <span key={t} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', border: '2px solid black', background: '#f0f0f0' }}>{t}</span>
                  ))}
                </div>

                <button 
                  onClick={() => router.push(`/mentorship/session/${session.id}`)}
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: 'auto', background: 'black', border: 'none' }}
                >
                  GO TO SESSION HUB →
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Past Sessions */}
      <section>
        <h2 className="heading-section" style={{ marginBottom: '2.5rem' }}>History & Feedback</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {past.length === 0 ? <p style={{ color: '#888', fontStyle: 'italic' }}>No past sessions found.</p> : 
            past.map(session => (
              <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', border: '3px solid black', background: 'white' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: 'black', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
                    {(role === 'Student' ? session.alumniName : session.studentNames?.[0])?.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 900 }}>{role === 'Student' ? session.alumniName : session.studentNames?.join(', ')}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(session.scheduledAt).toLocaleDateString()} · {session.type}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {role === 'Student' ? (
                    <button onClick={() => router.push(`/mentorship/session/${session.id}`)} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>VIEW NOTES & FEEDBACK</button>
                  ) : (
                    <button onClick={() => router.push(`/mentorship/session/${session.id}`)} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>SESSION SUMMARY</button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  );
}
