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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* ── TOP NAVIGATION ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', borderBottom: '6px solid black', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3rem', lineHeight: 1 }}>Discover Mentors</h1>
          <p className="label-caps" style={{ color: 'var(--primary-blue)', fontWeight: 900 }}>Find Your Ideal Mentor</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={() => router.back()} className="btn btn-outline" style={{ border: '3px solid black' }}>✕ CLOSE</button>
        </div>
      </header>

      {/* Filters: Bauhaus Style */}
      <section style={{ 
        marginBottom: '4rem', padding: '2.5rem', border: '4px solid black', background: 'white', 
        boxShadow: '10px 10px 0 black', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' 
      }}>
        <div>
          <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Role or Expertise</label>
          <input 
            type="text" 
            placeholder="e.g. Product Manager" 
            value={filters.expertise}
            onChange={e => setFilters({...filters, expertise: e.target.value})}
            style={{ width: '100%', padding: '1rem', border: '3px solid black', fontWeight: 700 }}
          />
        </div>
        <div>
          <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Company</label>
          <input 
            type="text" 
            placeholder="e.g. Google" 
            value={filters.company}
            onChange={e => setFilters({...filters, company: e.target.value})}
            style={{ width: '100%', padding: '1rem', border: '3px solid black', fontWeight: 700 }}
          />
        </div>
        <div>
          <label className="label-caps" style={{ color: 'black', marginBottom: '0.8rem', display: 'block' }}>Availability</label>
          <select 
            value={filters.availability}
            onChange={e => setFilters({...filters, availability: e.target.value})}
            style={{ width: '100%', padding: '1rem', border: '3px solid black', fontWeight: 900 }}
          >
            <option value="any">Any Availability</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
          </select>
        </div>
      </section>

      {/* Mentor Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
        {filteredMentors.map(mentor => (
          <article key={mentor.id} className="hover-lift" style={{ border: '4px solid black', background: 'white', padding: '2.5rem', boxShadow: '12px 12px 0 black' }}>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '100px', height: '100px', background: 'var(--primary-yellow)', 
                border: '4px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 900, fontSize: '3rem', transform: 'rotate(-3deg)'
              }}>
                {mentor.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem' }}>{mentor.name}</h3>
                <p className="label-caps" style={{ color: 'var(--primary-blue)', marginBottom: '0.3rem' }}>{(mentor.designation || 'Alumni').toUpperCase()}</p>
                <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{(mentor.company || 'Private Node').toUpperCase()}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ padding: '1rem', border: '3px solid black', textAlign: 'center', background: '#fafafa' }}>
                 <p className="label-caps" style={{ fontSize: '0.6rem' }}>Rating</p>
                 <p style={{ fontWeight: 900, fontSize: '1.2rem' }}>★ 4.9</p>
              </div>
              <div style={{ padding: '1rem', border: '3px solid black', textAlign: 'center', background: '#fafafa' }}>
                 <p className="label-caps" style={{ fontSize: '0.6rem' }}>Sessions Hosted</p>
                 <p style={{ fontWeight: 900, fontSize: '1.2rem' }}>24</p>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/mentorship/book/${mentor.id}`)}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.5rem' }}
            >
              Book Session →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
