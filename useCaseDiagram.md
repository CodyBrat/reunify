# Use Case Diagram – Reunify

```mermaid
flowchart LR

%% Actors
Student([Student])
Alumni([Alumni])
Admin([Admin])

%% System Boundary
subgraph Reunify_System [Reunify System]

    %% Student Use Cases
    UC1((Register))
    UC2((Login))
    UC3((Update Profile))
    UC4((Browse Job Listings))
    UC5((Search Jobs))
    UC6((Apply for Job))
    UC7((Request Referral))
    UC8((Track Application Status))
    UC21((Book Mentorship Session))
    UC22((Join Live Session))
    UC23((Submit Session Feedback))
    UC9((Logout))

    %% Alumni Use Cases
    UC10((Post Job))
    UC11((Edit Job))
    UC12((Delete Job))
    UC13((View Applications))
    UC14((Review Referral Request))
    UC15((Approve Referral))
    UC16((Reject Referral))
    UC24((Set Office Hours))
    UC25((Manage Session Notes))
    UC26((Host Live Session))

    %% Admin Use Cases
    UC17((Verify Alumni Account))
    UC18((Manage Users))
    UC19((Remove Job Post))
    UC20((View System Data))

end

%% Student Associations
Student --> UC1
Student --> UC2
Student --> UC3
Student --> UC4
Student --> UC5
Student --> UC6
Student --> UC7
Student --> UC8
Student --> UC21
Student --> UC22
Student --> UC23
Student --> UC9

%% Alumni Associations
Alumni --> UC1
Alumni --> UC2
Alumni --> UC3
Alumni --> UC10
Alumni --> UC11
Alumni --> UC12
Alumni --> UC13
Alumni --> UC14
Alumni --> UC15
Alumni --> UC16
Alumni --> UC24
Alumni --> UC25
Alumni --> UC26
Alumni --> UC9

%% Admin Associations
Admin --> UC2
Admin --> UC17
Admin --> UC18
Admin --> UC19
Admin --> UC20
Admin --> UC9

%% Include / Extend Relationships
UC6 -->|includes| UC7
UC14 -->|extends| UC15
UC14 -->|extends| UC16
UC21 -->|includes| UC24
