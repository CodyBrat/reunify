'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { UserProfile } from '../../../types';

export default function MentorshipBookingPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    expertise: '',
    company: '',
    availability: 'any'
  });

  const loadMentors = useCallback(async () => {
    try {
      const data = await api.get<UserProfile[]>('/mentorships/mentors');
      setMentors(data);
    } catch {
      console.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMentors();
  }, [loadMentors]);

  const filteredMentors = mentors.filter(m => {
    const matchExpertise = !filters.expertise || m.designation?.toLowerCase().includes(filters.expertise.toLowerCase());
    const matchCompany = !filters.company || m.company?.toLowerCase().includes(filters.company.toLowerCase());
    return matchExpertise && matchCompany;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Connecting Network...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '4rem' }}>
        <button onClick={() => router.back()} style={{ marginBottom: '1rem', background: 'none', border: 'none', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem' }}>← Back</button>
        <h1 className="heading-display">Book Mentorship</h1>
        <p style={{ color: 'var(--text-muted)' }}>Find an alumni to guide your career path.</p>
      </header>

      {/* Filters */}
      <section className="glass-card" style={{ marginBottom: '3rem', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div>
          <label className="label-caps">Role/Expertise</label>
          <input 
            type="text" 
            placeholder="e.g. Product Manager" 
            value={filters.expertise}
            onChange={e => setFilters({...filters, expertise: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '3px solid black', marginTop: '0.5rem' }}
          />
        </div>
        <div>
          <label className="label-caps">Company</label>
          <input 
            type="text" 
            placeholder="e.g. Google" 
            value={filters.company}
            onChange={e => setFilters({...filters, company: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '3px solid black', marginTop: '0.5rem' }}
          />
        </div>
        <div>
          <label className="label-caps">Availability</label>
          <select 
            value={filters.availability}
            onChange={e => setFilters({...filters, availability: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '3px solid black', marginTop: '0.5rem', fontWeight: 700 }}
          >
            <option value="any">Any Availability</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
          </select>
        </div>
      </section>

      {/* Mentor Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--primary-yellow)', border: '4px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '2rem', boxShadow: '4px 4px 0 black' }}>
                {mentor.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.2rem' }}>{mentor.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{mentor.designation}</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{mentor.company}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.75rem', fontWeight: 700 }}>
              <div style={{ background: '#f5f5f5', padding: '0.5rem', border: '2px solid black' }}>★ 4.9/5</div>
              <div style={{ background: '#f5f5f5', padding: '0.5rem', border: '2px solid black' }}>24 Sessions</div>
            </div>

            <button 
              onClick={() => router.push(`/mentorship/book/${mentor.id}`)}
              className="btn btn-primary" 
              style={{ width: '100%' }}
            >
              VIEW SLOTS & BOOK
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
