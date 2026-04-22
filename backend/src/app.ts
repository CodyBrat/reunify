import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AuthController } from './controllers/AuthController';
import { JobController } from './controllers/JobController';
import { ApplicationController } from './controllers/ApplicationController';
import { PostController } from './controllers/PostController';
import { MentorshipController } from './controllers/MentorshipController';

export function createApp(
    authController: AuthController,
    jobController: JobController,
    applicationController: ApplicationController,
    postController: PostController,
    mentorshipController: MentorshipController
): Express {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json({ limit: '5mb' })); // larger limit for base64 resume if needed

    // Health
    app.get('/api/health', (req, res) => res.json({ status: 'healthy', database: 'connected' }));

    // Auth
    app.post('/api/auth/register/student', authController.registerStudent);
    app.post('/api/auth/register/alumni', authController.registerAlumni);
    app.post('/api/auth/login', authController.login);
    app.get('/api/mentors/:id', mentorshipController.getMentorDetails);

    // Jobs
    app.post('/api/jobs', jobController.postJob);
    app.get('/api/jobs', jobController.getOpenJobs);
    app.get('/api/jobs/alumni/:alumniId', jobController.getAlumniJobs);

    // Applications
    app.post('/api/applications', applicationController.applyForJob);
    app.get('/api/applications/alumni/:alumniId', applicationController.getAlumniApplications);
    app.get('/api/applications/student/:studentId', applicationController.getStudentApplications);

    // Referral lifecycle
    app.put('/api/referrals/:referralId/approve',          applicationController.approveReferral);
    app.patch('/api/referrals/:referralId/enrich',         applicationController.enrichReferral);
    app.patch('/api/referrals/:referralId/under-review',   applicationController.markUnderReview);
    app.patch('/api/referrals/:referralId/decline',        applicationController.declineReferral);
    app.patch('/api/referrals/:referralId/request-changes',applicationController.requestChanges);
    app.patch('/api/referrals/:referralId/student-status', applicationController.updateStudentStatus);

    // Posts
    app.post('/api/posts', postController.createPost);
    app.get('/api/posts', postController.getPosts);
    app.put('/api/posts/:postId/like', postController.likePost);

    // Mentorship & Office Hours
    app.get('/api/mentorships/mentors',              mentorshipController.getAllMentors); // This will need updating in controller if kept
    app.get('/api/mentorships/office-hours/:alumniId', mentorshipController.getOfficeHours);
    app.patch('/api/mentorships/office-hours/:alumniId', mentorshipController.updateOfficeHours);
    app.get('/api/mentorships/available/:alumniId',     mentorshipController.getAvailableSlots);
    app.post('/api/mentorships/book',                  mentorshipController.bookSession);
    app.get('/api/mentorships/student/:studentId',      mentorshipController.getStudentSessions);
    app.get('/api/mentorships/alumni/:alumniId',        mentorshipController.getAlumniSessions);
    app.get('/api/mentorships/sessions/:sessionId',     mentorshipController.getSessionDetails);
    app.patch('/api/mentorships/sessions/:sessionId/status', mentorshipController.updateSessionStatus);
    app.patch('/api/mentorships/sessions/:sessionId/link', mentorshipController.updateMeetingLink);
    app.post('/api/mentorships/sessions/:sessionId/feedback', mentorshipController.submitFeedback);

    // Notifications
    app.get('/api/notifications/:userId',         mentorshipController.getNotifications);
    app.patch('/api/notifications/:id/read',       mentorshipController.markNotificationRead);

    return app;
}
