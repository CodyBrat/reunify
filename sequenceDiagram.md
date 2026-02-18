# Sequence Diagram – Job Application & Referral Flow

```mermaid
sequenceDiagram

actor Student
actor Alumni
participant Frontend
participant AuthController
participant ApplicationController
participant ApplicationService
participant ReferralService
participant ApplicationRepository
participant ReferralRepository
participant Database

%% --- Login Flow ---

Student->>Frontend: Enter credentials
Frontend->>AuthController: POST /login
activate AuthController
AuthController->>Database: Validate user credentials
Database-->>AuthController: User data
AuthController-->>Frontend: Return JWT token
deactivate AuthController

%% --- Apply for Job ---

Student->>Frontend: Click "Apply for Job"
Frontend->>ApplicationController: POST /apply
activate ApplicationController
ApplicationController->>ApplicationService: applyForJob(studentId, jobId)
activate ApplicationService

ApplicationService->>Database: Check job exists
Database-->>ApplicationService: Job data

ApplicationService->>Database: Check existing application
Database-->>ApplicationService: Validation result

ApplicationService->>ApplicationRepository: Save application
activate ApplicationRepository
ApplicationRepository->>Database: Insert application
Database-->>ApplicationRepository: Success
deactivate ApplicationRepository

ApplicationService->>ReferralService: createReferral(applicationId)
activate ReferralService
ReferralService->>ReferralRepository: Save referral (status = Requested)
activate ReferralRepository
ReferralRepository->>Database: Insert referral
Database-->>ReferralRepository: Success
deactivate ReferralRepository
deactivate ReferralService

ApplicationService-->>ApplicationController: Success response
deactivate ApplicationService
ApplicationController-->>Frontend: Application submitted
deactivate ApplicationController

%% --- Alumni Reviews & Approves Referral ---

Alumni->>Frontend: Approve referral
Frontend->>ApplicationController: PUT /referral/approve
activate ApplicationController
ApplicationController->>ReferralService: approveReferral(referralId)
activate ReferralService
ReferralService->>ReferralRepository: Update status to "Referred"
activate ReferralRepository
ReferralRepository->>Database: Update referral
Database-->>ReferralRepository: Success
deactivate ReferralRepository
ReferralService-->>ApplicationController: Approval success
deactivate ReferralService
ApplicationController-->>Frontend: Referral approved
deactivate ApplicationController
