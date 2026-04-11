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

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());

    // Health Check
    app.get('/api/health', (req, res) => res.json({ status: 'healthy', database: 'connected' }));

    // Routes

    // Auth
    app.post('/api/auth/register/student', authController.registerStudent);
    app.post('/api/auth/register/alumni', authController.registerAlumni);
    app.post('/api/auth/login', authController.login);

    // Jobs
    app.post('/api/jobs', jobController.postJob);
    app.get('/api/jobs', jobController.getOpenJobs);
    app.get('/api/jobs/alumni/:alumniId', jobController.getAlumniJobs);

    // Applications / Referrals
    app.post('/api/applications', applicationController.applyForJob);
    app.get('/api/applications/alumni/:alumniId', applicationController.getAlumniApplications);
    app.get('/api/applications/student/:studentId', applicationController.getStudentApplications);
    app.put('/api/referrals/:referralId/approve', applicationController.approveReferral);

    // Posts
    app.post('/api/posts', postController.createPost);
    app.get('/api/posts', postController.getPosts);
    app.put('/api/posts/:postId/like', postController.likePost);

    // Mentorship
    app.post('/api/mentorships', mentorshipController.requestMentorship);
    app.get('/api/mentorships/mentors', mentorshipController.getAllMentors);
    app.get('/api/mentorships/student/:studentId', mentorshipController.getStudentMentorships);
    app.get('/api/mentorships/alumni/:alumniId', mentorshipController.getAlumniMentorships);
    app.put('/api/mentorships/:mentorshipId/status', mentorshipController.updateStatus);

    return app;
}
