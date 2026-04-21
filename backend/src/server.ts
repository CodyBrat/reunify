import 'dotenv/config';
import { createApp } from './app';

// Repositories
import { PrismaUserRepository } from './data/repositories/PrismaUserRepository';
import { PrismaJobRepository } from './data/repositories/PrismaJobRepository';
import { PrismaApplicationRepository } from './data/repositories/PrismaApplicationRepository';
import { PrismaReferralRepository } from './data/repositories/PrismaReferralRepository';
import { PrismaPostRepository } from './data/repositories/PrismaPostRepository';
import { PrismaOfficeHoursRepository } from './data/repositories/PrismaOfficeHoursRepository';
import { PrismaMentorshipSessionRepository } from './data/repositories/PrismaMentorshipSessionRepository';
import { PrismaNotificationRepository } from './data/repositories/PrismaNotificationRepository';

// Services
import { AuthService } from './services/AuthService';
import { JobService } from './services/JobService';
import { ApplicationService } from './services/ApplicationService';
import { ReferralService } from './services/ReferralService';
import { PostService } from './services/PostService';
import { MentorshipSessionService } from './services/MentorshipSessionService';
import { NotificationService } from './services/NotificationService';

// Controllers
import { AuthController } from './controllers/AuthController';
import { JobController } from './controllers/JobController';
import { ApplicationController } from './controllers/ApplicationController';
import { PostController } from './controllers/PostController';
import { MentorshipController } from './controllers/MentorshipController';

// 1. Initialize Repositories (Data Access Layer) -> Prisma
const userRepository = new PrismaUserRepository();
const jobRepository = new PrismaJobRepository();
const applicationRepository = new PrismaApplicationRepository();
const referralRepository = new PrismaReferralRepository();
const postRepository = new PrismaPostRepository();
const officeHoursRepository = new PrismaOfficeHoursRepository();
const mentorshipSessionRepository = new PrismaMentorshipSessionRepository();
const notificationRepository = new PrismaNotificationRepository();

// 2. Initialize Services (Business Logic Layer / Domain Layer)
const authService = new AuthService(userRepository);
const jobService = new JobService(jobRepository);
const applicationService = new ApplicationService(applicationRepository, jobRepository);
const referralService = new ReferralService(referralRepository, applicationRepository);
const postService = new PostService(postRepository);
const mentorshipSessionService = new MentorshipSessionService(mentorshipSessionRepository, officeHoursRepository, userRepository);
const notificationService = new NotificationService(notificationRepository);

// 3. Initialize Controllers (Presentation Layer)
const authController = new AuthController(authService);
const jobController = new JobController(jobService);
const applicationController = new ApplicationController(applicationService, referralService);
const postController = new PostController(postService);
const mentorshipController = new MentorshipController(mentorshipSessionService, notificationService);

// 4. Create App
const app = createApp(authController, jobController, applicationController, postController, mentorshipController);

// 5. Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Reunify Backend Server is running on port ${PORT}`);
    console.log(`Using MongoDB Cloud Data Storage via Prisma. Follows strict OOP & Clean Architecture.`);
});
