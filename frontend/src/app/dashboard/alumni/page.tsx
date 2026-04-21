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

  const incomingCount  = applications.filter(a => ['Pending', 'Under Review', 'Changes Requested'].includes(a.referral?.status || '')).length;
  const pendingOnly    = applications.filter(a => a.referral?.status?.toLowerCase() === 'pending');
  const enrichedCount  = applications.filter(a => a.referral?.whyThisRole).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3rem' }}>Alumni Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Empower the next generation with referrals.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ background: 'none', border: '3px solid black', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              🔔 {notifications.filter(n => !n.isRead).length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary-red)', width: '15px', height: '15px', borderRadius: '50%', color: 'white', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{notifications.filter(n => !n.isRead).length}</span>}
            </button>
            {showNotifications && (
              <div className="glass-card" style={{ position: 'absolute', top: '100%', right: 0, width: '300px', zIndex: 100, marginTop: '0.5rem', padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                <h4 className="label-caps" style={{ marginBottom: '1rem' }}>Notifications</h4>
                {notifications.length === 0 ? <p style={{ fontSize: '0.8rem', color: '#888' }}>No new updates</p> : 
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 900, fontSize: '0.8rem' }}>{n.title}</p>
                      <p style={{ fontSize: '0.75rem', color: '#555' }}>{n.message}</p>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          <button onClick={() => router.push('/dashboard/alumni/mentorship-settings')} className="btn btn-outline" style={{ border: '3px solid black' }}>⚙️ Set Availability</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>+ New Referral</button>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="btn btn-outline" style={{ border: '3px solid black' }}>Logout</button>
        </div>
      </header>

      {/* Mentorship Impact */}
      <section style={{ marginBottom: '3rem', padding: '2rem', border: '4px solid black', background: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '100%', background: 'var(--primary-blue)', opacity: 0.1, transform: 'skewX(-20deg) translateX(50px)' }} />
        <h2 className="heading-section" style={{ marginBottom: '1.5rem', position: 'relative' }}>Your Mentorship Impact</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
          {[
            { label: 'Sessions Conducted', value: impactStats.totalSessions, icon: '🎓' },
            { label: 'Students Mentored', value: impactStats.uniqueStudents, icon: '👥' },
            { label: 'Avg Rating', value: `${impactStats.avgRating}/5`, icon: '★' },
            { label: 'Success Stories', value: impactStats.successStories, icon: '🎉' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{s.icon} {s.value}</p>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginTop: '0.4rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Pending Action', value: incomingCount, color: 'var(--primary-yellow)', bg: '#fef9c3' },
          { label: 'With Context Filled', value: enrichedCount, color: 'var(--primary-blue)', bg: '#dbeafe' },
          { label: 'Total Postings', value: jobs.length, color: 'black', bg: '#f0f0f0' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1.5rem', border: '3px solid black', background: s.bg, boxShadow: '4px 4px 0 black' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '0.4rem' }}>{s.label}</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '4px solid black' }}>
        <button onClick={() => setActiveTab('jobs')}
          style={{ padding: '1.5rem 1rem', background: 'none', border: 'none', color: activeTab === 'jobs' ? 'black' : '#888', borderBottom: activeTab === 'jobs' ? '8px solid var(--primary-blue)' : 'none', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase' }}>
          My Postings ({jobs.length})
        </button>
        <button onClick={() => setActiveTab('requests')}
          style={{ padding: '1.5rem 1rem', background: 'none', border: 'none', color: activeTab === 'requests' ? 'black' : '#888', borderBottom: activeTab === 'requests' ? '8px solid var(--primary-red)' : 'none', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase' }}>
          Referral Requests ({incomingCount} pending)
        </button>
      </div>

      {/* ── JOBS TAB ── */}
      {activeTab === 'jobs' && (
        <>
          {jobs.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '6rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>You haven&apos;t posted any referrals yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
              {jobs.map(job => (
                <div key={job.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>{job.title}</h3>
                    <span style={{ background: 'var(--primary-yellow)', color: 'black', padding: '4px 10px', border: '2px solid black', fontSize: '0.65rem', fontWeight: 900 }}>{job.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', minHeight: '60px' }}>{job.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid black', paddingTop: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>Deadline</span>
                    <span style={{ fontWeight: 900 }}>{new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── REQUESTS TAB ── */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '6rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your inbox is clean! No referral requests yet.</p>
            </div>
          ) : applications.map(app => {
            const ref = app.referral;
            const st  = ref?.status || 'Pending';
            const hasContext = !!(ref?.whyThisRole);
            return (
              <div key={app.id} className="glass-card" style={{ padding: '2rem 2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    {/* Student + Job row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '42px', height: '42px', background: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>
                        {(app.student?.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 900, fontSize: '1.15rem', textTransform: 'uppercase' }}>{app.student?.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#888' }}>
                          For <span style={{ fontWeight: 700, color: 'black', textDecoration: 'underline' }}>{app.job?.title}</span>
                          {app.student?.university && <span style={{ marginLeft: '0.5rem' }}>· {app.student.university}</span>}
                        </p>
                      </div>
                    </div>

                    {/* Preview of Why This Role */}
                    {hasContext && ref?.whyThisRole && (
                      <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.75rem', borderLeft: '3px solid var(--primary-blue)', paddingLeft: '0.75rem', fontStyle: 'italic' }}>
                        &quot;{ref.whyThisRole.slice(0, 120)}{ref.whyThisRole.length > 120 ? '…' : ''}&quot;
                      </p>
                    )}
                    {!hasContext && (
                      <p style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 700, marginTop: '0.5rem' }}>⏳ Waiting for student to fill referral context</p>
                    )}

                    {/* Skills preview */}
                    {ref?.relevantSkills && ref.relevantSkills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.75rem' }}>
                        {ref.relevantSkills.slice(0, 5).map(s => (
                          <span key={s} style={{ background: '#f0f0f0', border: '1.5px solid black', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{s}</span>
                        ))}
                        {ref.relevantSkills.length > 5 && <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 700 }}>+{ref.relevantSkills.length - 5} more</span>}
                      </div>
                    )}
                  </div>

                  {/* Right side: status + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', minWidth: '160px' }}>
                    <span style={{ background: STATUS_BG[st] || '#f0f0f0', color: STATUS_COLOR[st] || 'black', padding: '5px 12px', border: `2px solid ${STATUS_COLOR[st] || 'black'}`, fontWeight: 900, fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {st}
                    </span>
                    <p style={{ fontSize: '0.72rem', color: '#888' }}>{new Date(app.appliedAt).toLocaleDateString()}</p>

                    {!['Approved', 'Declined', 'Withdrawn', 'Rejected'].includes(st) && (
                      <>
                        <button onClick={() => { setDetailApp(app); }} className="btn btn-outline" style={{ border: '2px solid black', fontSize: '0.75rem', padding: '0.5rem 1rem', width: '100%' }}>
                          VIEW DETAILS
                        </button>
                        {hasContext && (
                          <button disabled={processingId === ref?.id} onClick={() => ref && handleApprove(ref.id)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', width: '100%', background: '#16a34a' }}>
                            {processingId === ref?.id ? 'APPROVING…' : '✓ APPROVE'}
                          </button>
                        )}
                      </>
                    )}
                    {st === 'Approved' && (
                      <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 14px', border: '2px solid #16a34a', fontWeight: 900, fontSize: '0.75rem' }}>✓ APPROVED</div>
                    )}
                    {st === 'Declined' && (
                      <div style={{ background: '#fee2e2', color: '#D02020', padding: '6px 14px', border: '2px solid #D02020', fontWeight: 900, fontSize: '0.75rem' }}>✗ DECLINED</div>
                    )}
                  </div>
                </div>

                {/* "Pending for X days" warning */}
                {st === 'Pending' && (() => {
                  const days = Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000);
                  return days >= 2 ? (
                    <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#fef3c7', border: '2px solid #d97706', fontSize: '0.78rem', fontWeight: 700, color: '#92400e' }}>
                      ⚠ Pending for {days} day{days > 1 ? 's' : ''} — please review soon
                    </div>
                  ) : null;
                })()}
              </div>
            );
          })}

          {pendingOnly.length === 0 && applications.length > 0 && (
            <div style={{ padding: '1.5rem', border: '3px solid #16a34a', background: '#dcfce7', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
              ✓ All referral requests have been actioned!
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detailApp && detailApp.referral && (
        <DetailModal app={detailApp}
          onClose={() => setDetailApp(null)}
          onAction={loadData} />
      )}

      {/* New Job Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
            <h2 className="heading-section" style={{ marginBottom: '2rem' }}>Post New Referral</h2>
            <form onSubmit={createJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label-caps">Job Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Software Engineer" style={{ width: '100%', padding: '0.85rem', border: '2px solid black', marginTop: '0.5rem', fontSize: '0.95rem', outline: 'none' }}/>
              </div>
              <div>
                <label className="label-caps">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role and what you're looking for…" style={{ width: '100%', padding: '0.85rem', border: '2px solid black', minHeight: '120px', marginTop: '0.5rem', resize: 'vertical', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
              </div>
              <div>
                <label className="label-caps">Deadline</label>
                <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} style={{ width: '100%', padding: '0.85rem', border: '2px solid black', marginTop: '0.5rem', fontSize: '0.95rem', outline: 'none' }}/>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>POST JOB</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
