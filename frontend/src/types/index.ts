export type ReferralStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Referral Submitted'
  | 'Interview Scheduled'
  | 'Offer Received'
  | 'Rejected'
  | 'Declined'
  | 'Changes Requested'
  | 'Withdrawn';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Alumni';
  company?: string;
  designation?: string;
  university?: string;
  course?: string;
  graduationYear?: number;
}

export interface Job {
  id: string;
  alumniId: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Open' | 'Closed';
  createdAt: string;
  alumni?: { name: string; company?: string; designation?: string };
}

export interface Referral {
  id: string;
  status: ReferralStatus;
  decisionDate?: string;
  applicationId: string;

  // Student context
  whyThisRole?: string;
  relevantSkills?: string[];
  expectedSalary?: string;
  applicationTimeline?: string;
  studentQuestions?: string;

  // Alumni response
  declineReason?: string;
  changesRequested?: string;

  // Timestamps
  approvedAt?: string;
  submittedToCompanyAt?: string;
  interviewScheduledAt?: string;
  offerReceivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  status: string;
  appliedAt: string;
  studentId: string;
  jobId: string;
  job?: Job;
  referral?: Referral;
  student?: {
    id?: string;
    name: string;
    university?: string;
    course?: string;
    graduationYear?: number;
  };
}

export interface Post {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

export interface OfficeHours {
  id: string;
  alumniId: string;
  enabled: boolean;
  timezone: string;
  weeklySchedule?: {
    day: string;
    slots: Array<{
      startTime: string;
      duration: number;
      type: '1-on-1' | 'Group' | 'Drop-in';
      maxStudents: number;
    }>;
  }[];
  blackoutDates: string[];
  preferences?: {
    maxSessionsPerWeek: number;
    minAdvanceBooking: number;
    expertiseAreas: string[];
  };
}

export interface MentorshipSession {
  id: string;
  alumniId: string;
  studentIds: string[];
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type: '1-on-1' | 'Group' | 'Drop-in';
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  
  // Pre-session
  message?: string;
  topics: string[];
  questions?: Array<{ studentId: string; questions: string[] }>;
  materials?: Array<{ studentId: string; resumeUrl?: string; portfolioUrl?: string }>;
  
  // Post-session
  sessionNotes?: string;
  actionItems?: Array<{ studentId: string; tasks: string[] }>;
  feedback?: Array<{ 
    studentId: string; 
    rating: number; 
    takeaways: string;
    wouldBookAgain: boolean;
  }>;
  alumniSummary?: string;
  followUpNeeded: boolean;
  
  createdAt: string;
  updatedAt: string;

  // UI Helpers
  alumniName?: string;
  studentNames?: string[];
  alumni?: { name: string; company?: string; designation?: string };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}


export interface AuthResponse {
  token: string;
  role: string;
  name: string;
}
