'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { UserProfile } from '../../../../types';



export default function MentorDetailsPage() {
  const router = useRouter();
  const { id: alumniId } = useParams();
  const [mentor, setMentor] = useState<UserProfile | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ id: string, startTime: Date, duration: number, type: string, remainingSpots: number }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<{ id: string, startTime: Date, duration: number, type: string, remainingSpots: number } | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [urgency, setUrgency] = useState('General guidance');
  const [questions, setQuestions] = useState(['', '', '']);
  const [materials, setMaterials] = useState({ resumeUrl: '', portfolioUrl: '' });
  const [booking, setBooking] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [mentorData] = await Promise.all([
        api.get<UserProfile>(`/mentors/${alumniId}`),
      ]);
      setMentor(mentorData);

      // Load slots for next 2 weeks
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 14);
      const slots = await api.get<{ id: string, startTime: Date, duration: number, type: string, remainingSpots: number }[]>(`/mentorships/available/${alumniId}?startDate=${start.toISOString()}&endDate=${end.toISOString()}`);
      setAvailableSlots(slots);
    } catch {
      console.error('Failed to load mentor data');
    } finally {
      setLoading(false);
    }
  }, [alumniId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleTopicToggle = (topic: string) => {
    if (topics.includes(topic)) setTopics(topics.filter(t => t !== topic));
    else if (topics.length < 3) setTopics([...topics, topic]);
  };

  const handleBook = async () => {
    setBooking(true);
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1])) as { userId: string };
      
      await api.post('/mentorships/book', {
        alumniId,
        studentId: payload.userId,
        slotData: selectedSlot,
        bookingDetails: {
          topics,
          urgency,
          questions: questions.filter(q => q.trim()),
          materials
        }
      });
      alert('Session Booked successfully!');
      router.push('/mentorship');
    } catch {
      alert('Failed to book session');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Syncing Schedule...</div>;
  if (!mentor) return <div style={{ textAlign: 'center', padding: '10rem' }}>Mentor not found</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '4px solid black', paddingBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ width: '100px', height: '100px', background: 'var(--primary-yellow)', border: '4px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '2.5rem', boxShadow: '6px 6px 0 black' }}>
          {mentor.name.charAt(0)}
        </div>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{mentor.name}</h1>
          <p style={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary-blue)' }}>{mentor.designation} @ {mentor.company}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: '12px', background: step >= i ? 'black' : '#eee', border: '2px solid black' }} />
        ))}
      </div>

      <div className="glass-card" style={{ padding: '3rem' }}>
        {/* STEP 1: SLOT SELECTION */}
        {step === 1 && (
          <div>
            <h2 className="heading-section" style={{ marginBottom: '2rem' }}>Choose Available Slot</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {availableSlots.length === 0 ? <p style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>No slots available for the next 2 weeks.</p> : 
                availableSlots.map(slot => (
                  <button 
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', 
                      border: '3px solid black', cursor: 'pointer', textAlign: 'left',
                      background: selectedSlot?.id === slot.id ? 'var(--primary-yellow)' : 'white'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{new Date(slot.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      <p style={{ fontSize: '0.9rem', color: '#555' }}>{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({slot.duration} mins)</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="label-caps" style={{ fontSize: '0.6rem' }}>{slot.type}</span>
                      <p style={{ fontSize: '0.8rem', fontWeight: 900 }}>{slot.remainingSpots} spot{slot.remainingSpots > 1 ? 's' : ''} left</p>
                    </div>
                  </button>
                ))
              }
            </div>
            <button 
              disabled={!selectedSlot} 
              onClick={() => setStep(2)} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '3rem' }}
            >
              CONTINUE →
            </button>
          </div>
        )}

        {/* STEP 2: SESSION DETAILS */}
        {step === 2 && (
          <div>
            <h2 className="heading-section" style={{ marginBottom: '2rem' }}>Session Details</h2>
            <div style={{ marginBottom: '2.5rem' }}>
              <label className="label-caps">What do you need help with? (Select 1-3)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                {['Resume Review', 'Career Path Advice', 'Mock Interview', 'Salary Negotiation', 'Work-Life Balance', 'Culture Insights'].map(topic => (
                  <button 
                    key={topic}
                    onClick={() => handleTopicToggle(topic)}
                    style={{ 
                      padding: '0.8rem', border: '2px solid black', fontWeight: 700, fontSize: '0.8rem',
                      background: topics.includes(topic) ? 'var(--primary-blue)' : 'white',
                      color: topics.includes(topic) ? 'white' : 'black',
                      cursor: 'pointer'
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label className="label-caps">How urgent is this?</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {['General guidance', 'Interview next week', 'Decision needed'].map(u => (
                  <button 
                    key={u}
                    onClick={() => setUrgency(u)}
                    style={{ 
                      flex: 1, padding: '0.8rem', border: '2px solid black', fontWeight: 700, fontSize: '0.7rem',
                      background: urgency === u ? 'black' : 'white',
                      color: urgency === u ? 'white' : 'black',
                      cursor: 'pointer'
                    }}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>← BACK</button>
              <button disabled={topics.length === 0} onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 1 }}>CONTINUE →</button>
            </div>
          </div>
        )}

        {/* STEP 3: QUESTIONNAIRE */}
        {step === 3 && (
          <div>
            <h2 className="heading-section" style={{ marginBottom: '2rem' }}>Pre-Session Questionnaire</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className="label-caps">Specific Questions (Max 3)</label>
              {questions.map((q, i) => (
                <textarea 
                  key={i}
                  value={q}
                  onChange={e => {
                    const newQs = [...questions];
                    newQs[i] = e.target.value;
                    setQuestions(newQs);
                  }}
                  placeholder={`Question ${i+1}...`}
                  style={{ width: '100%', padding: '0.8rem', border: '2px solid black', marginTop: '0.5rem', minHeight: '60px', fontFamily: 'inherit' }}
                />
              ))}
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <label className="label-caps">Materials (Optional)</label>
              <input 
                type="text" 
                placeholder="Resume Link (GDrive/Dropbox)" 
                value={materials.resumeUrl}
                onChange={e => setMaterials({...materials, resumeUrl: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', border: '2px solid black', marginTop: '0.5rem' }}
              />
              <input 
                type="text" 
                placeholder="Portfolio/LinkedIn Link" 
                value={materials.portfolioUrl}
                onChange={e => setMaterials({...materials, portfolioUrl: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', border: '2px solid black', marginTop: '0.5rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1 }}>← BACK</button>
              <button disabled={booking} onClick={handleBook} className="btn btn-primary" style={{ flex: 1 }}>
                {booking ? 'BOOKING...' : 'FINALIZE BOOKING'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
