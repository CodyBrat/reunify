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
}

export interface Referral {
  id: string;
  status: 'Requested' | 'Approved' | 'Rejected';
  decisionDate?: string;
  applicationId: string;
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
    name: string;
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

export interface Mentorship {
  id: string;
  studentId: string;
  alumniId: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  studentName?: string;
  alumniName?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
}
