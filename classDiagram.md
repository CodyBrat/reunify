# Class Diagram – Reunify

```mermaid
classDiagram

%% ========================
%% Core Domain Classes
%% ========================

class User {
    +String id
    +String name
    +String email
    +String password
    +String role
    +login()
    +logout()
}

class Student {
    +String university
    +String course
    +String graduationYear
    +applyForJob()
    +requestReferral()
}

class Alumni {
    +String company
    +String designation
    +postJob()
    +reviewReferral()
}

class Admin {
    +verifyAlumni()
    +manageUsers()
}

User <|-- Student
User <|-- Alumni
User <|-- Admin


%% ========================
%% Job & Application Domain
%% ========================

class Job {
    +String id
    +String title
    +String description
    +Date deadline
    +String status
}

class Application {
    +String id
    +Date appliedDate
    +String status
}

class Referral {
    +String id
    +String status
    +Date decisionDate
}

Student "1" --> "0..*" Application : submits
Job "1" --> "0..*" Application : receives
Application "1" --> "1" Referral : generates
Alumni "1" --> "0..*" Job : posts


%% ========================
%% Service Layer
%% ========================

class AuthService {
    +login()
    +register()
}

class ApplicationService {
    +applyForJob()
}

class ReferralService {
    +createReferral()
    +approveReferral()
    +rejectReferral()
}

ApplicationService --> Application
ApplicationService --> Job
ReferralService --> Referral


%% ========================
%% Repository Layer
%% ========================

class UserRepository {
    +save()
    +findById()
}

class JobRepository {
    +save()
    +findById()
}

class ApplicationRepository {
    +save()
    +update()
}

class ReferralRepository {
    +save()
    +update()
}

AuthService --> UserRepository
ApplicationService --> ApplicationRepository
ApplicationService --> JobRepository
ReferralService --> ReferralRepository
