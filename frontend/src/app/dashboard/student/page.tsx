'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { Job, Application, ReferralStatus, Notification } from '../../../types';

// ── Status helpers ───────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  'Pending':            '#F0C020',
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
  'Pending':            '#fef9c3',
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
const STATUS_ICON: Record<string, string> = {
  'Pending':            '⏳',
  'Under Review':       '🔍',
  'Approved':           '✓',
  'Referral Submitted': '📨',
  'Interview Scheduled':'📅',
  'Offer Received':     '🎉',
  'Rejected':           '✗',
  'Declined':           '✗',
  'Changes Requested':  '⚠',
  'Withdrawn':          '↩',
};

const SALARY_OPTIONS = ['₹0–5L', '₹5–10L', '₹10–15L', '₹15L+'];
const TIMELINE_OPTIONS = ['Applying this week', 'Applying next week', 'Just exploring'];
const COMMON_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Next.js', 'Express'];
const STUDENT_UPDATABLE: ReferralStatus[] = ['Interview Scheduled', 'Offer Received', 'Withdrawn'];

// ── Multi-step modal ─────────────────────────────────────────────
function ReferralModal({ job, referralId, onClose, onSuccess }: {
  job: Job; referralId: string; onClose: () => void; onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [whyThisRole, setWhyThisRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [salary, setSalary] = useState('');
  const [timeline, setTimeline] = useState('');
  const [questions, setQuestions] = useState('');

  const addSkill = (s: string) => { if (s && !skills.includes(s)) setSkills(prev => [...prev, s]); };
  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.patch(`/referrals/${referralId}/enrich`, {
        whyThisRole, relevantSkills: skills, expectedSalary: salary,
        applicationTimeline: timeline, studentQuestions: questions,
      });
      onSuccess();
      onClose();
    } catch { alert('Failed to submit. Please try again.'); }
    finally { setSaving(false); }
  };

  const stepValid = () => {
    if (step === 1) return whyThisRole.length >= 200;
    if (step === 2) return skills.length > 0;
    if (step === 3) return salary !== '' && timeline !== '';
    return true;
  };

  const STEPS = ['Why This Role?', 'Relevant Skills', 'Context', 'Review'];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', border: '4px solid black', boxShadow: '8px 8px 0 black', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ background: 'black', color: 'white', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#aaa', textTransform: 'uppercase' }}>Referral Request</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>{job.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '2px solid #666', color: 'white', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 900 }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', borderBottom: '3px solid black' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', background: step === i + 1 ? 'var(--primary-yellow)' : i + 1 < step ? '#f0f0f0' : 'white', borderRight: i < 3 ? '2px solid black' : 'none', color: step === i + 1 ? 'black' : '#888', cursor: i + 1 < step ? 'pointer' : 'default' }}
              onClick={() => { if (i + 1 < step) setStep(i + 1); }}>
              {i + 1 < step ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        <div style={{ padding: '2rem' }}>

          {/* Step 1: Why This Role */}
          {step === 1 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                Why are you interested in this role and why are you a good fit?
              </label>
              <textarea value={whyThisRole} onChange={e => setWhyThisRole(e.target.value)}
                placeholder="Explain your motivation, relevant experience, and why you'd excel in this role... (min 200 characters)"
                style={{ width: '100%', minHeight: '200px', padding: '1rem', border: '3px solid black', resize: 'vertical', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: whyThisRole.length >= 200 ? '#16a34a' : '#D02020', fontWeight: 700 }}>
                  {whyThisRole.length} / 200 min characters
                </span>
                {whyThisRole.length >= 200 && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ Minimum met</span>}
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Select your relevant skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {COMMON_SKILLS.map(s => (
                  <button key={s} onClick={() => skills.includes(s) ? removeSkill(s) : addSkill(s)}
                    style={{ padding: '0.4rem 0.9rem', border: '2px solid black', background: skills.includes(s) ? 'black' : 'white', color: skills.includes(s) ? 'white' : 'black', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                    {skills.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input value={customSkill} onChange={e => setCustomSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { addSkill(customSkill); setCustomSkill(''); }}}
                  placeholder="Add custom skill…" style={{ flex: 1, padding: '0.6rem', border: '2px solid black', fontSize: '0.9rem', outline: 'none' }}/>
                <button onClick={() => { addSkill(customSkill); setCustomSkill(''); }}
                  style={{ padding: '0.6rem 1.2rem', background: 'black', color: 'white', border: '2px solid black', cursor: 'pointer', fontWeight: 700 }}>Add</button>
              </div>
              {skills.length > 0 && (
                <div style={{ padding: '1rem', background: '#f0f0f0', border: '2px solid black' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Selected ({skills.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {skills.map(s => (
                      <span key={s} style={{ background: 'var(--primary-blue)', color: 'white', padding: '2px 10px', border: '2px solid black', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                        {s} ✕
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Context */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Expected Salary Range</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {SALARY_OPTIONS.map(o => (
                    <button key={o} onClick={() => setSalary(o)} style={{ padding: '0.6rem 1.2rem', border: '2px solid black', background: salary === o ? 'var(--primary-yellow)' : 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Application Timeline</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {TIMELINE_OPTIONS.map(o => (
                    <button key={o} onClick={() => setTimeline(o)} style={{ padding: '0.7rem 1rem', border: '2px solid black', background: timeline === o ? 'black' : 'white', color: timeline === o ? 'white' : 'black', cursor: 'pointer', fontWeight: 700, textAlign: 'left', fontSize: '0.9rem' }}>
                      {timeline === o ? '● ' : '○ '}{o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Questions for the Alumni <span style={{ color: '#888', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                <textarea value={questions} onChange={e => setQuestions(e.target.value)}
                  placeholder="Any specific questions about the role, the company, or the referral process?"
                  style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '2px solid black', resize: 'vertical', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', border: '3px solid black', background: '#fafafa' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Why This Role</p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{whyThisRole}</p>
              </div>
              <div style={{ padding: '1.5rem', border: '3px solid black', background: '#fafafa' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.75rem' }}>Skills ({skills.length})</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skills.map(s => <span key={s} style={{ background: 'var(--primary-blue)', color: 'white', padding: '2px 10px', border: '2px solid black', fontSize: '0.8rem', fontWeight: 700 }}>{s}</span>)}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '3px solid black', background: '#fafafa' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Expected Salary</p>
                  <p style={{ fontWeight: 900 }}>{salary}</p>
                </div>
                <div style={{ padding: '1rem', border: '3px solid black', background: '#fafafa' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Timeline</p>
                  <p style={{ fontWeight: 900 }}>{timeline}</p>
                </div>
              </div>
              {questions && (
                <div style={{ padding: '1rem', border: '3px solid black', background: '#fafafa' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Questions for Alumni</p>
                  <p style={{ fontSize: '0.9rem' }}>{questions}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn btn-outline" style={{ flex: 1 }}>← Back</button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn btn-primary" style={{ flex: 1 }} disabled={!stepValid()}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn btn-primary" style={{ flex: 1, background: '#16a34a' }} disabled={saving}>
                {saving ? 'Submitting…' : '🚀 Submit Referral Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Timeline modal ───────────────────────────────────────────────
function TimelineModal({ app, onClose, onUpdate }: { app: Application; onClose: () => void; onUpdate: () => void }) {
  const [updating, setUpdating] = useState(false);
  const ref = app.referral;

  if (!ref) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: 'white', padding: '2rem', border: '4px solid black' }}>
          <p>Initialising referral data...</p>
          <button onClick={onClose} className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Close</button>
        </div>
      </div>
    );
  }

  const events: { date: string; label: string; done: boolean }[] = [
    { date: app.appliedAt, label: 'Referral requested', done: true },
    { date: ref.updatedAt || '', label: 'Alumni reviewed your request', done: ref.status !== 'Pending' },
    { date: ref.approvedAt || '', label: '✓ Referral APPROVED', done: !!ref.approvedAt },
    { date: ref.submittedToCompanyAt || '', label: 'Referral submitted to company', done: !!ref.submittedToCompanyAt },
    { date: ref.interviewScheduledAt || '', label: 'Interview scheduled', done: !!ref.interviewScheduledAt },
    { date: ref.offerReceivedAt || '', label: '🎉 Offer received!', done: !!ref.offerReceivedAt },
  ].filter(e => e.done || e.label === '✓ Referral APPROVED');

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      await api.patch(`/referrals/${ref.id}/student-status`, { status });
      onUpdate();
      onClose();
    } catch { alert('Update failed. Please try again.'); }
    finally { setUpdating(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'white', border: '4px solid black', boxShadow: '8px 8px 0 black', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ background: 'black', color: 'white', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#aaa', textTransform: 'uppercase' }}>Application Timeline</p>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>{app.job?.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '2px solid #666', color: 'white', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 900 }}>✕</button>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Current status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', border: '3px solid black', background: STATUS_BG[ref.status] || '#f0f0f0' }}>
            <span style={{ fontSize: '1.5rem' }}>{STATUS_ICON[ref.status] || '?'}</span>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>Current Status</p>
              <p style={{ fontWeight: 900, fontSize: '1.1rem', color: STATUS_COLOR[ref.status] || 'black' }}>{ref.status}</p>
            </div>
          </div>

          {/* Alumni message if changes requested */}
          {ref.changesRequested && (
            <div style={{ padding: '1rem', border: '3px solid #ea580c', background: '#fff7ed', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ea580c', marginBottom: '0.4rem' }}>⚠ Alumni Requested Changes</p>
              <p style={{ fontSize: '0.9rem' }}>{ref.changesRequested}</p>
            </div>
          )}
          {ref.declineReason && (
            <div style={{ padding: '1rem', border: '3px solid #D02020', background: '#fee2e2', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D02020', marginBottom: '0.4rem' }}>✗ Declined — Reason</p>
              <p style={{ fontSize: '0.9rem' }}>{ref.declineReason}</p>
            </div>
          )}

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '2rem', marginBottom: '2rem' }}>
            <div style={{ position: 'absolute', left: '10px', top: '8px', bottom: '8px', width: '2px', background: '#ddd' }} />
            {events.map((e, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <div style={{ position: 'absolute', left: '-1.65rem', top: '2px', width: '14px', height: '14px', borderRadius: '50%', background: e.done ? 'black' : '#ddd', border: '2px solid black' }} />
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{e.label}</p>
                {e.date && <p style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
              </div>
            ))}
          </div>

          {/* Student-updatable statuses */}
          {['Approved', 'Referral Submitted'].includes(ref.status) && (
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Update Your Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {STUDENT_UPDATABLE.filter(s => {
                  if (s === 'Withdrawn') return true;
                  if (s === 'Interview Scheduled' && ref.status !== 'Interview Scheduled') return true;
                  if (s === 'Offer Received' && ref.status === 'Interview Scheduled') return true;
                  return false;
                }).map(s => (
                  <button key={s} onClick={() => handleStatusUpdate(s)} disabled={updating}
                    style={{ padding: '0.75rem 1rem', border: '2px solid black', background: s === 'Withdrawn' ? '#fee2e2' : 'var(--primary-yellow)', cursor: 'pointer', fontWeight: 700, textAlign: 'left', fontSize: '0.9rem' }}>
                    {updating ? 'Updating…' : `→ Mark as "${s}"`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function StudentDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'applications'>('discover');

  // Modal state
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [modalReferralId, setModalReferralId] = useState<string | null>(null);
  const [timelineApp, setTimelineApp] = useState<Application | null>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const studentId = payload.userId;
      const [jobsData, appsData, notifsData] = await Promise.all([
        api.get<Job[]>('/jobs'),
        api.get<Application[]>(`/applications/student/${studentId}`),
        api.get<Notification[]>(`/notifications/${studentId}`)
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
    if (!token || role !== 'Student') { router.push('/login'); return; }
    (async () => { await loadData(); })();
  }, [router, loadData]);

  const applyForJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const { application, referral } = await api.post<{ application: Application; referral: { id: string } }>(
        '/applications', { studentId: payload.userId, jobId }, token
      );
      await loadData();
      // Open multi-step modal immediately
      const job = jobs.find(j => j.id === jobId)!;
      setModalJob(job);
      setModalReferralId(referral.id);
      void application;
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to apply');
    }
  };

  const openReferralModal = (app: Application) => {
    if (!app.referral || !app.job) return;
    setModalJob(app.job);
    setModalReferralId(app.referral.id);
  };

  const filteredApps = statusFilter === 'All'
    ? applications
    : applications.filter(a => (a.referral?.status || 'Pending') === statusFilter);

  const allStatuses = ['All', ...Array.from(new Set(applications.map(a => a.referral?.status || 'Pending')))];

  if (loading) return (
    <div className="text-gradient" style={{ textAlign: 'center', padding: '10rem', fontWeight: 900, fontSize: '1.5rem' }}>
      SYNCING OPPORTUNITIES…
    </div>
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* ── TOP NAVIGATION ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', borderBottom: '6px solid black', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3rem', lineHeight: 1 }}>STUDENT DASHBOARD</h1>
          <p className="label-caps" style={{ color: 'var(--primary-blue)', fontWeight: 900 }}>WELCOME BACK, CANDIDATE</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Activity indicators */}
          <div style={{ display: 'flex', gap: '0.8rem', marginRight: '2rem' }}>
            {notifications.slice(0, 3).map((n, i) => (
              <div key={n.id} 
                onClick={() => setShowNotifications(true)}
                style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', 
                  border: n.isRead ? '2px solid #ccc' : '4px solid var(--primary-red)', 
                  padding: '3px', cursor: 'pointer', transition: 'transform 0.2s'
                }}>
                <div style={{ 
                  width: '100%', height: '100%', borderRadius: '50%', 
                  background: i === 0 ? 'var(--primary-blue)' : i === 1 ? 'var(--primary-yellow)' : 'var(--primary-red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '0.8rem', border: '2px solid black'
                }}>
                  {n.title.charAt(0)}
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
                  <h4 className="label-caps" style={{ color: 'black', margin: 0 }}>Notifications</h4>
                  <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 900 }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '1rem', border: '2px solid black', background: n.isRead ? '#fafafa' : 'var(--primary-yellow)', boxShadow: n.isRead ? 'none' : '4px 4px 0 black' }}>
                      <p style={{ fontWeight: 900, fontSize: '0.85rem' }}>{n.title.toUpperCase()}</p>
                      <p style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => router.push('/mentorship')} className="btn btn-outline" style={{ border: '3px solid black', background: 'var(--primary-yellow)' }}>🎓 MENTORS</button>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="btn btn-outline" style={{ border: '3px solid black' }}>✕ LOGOUT</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem', alignItems: 'flex-start' }}>
        
        {/* ── LEFT SIDEBAR ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2rem' }}>
          
          <div style={{ border: '4px solid black', background: 'white', boxShadow: '12px 12px 0 black', padding: '2.5rem' }}>
            <div style={{ 
              width: '120px', height: '120px', background: 'var(--primary-blue)', 
              border: '4px solid black', marginBottom: '2rem', transform: 'rotate(-3deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '4rem', fontWeight: 900, color: 'white'
            }}>
              S
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem' }}>Student Profile</h2>
            <p className="label-caps" style={{ marginBottom: '2rem' }}>Engineering Major / Senior</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '3px solid black', paddingTop: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{applications.length}</p>
                <p className="label-caps" style={{ fontSize: '0.6rem' }}>Requests</p>
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{applications.filter(a => a.referral?.status === 'Approved').length}</p>
                <p className="label-caps" style={{ fontSize: '0.6rem' }}>Success</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', border: '4px solid black', background: 'var(--primary-yellow)' }}>
             <h4 className="label-caps" style={{ marginBottom: '1rem', color: 'black' }}>Activity Feed</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.slice(0, 4).map(app => (
                  <div key={app.id} style={{ padding: '0.75rem', background: 'white', border: '2px solid black', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 900 }}>{app.job?.title.toUpperCase()}</span>
                    <p style={{ fontSize: '0.7rem', color: '#666' }}>Status updated to {app.referral?.status || 'Pending'}</p>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '3rem', marginBottom: '4rem' }}>
            {(['discover', 'applications'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '1rem 0',
                  borderBottom: activeTab === tab ? '10px solid black' : 'none',
                  opacity: activeTab === tab ? 1 : 0.4,
                  fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em'
                }}>
                {tab === 'discover' ? 'Discover Jobs' : 'My Applications'}
              </button>
            ))}
          </div>

          {/* ── DISCOVER ── */}
          {activeTab === 'discover' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3rem' }}>
              {jobs.map(job => {
                const applied = applications.some(a => a.jobId === job.id);
                return (
                  <article key={job.id} className="hover-lift" style={{ border: '4px solid black', background: 'white', padding: '2.5rem', boxShadow: '8px 8px 0 black' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>{job.title}</h3>
                      <div style={{ width: '15px', height: '15px', background: 'var(--primary-blue)', border: '2px solid black' }}></div>
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.4, marginBottom: '3rem', color: '#444' }}>{job.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '3px solid black', paddingTop: '1.5rem' }}>
                      <div>
                        <p className="label-caps" style={{ marginBottom: '0.3rem' }}>Application Deadline</p>
                        <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{new Date(job.deadline).toLocaleDateString().toUpperCase()}</p>
                      </div>
                      {applied ? (
                        <button onClick={() => { const app = applications.find(a => a.jobId === job.id); if (app) setTimelineApp(app); }}
                          className="btn btn-outline" style={{ background: 'var(--primary-yellow)' }}>
                          VIEW STATUS
                        </button>
                      ) : (
                        <button onClick={() => applyForJob(job.id)} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                          APPLY NOW →
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* ── MY APPLICATIONS ── */}
          {activeTab === 'applications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {allStatuses.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    style={{ 
                      padding: '0.8rem 1.5rem', border: '3px solid black', 
                      background: statusFilter === s ? 'black' : 'white', 
                      color: statusFilter === s ? 'white' : 'black', 
                      cursor: 'pointer', fontWeight: 900, fontSize: '0.8rem',
                      boxShadow: statusFilter === s ? 'none' : '4px 4px 0 black',
                      transform: statusFilter === s ? 'translate(2px, 2px)' : 'none'
                    }}>
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>

              {filteredApps.map(app => {
                const ref = app.referral;
                const st  = ref?.status || 'Pending';
                return (
                  <article key={app.id} 
                    onClick={() => setTimelineApp(app)}
                    style={{ 
                      border: '4px solid black', background: 'white', padding: '2rem 3rem', 
                      boxShadow: '10px 10px 0 black', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                    <div>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{app.job?.title}</h3>
                      <p className="label-caps">Applied On: {new Date(app.appliedAt).toLocaleDateString().toUpperCase()}</p>
                      {ref?.changesRequested && (
                        <p style={{ color: 'var(--primary-red)', fontWeight: 900, fontSize: '0.8rem', marginTop: '0.5rem' }}>⚠ CHANGES REQUIRED</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                         <p className="label-caps" style={{ marginBottom: '0.3rem' }}>Application Status</p>
                         <span style={{ 
                           background: STATUS_BG[st], border: '3px solid black', 
                           padding: '0.5rem 1.5rem', fontWeight: 900, fontSize: '0.9rem' 
                         }}>
                           {st.toUpperCase()}
                         </span>
                      </div>
                      {ref && ['Changes Requested', 'Pending'].includes(st) && (
                        <button onClick={e => { e.stopPropagation(); openReferralModal(app); }} className="btn btn-primary">
                          EDIT DETAILS
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {modalJob && modalReferralId && (
        <ReferralModal job={modalJob} referralId={modalReferralId}
          onClose={() => { setModalJob(null); setModalReferralId(null); }}
          onSuccess={loadData} />
      )}
      {timelineApp && (
        <TimelineModal app={timelineApp}
          onClose={() => setTimelineApp(null)}
          onUpdate={loadData} />
      )}
    </div>
  );
}
