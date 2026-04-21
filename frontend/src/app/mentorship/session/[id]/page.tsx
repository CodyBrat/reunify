'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { MentorshipSession } from '../../../../types';

export default function LiveSessionPage() {
  const router = useRouter();
  const { id: sessionId } = useParams();
  const [session, setSession] = useState<MentorshipSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  
  // UI States
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [newAction, setNewAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, takeaways: '', wouldBookAgain: true });
  const [isLive, setIsLive] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const data = await api.get<MentorshipSession>(`/mentorships/sessions/${sessionId}`);
      setSession(data);
      setMeetingLink(data.meetingLink || '');
      setNotes(data.sessionNotes || '');
      setRole(localStorage.getItem('role'));
      
      // Load student specific action items if they exist
      if (role === 'Student') {
        const studentActions = data.actionItems?.find((ai: { studentId: string, tasks: string[] }) => ai.studentId === localStorage.getItem('userId'))?.tasks || [];
        setActionItems(studentActions);
      }
    } catch {
      console.error('Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId, role]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSession();
  }, [loadSession]);

  const updateMeetingLink = async () => {
    try {
      await api.patch(`/mentorships/sessions/${sessionId}/link`, { link: meetingLink });
      alert('Meeting link updated!');
      loadSession();
    } catch {
      alert('Failed to update link');
    }
  };

  const saveNotes = async () => {
    setIsSaving(true);
    try {
      // Notes saving logic could be added here if needed
      setIsSaving(false);
    } catch {
      setIsSaving(false);
    }
  };

  const submitFinalFeedback = async () => {
    try {
      const studentId = localStorage.getItem('userId');
      await api.post(`/mentorships/sessions/${sessionId}/feedback`, {
        studentId,
        rating: feedback.rating,
        notes: feedback.takeaways
      });
      alert('Feedback submitted! Session completed.');
      setShowFeedback(false);
      router.push('/mentorship');
    } catch {
      alert('Failed to submit feedback');
    }
  };

  useEffect(() => {
    if (session) {
      const checkLive = () => {
        const live = Math.abs(Date.now() - new Date(session.scheduledAt).getTime()) < 3600000;
        setIsLive(live);
      };
      checkLive();
      const interval = setInterval(checkLive, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [session]);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Entering Session Hub...</div>;
  if (!session) return <div style={{ textAlign: 'center', padding: '10rem' }}>Session not found</div>;

  const isAlumni = role === 'Alumni';
  const sessionDate = new Date(session.scheduledAt);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: '100vh', background: 'white', borderTop: '4px solid black' }}>
      
      {/* Left Panel: Main Workspace */}
      <main style={{ padding: '3rem', overflowY: 'auto', borderRight: '4px solid black' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="label-caps" style={{ color: 'var(--primary-blue)' }}>{session.type} SESSION</span>
            <h1 className="heading-display" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{session.alumniName} ↔ {session.studentNames?.join(', ')}</h1>
            <p style={{ fontWeight: 700, marginTop: '0.5rem' }}>📅 {sessionDate.toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button onClick={() => router.back()} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>LEAVE HUB</button>
        </header>

        {/* Video Call Integration Card */}
        <section className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem', border: '5px solid black', position: 'relative' }}>
          {isLive && <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', background: 'var(--primary-red)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Session Live</span>
          </div>}
          
          <h2 className="heading-section" style={{ marginBottom: '2rem' }}>Video Interaction</h2>
          
          {!session.meetingLink && !isAlumni ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#f5f5f5', border: '3px dashed black' }}>
              <p style={{ fontWeight: 700 }}>⏳ Waiting for the mentor to provide the meeting link...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isAlumni ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Paste Google Meet / Zoom link here..." 
                    value={meetingLink}
                    onChange={e => setMeetingLink(e.target.value)}
                    style={{ flex: 1, padding: '1rem', border: '3px solid black', fontWeight: 700 }}
                  />
                  <button onClick={updateMeetingLink} className="btn btn-primary">SET LINK</button>
                </div>
              ) : null}
              
              {session.meetingLink && (
                <a href={session.meetingLink} target="_blank" rel="noreferrer" 
                   className="btn btn-primary" 
                   style={{ background: '#16a34a', textAlign: 'center', textDecoration: 'none', padding: '1.5rem', fontSize: '1.2rem' }}>
                   JOIN GOOGLE MEET NOW ↗
                </a>
              )}
            </div>
          )}
        </section>

        {/* Collaborative Notes */}
        <section style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="heading-section">Collaborative Notes</h2>
            {isSaving && <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>SAVING...</span>}
          </div>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="Type session specific notes, insights, and key takeaways here..."
            style={{ 
              flex: 1, padding: '2rem', border: '4px solid black', background: '#fff9c4', 
              fontSize: '1rem', lineHeight: 1.6, fontFamily: 'inherit', outline: 'none',
              boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.1)' 
            }}
          />
        </section>
      </main>

      {/* Right Panel: Agenda & Action Items */}
      <aside style={{ padding: '3rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <section>
          <h2 className="label-caps" style={{ marginBottom: '1.5rem', color: '#888' }}>Session Agenda</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {session.topics.map((t: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '2px solid black', background: 'white' }}>
                <div style={{ width: '24px', height: '24px', border: '2px solid black', background: 'var(--primary-blue)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="label-caps" style={{ marginBottom: '1.5rem', color: '#888' }}>Action Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
            {actionItems.map((ai, idx) => (
              <div key={idx} style={{ padding: '0.8rem', border: '2px solid black', background: 'white', fontSize: '0.85rem', fontWeight: 700 }}>
                • {ai}
              </div>
            ))}
          </div>
          {isAlumni && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Add task for student..." 
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', border: '2px solid black', fontSize: '0.8rem' }}
              />
              <button 
                onClick={() => { setActionItems([...actionItems, newAction]); setNewAction(''); }}
                style={{ background: 'black', color: 'white', border: 'none', padding: '0 1rem', fontWeight: 900, cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          )}
        </section>

        {/* Success / Feedback Trigger */}
        <section style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => setShowFeedback(true)}
            className="btn btn-primary" 
            style={{ width: '100%', background: 'var(--primary-yellow)', color: 'black' }}
          >
            END & RATE SESSION
          </button>
        </section>
      </aside>

      {/* Feedback Modal */}
      {showFeedback && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
            <h2 className="heading-section" style={{ marginBottom: '2rem' }}>Session Feedback</h2>
            <p style={{ marginBottom: '1.5rem', fontWeight: 700 }}>How helpful was this session with {session.alumniName}?</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} onClick={() => setFeedback({...feedback, rating: r})} 
                        style={{ flex: 1, padding: '1rem', border: '3px solid black', background: feedback.rating === r ? 'var(--primary-yellow)' : 'white', fontWeight: 900 }}>{r}</button>
              ))}
            </div>

            <label className="label-caps">Key Takeaways / Feedback</label>
            <textarea 
              value={feedback.takeaways}
              onChange={e => setFeedback({...feedback, takeaways: e.target.value})}
              placeholder="What did you learn? How can the mentor improve?"
              style={{ width: '100%', padding: '1rem', border: '3px solid black', marginTop: '0.5rem', minHeight: '100px', marginBottom: '2rem' }}
            />

            <button onClick={submitFinalFeedback} 
                    className="btn btn-primary" style={{ width: '100%' }}>SUBMIT & COMPLETE</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
