import 'dotenv/config';
import { createApp } from './app';

// Repositories
import { PrismaUserRepository } from './data/repositories/PrismaUserRepository';
import { PrismaJobRepository } from './data/repositories/PrismaJobRepository';
import { PrismaApplicationRepository } from './data/repositories/PrismaApplicationRepository';
import { PrismaReferralRepository } from './data/repositories/PrismaReferralRepository';
import { PrismaPostRepository } from './data/repositories/PrismaPostRepository';
import { PrismaMentorshipRepository } from './data/repositories/PrismaMentorshipRepository';

// Services
import { AuthService } from './services/AuthService';
import { JobService } from './services/JobService';
import { ApplicationService } from './services/ApplicationService';
import { ReferralService } from './services/ReferralService';
import { PostService } from './services/PostService';
import { MentorshipService } from './services/MentorshipService';

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
const mentorshipRepository = new PrismaMentorshipRepository();

// 2. Initialize Services (Business Logic Layer / Domain Layer)
const authService = new AuthService(userRepository);
const jobService = new JobService(jobRepository);
const applicationService = new ApplicationService(applicationRepository, jobRepository);
const referralService = new ReferralService(referralRepository, applicationRepository);
const postService = new PostService(postRepository);
const mentorshipService = new MentorshipService(mentorshipRepository, userRepository);

// 3. Initialize Controllers (Presentation Layer)
const authController = new AuthController(authService);
const jobController = new JobController(jobService);
const applicationController = new ApplicationController(applicationService, referralService);
const postController = new PostController(postService);
const mentorshipController = new MentorshipController(mentorshipService);

// 4. Create App
const app = createApp(authController, jobController, applicationController, postController, mentorshipController);

// 5. Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Reunify Backend Server is running on port ${PORT}`);
    console.log(`Using MongoDB Cloud Data Storage via Prisma. Follows strict OOP & Clean Architecture.`);
});
