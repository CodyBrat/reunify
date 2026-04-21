'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { OfficeHours } from '../../../../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DURATIONS = [15, 30, 45, 60, 90, 120];
const SESSION_TYPES = ['1-on-1', 'Group', 'Drop-in'];

export default function MentorshipSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form States
  const [enabled, setEnabled] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [schedule, setSchedule] = useState<{ day: string, slots: { startTime: string, duration: number, type: string, maxStudents: number }[] }[]>([]);
  const [preferences, setPreferences] = useState({
    maxSessionsPerWeek: 5,
    minAdvanceBooking: 24,
    expertiseAreas: [] as string[]
  });

  const loadSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const data = await api.get<OfficeHours>(`/mentorships/office-hours/${payload.userId}`);
      
      setEnabled(data.enabled);
      setTimezone(data.timezone);
      setSchedule(data.weeklySchedule || []);
      setPreferences({
        maxSessionsPerWeek: 5,
        minAdvanceBooking: 24,
        expertiseAreas: [],
        ...(data.preferences || {})
      });
    } catch {
      console.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, [loadSettings]);

  const addSlot = (day: string) => {
    const newSchedule = [...schedule];
    const dayIdx = newSchedule.findIndex(s => s.day === day);
    const newSlot = { startTime: '18:00', duration: 60, type: '1-on-1', maxStudents: 1 };
    
    if (dayIdx > -1) {
      newSchedule[dayIdx].slots.push(newSlot);
    } else {
      newSchedule.push({ day, slots: [newSlot] });
    }
    setSchedule(newSchedule);
  };

  const addExpertise = (tag: string) => {
    if (tag && !preferences.expertiseAreas.includes(tag)) {
      setPreferences({
        ...preferences,
        expertiseAreas: [...preferences.expertiseAreas, tag]
      });
    }
  };

  const removeExpertise = (tag: string) => {
    setPreferences({
      ...preferences,
      expertiseAreas: preferences.expertiseAreas.filter(t => t !== tag)
    });
  };

  const removeSlot = (day: string, slotIdx: number) => {
    const newSchedule = [...schedule];
    const dayIdx = newSchedule.findIndex(s => s.day === day);
    newSchedule[dayIdx].slots.splice(slotIdx, 1);
    if (newSchedule[dayIdx].slots.length === 0) {
      newSchedule.splice(dayIdx, 1);
    }
    setSchedule(newSchedule);
  };

  const updateSlot = (day: string, slotIdx: number, field: string, value: string | number) => {
    const newSchedule = [...schedule];
    const dayIdx = newSchedule.findIndex(s => s.day === day);
    // @ts-expect-error - Dynamic field access
    newSchedule[dayIdx].slots[slotIdx][field] = value;
    setSchedule(newSchedule);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1])) as { userId: string };
      
      await api.patch(`/mentorships/office-hours/${payload.userId}`, {
        enabled,
        timezone,
        weeklySchedule: schedule,
        preferences
      });
      alert('Settings saved successfully!');
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading Config...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <button onClick={() => router.back()} style={{ marginBottom: '1rem', background: 'none', border: 'none', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem' }}>← Back to Dashboard</button>
          <h1 className="heading-display">Mentorship Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Configure your availability and session preferences.</p>
        </div>
        <button 
          onClick={saveSettings} 
          className="btn btn-primary" 
          disabled={saving}
          style={{ padding: '1rem 3rem' }}
        >
          {saving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </header>

      <section className="glass-card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem', background: enabled ? '#e6fffa' : '#f7fafc', border: `3px solid ${enabled ? '#38b2ac' : '#cbd5e0'}` }}>
          <div>
            <h2 className="heading-section" style={{ marginBottom: '0.5rem', color: enabled ? '#234e52' : '#2d3748' }}>
              {enabled ? '✓ YOUR AVAILABILITY IS LIVE' : '○ AVAILABILITY IS HIDDEN'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: enabled ? '#2c7a7b' : '#718096', fontWeight: 700 }}>
              {enabled ? 'Students can now discover you and book slots from your schedule.' : 'Students cannot book or see your mentorship profile yet.'}
            </p>
          </div>
          <button 
            onClick={() => setEnabled(!enabled)}
            className="btn"
            style={{ 
              minWidth: '200px', 
              background: enabled ? '#319795' : 'black', 
              color: 'white', 
              border: '3px solid black',
              boxShadow: '4px 4px 0 rgba(0,0,0,1)',
              fontWeight: 900
            }}
          >
            {enabled ? 'DISABLE NOW' : 'ENABLE & GO LIVE'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <label className="label-caps">Timezone</label>
            <select 
              value={timezone} 
              onChange={e => setTimezone(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '3px solid black', marginTop: '0.5rem', fontWeight: 700 }}
            >
              <optgroup label="Popular">
                <option value="Asia/Kolkata">IST (GMT+5:30)</option>
                <option value="America/Los_Angeles">PST (GMT-8)</option>
                <option value="America/New_York">EST (GMT-5)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="Europe/London">GMT/BST (GMT+0/1)</option>
              </optgroup>
              <optgroup label="Others">
                <option value="Asia/Singapore">SGT (GMT+8)</option>
                <option value="Europe/Berlin">CET (GMT+1)</option>
                <option value="Australia/Sydney">AEST (GMT+10)</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="label-caps">Max Sessions Per Week</label>
            <select 
              value={preferences.maxSessionsPerWeek}
              onChange={e => setPreferences({...preferences, maxSessionsPerWeek: Number(e.target.value)})}
              style={{ width: '100%', padding: '0.8rem', border: '3px solid black', marginTop: '0.5rem', fontWeight: 700 }}
            >
              {[1, 2, 3, 5, 10, 20].map(n => <option key={n} value={n}>{n} Sessions</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <label className="label-caps">Professional Expertise (Tags)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            {(preferences.expertiseAreas || []).map(tag => (
              <span key={tag} style={{ background: 'var(--primary-blue)', color: 'white', padding: '5px 12px', border: '2px solid black', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {tag}
                <button onClick={() => removeExpertise(tag)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 900 }}>✕</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              id="expertise-input"
              placeholder="Add expertise (e.g. System Design, Product Growth)" 
              onKeyDown={e => { if(e.key === 'Enter') { addExpertise((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; } }}
              style={{ flex: 1, padding: '0.8rem', border: '3px solid black' }}
            />
            <button 
              onClick={() => { 
                const input = document.getElementById('expertise-input') as HTMLInputElement;
                addExpertise(input.value);
                input.value = '';
              }}
              className="btn btn-primary"
            >
              ADD
            </button>
          </div>
        </div>
      </section>

      <section className="glass-card" style={{ marginBottom: '3rem', padding: '2.5rem', borderLeft: '10px solid var(--primary-yellow)' }}>
        <h2 className="heading-section" style={{ marginBottom: '1rem' }}>Email Notifications (EmailJS)</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Enable automated email reminders and booking confirmations.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div>
            <label className="label-caps" style={{ fontSize: '0.6rem' }}>Service ID</label>
            <input type="text" placeholder="service_xxxx" style={{ width: '100%', padding: '0.6rem', border: '2px solid black', marginTop: '0.3rem' }} />
          </div>
          <div>
            <label className="label-caps" style={{ fontSize: '0.6rem' }}>Template ID</label>
            <input type="text" placeholder="template_xxxx" style={{ width: '100%', padding: '0.6rem', border: '2px solid black', marginTop: '0.3rem' }} />
          </div>
          <div>
            <label className="label-caps" style={{ fontSize: '0.6rem' }}>Public Key</label>
            <input type="password" placeholder="user_xxxx" style={{ width: '100%', padding: '0.6rem', border: '2px solid black', marginTop: '0.3rem' }} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 className="heading-section" style={{ marginBottom: '2.5rem' }}>Weekly Recurring Schedule</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {DAYS.map(day => {
            const dayData = schedule.find(s => s.day === day);
            return (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', padding: '2rem', border: '3px solid black', background: dayData?.slots.length ? 'white' : '#f5f5f5' }}>
                <div style={{ borderRight: '2px solid black' }}>
                  <h3 style={{ fontWeight: 900, textTransform: 'uppercase' }}>{day}</h3>
                  <button 
                    onClick={() => addSlot(day)} 
                    className="btn btn-outline" 
                    style={{ marginTop: '1rem', fontSize: '0.7rem', padding: '0.5rem 1rem' }}
                  >
                    + ADD SLOT
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {!dayData?.slots.length ? (
                    <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.9rem' }}>No slots configured</p>
                  ) : (
                    dayData.slots.map((slot, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fafafa', padding: '1rem', border: '2px solid black', position: 'relative' }}>
                        <div style={{ flex: 1 }}>
                          <label className="label-caps" style={{ fontSize: '0.6rem' }}>Start Time</label>
                          <input 
                            type="time" 
                            value={slot.startTime} 
                            onChange={e => updateSlot(day, idx, 'startTime', e.target.value)}
                            style={{ display: 'block', width: '100%', padding: '0.5rem', border: '2px solid black', marginTop: '0.2rem' }}
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <label className="label-caps" style={{ fontSize: '0.6rem' }}>Duration</label>
                          <select 
                            value={slot.duration} 
                            onChange={e => updateSlot(day, idx, 'duration', Number(e.target.value))}
                            style={{ display: 'block', width: '100%', padding: '0.5rem', border: '2px solid black', marginTop: '0.2rem' }}
                          >
                            {DURATIONS.map(d => <option key={d} value={d}>{d} mins</option>)}
                          </select>
                        </div>
                        <div style={{ width: '150px' }}>
                          <label className="label-caps" style={{ fontSize: '0.6rem' }}>Type</label>
                          <select 
                            value={slot.type} 
                            onChange={e => updateSlot(day, idx, 'type', e.target.value)}
                            style={{ display: 'block', width: '100%', padding: '0.5rem', border: '2px solid black', marginTop: '0.2rem' }}
                          >
                            {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        {slot.type === 'Group' && (
                          <div style={{ width: '80px' }}>
                            <label className="label-caps" style={{ fontSize: '0.6rem' }}>Size</label>
                            <input 
                              type="number" 
                              value={slot.maxStudents} 
                              onChange={e => updateSlot(day, idx, 'maxStudents', Number(e.target.value))}
                              style={{ display: 'block', width: '100%', padding: '0.5rem', border: '2px solid black', marginTop: '0.2rem' }}
                            />
                          </div>
                        )}
                        <button 
                          onClick={() => removeSlot(day, idx)}
                          style={{ background: 'var(--primary-red)', color: 'white', border: '2px solid black', padding: '0.5rem', cursor: 'pointer', fontWeight: 900 }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
