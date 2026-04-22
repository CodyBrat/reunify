# ER Diagram – Reunify

```mermaid
erDiagram

    USERS {
        string id PK
        string name
        string email
        string password
        string role
        datetime created_at
    }

    STUDENT_PROFILES {
        string id PK
        string user_id FK
        string university
        string course
        int graduation_year
    }

    ALUMNI_PROFILES {
        string id PK
        string user_id FK
        string company
        string designation
        int experience_years
        boolean is_verified
    }

    JOBS {
        string id PK
        string alumni_id FK
        string title
        string description
        date deadline
        string status
        datetime created_at
    }

    APPLICATIONS {
        string id PK
        string student_id FK
        string job_id FK
        string status
        datetime applied_at
    }

    REFERRALS {
        string id PK
        string application_id FK
        string alumni_id FK
        string status
        datetime decision_date
    }

    OFFICE_HOURS {
        string id PK
        string alumni_id FK
        string timezone
        boolean enabled
        json weekly_schedule
    }

    MENTORSHIP_SESSIONS {
        string id PK
        string student_id FK
        string alumni_id FK
        datetime scheduled_at
        string status
        string meeting_link
    }

    %% Relationships

    USERS ||--|| STUDENT_PROFILES : has
    USERS ||--|| ALUMNI_PROFILES : has

    ALUMNI_PROFILES ||--o{ JOBS : posts
    STUDENT_PROFILES ||--o{ APPLICATIONS : submits
    JOBS ||--o{ APPLICATIONS : receives

    APPLICATIONS ||--|| REFERRALS : generates
    ALUMNI_PROFILES ||--o{ REFERRALS : reviews

    ALUMNI_PROFILES ||--|| OFFICE_HOURS : configures
    STUDENT_PROFILES ||--o{ MENTORSHIP_SESSIONS : books
    ALUMNI_PROFILES ||--o{ MENTORSHIP_SESSIONS : hosts
