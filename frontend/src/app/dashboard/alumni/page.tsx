'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { Job, Application, Notification } from '../../../types';

const STATUS_COLOR: Record<string, string> = {
  'Pending':            '#d97706',
  'Under Review':       '#1040C0',
  'Approved':           '#16a34a',
  'Referral Submitted': '#16a34a',
  'Interview Scheduled':'#7c3aed',
  'Offer Received':     '#059669',
  'Rejected':           '#D02020',
  'Declined':           '#D02020',
  'Changes Requested':  '#ea580c',
  'Withdrawn':          '#6b7280',
};
const STATUS_BG: Record<string, string> = {
  'Pending':            '#fef3c7',
  'Under Review':       '#dbeafe',
  'Approved':           '#dcfce7',
  'Referral Submitted': '#dcfce7',
  'Interview Scheduled':'#ede9fe',
  'Offer Received':     '#d1fae5',
  'Rejected':           '#fee2e2',
  'Declined':           '#fee2e2',
  'Changes Requested':  '#ffedd5',
  'Withdrawn':          '#f3f4f6',
};

const DECLINE_REASONS = [
  "Skills don't match",
  'Not hiring currently',
  'Resume needs improvement',
  'Position already filled',
  'Other',
];

// ── Detail Modal ─────────────────────────────────────────────────
function DetailModal({ app, onClose, onAction }: {
  app: Application; onClose: () => void; onAction: () => void;
}) {
  const ref = app.referral!;
  const [processing, setProcessing] = useState(false);
  const [view, setView] = useState<'detail' | 'decline' | 'changes'>('detail');
  const [declineReason, setDeclineReason] = useState('');
  const [changesMsg, setChangesMsg] = useState('');

  useEffect(() => {
    // Mark as Under Review when alumni opens it
    if (ref.status === 'Pending') {
      api.patch(`/referrals/${ref.id}/under-review`, {}).catch(() => {});
    }
  }, [ref.id, ref.status]);

  const doAction = async (action: () => Promise<unknown>) => {
    setProcessing(true);
    try { await action(); onAction(); onClose(); }
    catch { alert('Action failed. Please try again.'); }
    finally { setProcessing(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', border: '4px solid black', boxShadow: '8px 8px 0 black', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: 'black', color: 'white', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#aaa', textTransform: 'uppercase' }}>Referral Request Detail</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>{app.student?.name} → {app.job?.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '2px solid #666', color: 'white', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 900 }}>✕</button>
        </div>

        {/* Sub-nav */}
        <div style={{ display: 'flex', borderBottom: '3px solid black' }}>
          {(['detail', 'decline', 'changes'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ flex: 1, padding: '0.75rem', border: 'none', borderRight: v !== 'changes' ? '2px solid black' : 'none', background: view === v ? (v === 'decline' ? '#fee2e2' : v === 'changes' ? '#ffedd5' : 'var(--primary-yellow)') : 'white', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
              {v === 'detail' ? '📋 Details' : v === 'decline' ? '✗ Decline' : '⚠ Request Changes'}
            </button>
          ))}
        </div>

        <div style={{ padding: '2rem' }}>

          {/* ── DETAIL VIEW ── */}
          {view === 'detail' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Student info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', border: '3px solid black' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.4rem' }}>Student</p>
                  <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{app.student?.name}</p>
                  {app.student?.university && <p style={{ fontSize: '0.85rem', color: '#555' }}>{app.student.university} {app.student?.course ? `· ${app.student.course}` : ''}</p>}
                  {app.student?.graduationYear && <p style={{ fontSize: '0.8rem', color: '#888' }}>Grad {app.student.graduationYear}</p>}
                </div>
                <div style={{ padding: '1.25rem', border: '3px solid black' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.4rem' }}>Application Context</p>
                  <p style={{ fontWeight: 700 }}>📅 {ref.applicationTimeline || 'Not specified'}</p>
                  <p style={{ fontWeight: 700, marginTop: '0.3rem' }}>₹ {ref.expectedSalary || 'Not specified'}</p>
                  <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>Requested {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Why this role */}
              {ref.whyThisRole ? (
                <div style={{ padding: '1.5rem', border: '3px solid black', background: '#fafafa' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.75rem' }}>Why This Role</p>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{ref.whyThisRole}</p>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', border: '3px dashed #ccc', textAlign: 'center' }}>
                  <p style={{ color: '#888' }}>Student has not yet filled in the referral context form.</p>
                </div>
              )}

              {/* Skills */}
              {ref.relevantSkills && ref.relevantSkills.length > 0 && (
                <div style={{ padding: '1.25rem', border: '3px solid black' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.75rem' }}>Skills ({ref.relevantSkills.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {ref.relevantSkills.map(s => (
                      <span key={s} style={{ background: 'var(--primary-blue)', color: 'white', padding: '3px 12px', border: '2px solid black', fontSize: '0.8rem', fontWeight: 700 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Student questions */}
              {ref.studentQuestions && (
                <div style={{ padding: '1.25rem', border: '3px solid black', background: '#fef9c3' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.4rem' }}>Questions from Student</p>
                  <p style={{ fontSize: '0.95rem' }}>{ref.studentQuestions}</p>
                </div>
              )}

              {/* Approve button */}
              {!['Approved', 'Declined', 'Withdrawn', 'Rejected'].includes(ref.status) && (
                <button disabled={processing} onClick={() => doAction(() => api.put(`/referrals/${ref.id}/approve`, {}))}
                  style={{ width: '100%', padding: '1.25rem', background: '#16a34a', color: 'white', border: '3px solid black', boxShadow: '5px 5px 0 black', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>
                  {processing ? 'Processing…' : '✓ Approve — I Will Submit This Referral'}
                </button>
              )}
              {ref.status === 'Approved' && (
                <div style={{ padding: '1.25rem', background: '#dcfce7', border: '3px solid #16a34a', textAlign: 'center', fontWeight: 900, color: '#16a34a', fontSize: '1.1rem' }}>
                  ✓ Referral Approved
                </div>
              )}
            </div>
          )}

          {/* ── DECLINE VIEW ── */}
          {view === 'decline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>Please select a reason for declining this referral request:</p>
              {DECLINE_REASONS.map(r => (
                <button key={r} onClick={() => setDeclineReason(r)}
                  style={{ padding: '0.85rem 1.25rem', border: `2px solid ${declineReason === r ? 'black' : '#ccc'}`, background: declineReason === r ? '#fee2e2' : 'white', cursor: 'pointer', fontWeight: 700, textAlign: 'left', fontSize: '0.9rem' }}>
                  {declineReason === r ? '● ' : '○ '}{r}
                </button>
              ))}
              <button disabled={!declineReason || processing} onClick={() => doAction(() => api.patch(`/referrals/${ref.id}/decline`, { reason: declineReason }))}
                style={{ padding: '1.1rem', background: '#D02020', color: 'white', border: '3px solid black', boxShadow: '4px 4px 0 black', cursor: declineReason ? 'pointer' : 'not-allowed', fontWeight: 900, fontSize: '1rem', opacity: declineReason ? 1 : 0.5 }}>
                {processing ? 'Declining…' : '✗ Confirm Decline'}
              </button>
            </div>
          )}

          {/* ── REQUEST CHANGES VIEW ── */}
          {view === 'changes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>What would you like the student to improve or clarify?</p>
              <textarea value={changesMsg} onChange={e => setChangesMsg(e.target.value)}
                placeholder="Be specific — e.g. 'Please add more detail about your React experience and include a GitHub link'"
                style={{ width: '100%', minHeight: '160px', padding: '1rem', border: '3px solid black', resize: 'vertical', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
              <button disabled={changesMsg.length < 20 || processing} onClick={() => doAction(() => api.patch(`/referrals/${ref.id}/request-changes`, { message: changesMsg }))}
                style={{ padding: '1.1rem', background: '#ea580c', color: 'white', border: '3px solid black', boxShadow: '4px 4px 0 black', cursor: changesMsg.length >= 20 ? 'pointer' : 'not-allowed', fontWeight: 900, fontSize: '1rem', opacity: changesMsg.length >= 20 ? 1 : 0.5 }}>
                {processing ? 'Sending…' : '⚠ Send Change Request'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Alumni Dashboard ────────────────────────────────────────
export default function AlumniDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'requests'>('jobs');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [impactStats] = useState({
    totalSessions: 12,
    uniqueStudents: 8,
    avgRating: 4.9,
    successStories: 3
  });

  // New job form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const loadData = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const alumniId = payload.userId;
      const [jobsData, appsData, notifsData] = await Promise.all([
        api.get<Job[]>(`/jobs/alumni/${alumniId}`),
        api.get<Application[]>(`/applications/alumni/${alumniId}`),
        api.get<Notification[]>(`/notifications/${alumniId}`)
      ]);
      setJobs(jobsData);
      setApplications(appsData);
      setNotifications(notifsData);
    } catch (err) { console.error('Load error:', err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role  = typeof window !== 'undefined' ? localStorage.getItem('role')  : null;
    if (!token || role !== 'Alumni') { router.push('/login'); return; }
    (async () => { await loadData(); })();
  }, [router, loadData]);

  const handleApprove = async (referralId: string) => {
    setProcessingId(referralId);
    try { await api.put(`/referrals/${referralId}/approve`, {}); await loadData(); }
    catch { alert('Approval failed. Please check your connection.'); }
    finally { setProcessingId(null); }
  };

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      await api.post('/jobs', { alumniId: payload.userId, title, description, deadline }, token);
      setShowModal(false); setTitle(''); setDescription(''); setDeadline('');
      await loadData();
    } catch (err: unknown) { alert((err as Error).message || 'Failed to post job'); }
  };

  if (loading) return (
    <div className="text-gradient" style={{ textAlign: 'center', padding: '10rem', fontWeight: 900, fontSize: '1.5rem' }}>
      SYNCING WORKSPACE…
    </div>
  );

  const incomingCount = applications.filter(a => ['Pending', 'Under Review'].includes(a.referral?.status || '')).length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* ── TOP NAVIGATION ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', borderBottom: '6px solid black', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3rem', lineHeight: 1 }}>ALUMNI DASHBOARD</h1>
          <p className="label-caps" style={{ color: 'var(--primary-red)', fontWeight: 900 }}>WELCOME BACK, MENTOR</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.8rem', marginRight: '2rem' }}>
            {[
              { label: 'POST', color: 'black', action: () => setShowModal(true) },
              { label: 'CAL', color: 'var(--primary-blue)', action: () => router.push('/dashboard/alumni/mentorship-settings') },
              { label: 'APP', color: 'var(--primary-red)', action: () => setActiveTab('requests') }
            ].map((n, i) => (
              <div key={i} 
                onClick={n.action}
                style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', 
                  border: '4px solid black', padding: '3px', cursor: 'pointer', transition: 'transform 0.2s'
                }}>
                <div style={{ 
                  width: '100%', height: '100%', borderRadius: '50%', 
                  background: n.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '0.7rem'
                }}>
                  {n.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="btn btn-outline" style={{ border: '3px solid black' }}>
              🔔 {notifications.filter(n => !n.isRead).length}
            </button>
            {showNotifications && (
              <div className="glass-card shadow-bauhaus-lg" style={{ position: 'absolute', top: '120%', right: 0, width: '350px', zIndex: 110, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h4 className="label-caps" style={{ color: 'black', margin: 0 }}>Recent Activity</h4>
                  <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 900 }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '1rem', border: '2px solid black', background: n.isRead ? '#fafafa' : 'var(--primary-red)', color: n.isRead ? 'black' : 'white' }}>
                      <p style={{ fontWeight: 900, fontSize: '0.85rem' }}>{n.title.toUpperCase()}</p>
                      <p style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="btn btn-outline" style={{ border: '3px solid black' }}>✕ LOGOUT</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem', alignItems: 'flex-start' }}>
        
        {/* ── LEFT SIDEBAR ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2rem' }}>
          
          <div style={{ border: '4px solid black', background: 'white', boxShadow: '12px 12px 0 black', padding: '2.5rem' }}>
            <div style={{ 
              width: '120px', height: '120px', background: 'var(--primary-red)', 
              border: '4px solid black', marginBottom: '2rem', transform: 'rotate(3deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '4rem', fontWeight: 900, color: 'white'
            }}>
              A
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem' }}>Alumni Admin</h2>
            <p className="label-caps" style={{ marginBottom: '2rem' }}>Network Catalyst / Google</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '3px solid black', paddingTop: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{impactStats.totalSessions}</p>
                <p className="label-caps" style={{ fontSize: '0.6rem' }}>Sessions</p>
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{impactStats.successStories}</p>
                <p className="label-caps" style={{ fontSize: '0.6rem' }}>Hires</p>
              </div>
            </div>
          </div>

          <div style={{ border: '4px solid black', background: 'var(--primary-blue)', color: 'white', padding: '1.5rem' }}>
             <p className="label-caps" style={{ color: 'white', marginBottom: '1rem' }}>Dashboard Stats</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>PENDING REQUESTS</span>
                   <span style={{ fontWeight: 900 }}>{incomingCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>TOTAL REFERRALS</span>
                   <span style={{ fontWeight: 900 }}>{jobs.length}</span>
                </div>
             </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '3rem', marginBottom: '4rem' }}>
            {(['jobs', 'requests'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '1rem 0',
                  borderBottom: activeTab === tab ? '6px solid black' : 'none',
                  opacity: activeTab === tab ? 1 : 0.4,
                  fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em'
                }}>
                {tab === 'jobs' ? 'Postings' : 'Inbox'}
              </button>
            ))}
          </div>

          {/* ── JOBS TAB ── */}
          {activeTab === 'jobs' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
              <div 
                onClick={() => setShowModal(true)}
                style={{ border: '4px dashed black', background: 'var(--bg-color)', padding: '2.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                 <span style={{ fontSize: '3rem', fontWeight: 900 }}>+</span>
                 <p className="label-caps">Post New Referral</p>
              </div>
              {jobs.map(job => (
                <article key={job.id} className="hover-lift" style={{ border: '4px solid black', background: 'white', padding: '2.5rem', boxShadow: '8px 8px 0 black' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1 }}>{job.title}</h3>
                    <div style={{ width: '15px', height: '15px', background: 'var(--primary-yellow)', border: '2px solid black' }}></div>
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: 1.4, marginBottom: '3rem', color: '#444' }}>{job.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '3px solid black', paddingTop: '1.5rem' }}>
                    <div>
                      <p className="label-caps" style={{ marginBottom: '0.3rem' }}>Deadline</p>
                      <p style={{ fontWeight: 900, fontSize: '1rem' }}>{new Date(job.deadline).toLocaleDateString().toUpperCase()}</p>
                    </div>
                    <span style={{ background: 'black', color: 'white', padding: '0.4rem 1rem', fontWeight: 900, fontSize: '0.7rem' }}>ACTIVE</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ── REQUESTS TAB ── */}
          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {applications.map(app => {
                const ref = app.referral;
                const st  = ref?.status || 'Pending';
                const hasContext = !!(ref?.whyThisRole);
                return (
                  <article key={app.id} 
                    onClick={() => { setDetailApp(app); }}
                    style={{ 
                      border: '4px solid black', background: 'white', padding: '2rem 2.5rem', 
                      boxShadow: '10px 10px 0 black', cursor: 'pointer',
                      display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center'
                    }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '48px', height: '48px', background: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', flexShrink: 0 }}>
                           {(app.student?.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                           <h3 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.student?.name}</h3>
                           <p className="label-caps" style={{ color: 'var(--primary-blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Target: {app.job?.title.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      {hasContext ? (
                        <p style={{ fontSize: '0.95rem', borderLeft: '4px solid black', paddingLeft: '1.2rem', color: '#444', fontStyle: 'italic', lineHeight: 1.5 }}>
                          &quot;{ref.whyThisRole?.slice(0, 150)}...&quot;
                        </p>
                      ) : (
                        <p className="label-caps" style={{ color: '#888', fontSize: '0.75rem' }}>WAITING FOR CONTEXT</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
                       <div style={{ 
                         background: STATUS_BG[st], border: '3px solid black', 
                         padding: '0.6rem 1rem', fontWeight: 900, fontSize: '0.8rem', textAlign: 'center'
                       }}>
                         {st.toUpperCase()}
                       </div>
                       <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem', border: '3px solid black' }}>VIEW APPLICATION</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {detailApp && detailApp.referral && (
        <DetailModal app={detailApp}
          onClose={() => setDetailApp(null)}
          onAction={loadData} />
      )}

      {/* New Job Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card shadow-bauhaus-lg" style={{ width: '100%', maxWidth: '600px', padding: '4rem', background: 'white', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 900 }}>✕</button>
            <h2 className="heading-display" style={{ fontSize: '3rem', marginBottom: '3rem' }}>CREATE NEW REFERRAL</h2>
            <form onSubmit={createJob} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label className="label-caps" style={{ color: 'black' }}>JOB TITLE</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="E.G. SOFTWARE ENGINEER" style={{ width: '100%', padding: '1.2rem', border: '3px solid black', fontWeight: 900, textTransform: 'uppercase' }}/>
              </div>
              <div>
                <label className="label-caps" style={{ color: 'black' }}>JOB DESCRIPTION</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="BRIEF THE NETWORK ON THE ROLE..." style={{ width: '100%', padding: '1.2rem', border: '3px solid black', minHeight: '150px', fontWeight: 700, fontFamily: 'inherit' }}/>
              </div>
              <div>
                <label className="label-caps" style={{ color: 'black' }}>DEADLINE</label>
                <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} style={{ width: '100%', padding: '1.2rem', border: '3px solid black', fontWeight: 900 }}/>
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1.5rem' }}>POST REFERRAL</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1, padding: '1.5rem' }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}