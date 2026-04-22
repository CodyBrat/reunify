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

  const completeSession = async () => {
    try {
      await api.patch(`/mentorships/sessions/${sessionId}/status`, { status: 'COMPLETED' });
      alert('Session marked as completed.');
      router.push('/mentorship');
    } catch {
      alert('Failed to complete session');
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
      alert('Feedback submitted!');
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

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem', fontWeight: 900 }}>Entering Session...</div>;
  if (!session) return <div style={{ textAlign: 'center', padding: '10rem' }}>Session Not Found</div>;

  const isAlumni = role === 'Alumni';
  const sessionDate = new Date(session.scheduledAt);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', height: '100vh', background: 'white', borderTop: '8px solid black', overflow: 'hidden' }}>
      
      {/* ── LEFT PANEL: WORKSPACE ── */}
      <main style={{ padding: '4rem', overflowY: 'auto', borderRight: '6px solid black', position: 'relative' }} className="bauhaus-grid">
        
        <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative' }}>
            {/* Bauhaus Accent Block */}
            <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', background: 'var(--primary-red)', zIndex: -1 }} />
            <span className="label-caps" style={{ color: 'var(--primary-blue)', fontSize: '0.8rem' }}>Session Type: {session.type}</span>
            <h1 className="heading-display" style={{ fontSize: '3.5rem', marginTop: '1rem', lineHeight: 1 }}>{session.alumniName} <br/> ↔ {session.studentNames?.join(', ')}</h1>
            <p className="label-caps" style={{ marginTop: '1.5rem', color: 'black' }}>Scheduled For: {sessionDate.toLocaleString()}</p>
          </div>
          <button onClick={() => router.back()} className="btn btn-outline" style={{ border: '3px solid black' }}>✕ Leave Session</button>
        </header>

        {/* Video Interaction Surface */}
        <section style={{ 
          border: '6px solid black', background: 'white', padding: '3rem', 
          boxShadow: '15px 15px 0 black', marginBottom: '4rem', position: 'relative' 
        }}>
          {isLive && (
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--primary-red)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Session is Live</span>
            </div>
          )}
          
          <h2 className="label-caps" style={{ marginBottom: '2rem', color: 'black' }}>Video Meeting</h2>
          
          {!session.meetingLink && !isAlumni ? (
            <div style={{ padding: '4rem', textAlign: 'center', background: '#fafafa', border: '4px dashed black' }}>
              <p style={{ fontWeight: 900, fontSize: '1.2rem' }}>Waiting for Mentor to provide link...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {isAlumni && (
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Paste Meeting Link Here" 
                    value={meetingLink}
                    onChange={e => setMeetingLink(e.target.value)}
                    style={{ flex: 1, padding: '1.2rem', border: '3px solid black', fontWeight: 900 }}
                  />
                  <button onClick={updateMeetingLink} className="btn btn-primary" style={{ background: 'black' }}>Update Link</button>
                </div>
              )}
              
              {session.meetingLink && (
                <a href={session.meetingLink} target="_blank" rel="noreferrer" 
                   className="btn btn-primary" 
                   style={{ background: 'var(--primary-blue)', textAlign: 'center', textDecoration: 'none', padding: '2rem', fontSize: '1.5rem', boxShadow: '10px 10px 0 black' }}>
                   Join Meeting Now ↗
                </a>
              )}
            </div>
          )}
        </section>

        {/* Collaborative Note */}
        <section style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <h2 className="label-caps" style={{ color: 'black' }}>Meeting Notes</h2>
            {isSaving && <span className="label-caps" style={{ color: 'var(--primary-red)' }}>Saving...</span>}
          </div>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="Type meeting notes here..."
            style={{ 
              flex: 1, padding: '3rem', border: '5px solid black', background: 'var(--primary-yellow)', 
              fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.6, fontFamily: 'inherit', outline: 'none',
              boxShadow: 'inset 8px 8px 0 rgba(0,0,0,0.1)' 
            }}
          />
        </section>
      </main>

      {/* ── RIGHT PANEL: AGENDA & ACTIONS ── */}
      <aside style={{ padding: '4rem', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        <section>
          <h2 className="label-caps" style={{ marginBottom: '2rem', color: 'black', borderBottom: '4px solid black', paddingBottom: '0.5rem' }}>Meeting Agenda</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {session.topics.map((t: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', border: '3px solid black', background: 'white' }}>
                <div style={{ width: '20px', height: '20px', background: idx % 2 === 0 ? 'var(--primary-red)' : 'var(--primary-blue)', border: '2px solid black' }} />
                <span style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase' }}>{t}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="label-caps" style={{ marginBottom: '2rem', color: 'black', borderBottom: '4px solid black', paddingBottom: '0.5rem' }}>Action Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {actionItems.map((ai, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '3px solid black', background: 'white', fontSize: '0.9rem', fontWeight: 900 }}>
                • {ai.toUpperCase()}
              </div>
            ))}
          </div>
          {isAlumni && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Add task for student" 
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                style={{ flex: 1, padding: '0.8rem', border: '3px solid black', fontWeight: 900, fontSize: '0.8rem' }}
              />
              <button 
                onClick={() => { if(newAction) { setActionItems([...actionItems, newAction]); setNewAction(''); } }}
                style={{ background: 'black', color: 'white', border: 'none', padding: '0 1.5rem', fontWeight: 900, cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          )}
        </section>

        {/* Exit Logic */}
        <section style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => isAlumni ? completeSession() : setShowFeedback(true)}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '2rem', background: 'black', color: 'white', fontSize: '1.1rem' }}
          >
            {isAlumni ? 'Finish & End Session' : 'Submit Feedback & End'}
          </button>
        </section>
      </aside>

      {/* Feedback Modal */}
      {showFeedback && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ border: '6px solid black', background: 'white', width: '100%', maxWidth: '600px', padding: '4rem', boxShadow: '20px 20px 0 black', position: 'relative' }}>
            <button onClick={() => setShowFeedback(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 900 }}>✕</button>
            <h2 className="heading-display" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Session Feedback</h2>
            <p className="label-caps" style={{ marginBottom: '2rem', color: 'black' }}>Rate this session:</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} onClick={() => setFeedback({...feedback, rating: r})} 
                        style={{ 
                          flex: 1, padding: '1.2rem', border: '4px solid black', 
                          background: feedback.rating === r ? 'var(--primary-blue)' : 'white', 
                          color: feedback.rating === r ? 'white' : 'black',
                          fontWeight: 900, fontSize: '1.2rem'
                        }}>{r}</button>
              ))}
            </div>

            <label className="label-caps" style={{ color: 'black', display: 'block', marginBottom: '1rem' }}>Key Takeaways</label>
            <textarea 
              value={feedback.takeaways}
              onChange={e => setFeedback({...feedback, takeaways: e.target.value})}
              placeholder="What did you learn?"
              style={{ width: '100%', padding: '1.2rem', border: '3px solid black', minHeight: '150px', marginBottom: '3rem', fontWeight: 700, fontFamily: 'inherit' }}
            />

            <button onClick={submitFinalFeedback} 
                    className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', background: 'var(--primary-red)' }}>Submit Feedback</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}