# Reunify 

> **Bridging the Alumni-Student Gap with Architectural Design & Clean Code.**

Reunify is a modern, high-fidelity networking ecosystem built for university networks. It implements **Domain-Driven Design (DDD)** and a custom **Bauhaus-inspired design system** to provide a premium experience for mentorship, job referrals, and community engagement.

---

###  Live Production Links
- **Frontend App**: [https://reunify-plum.vercel.app/](https://reunify-plum.vercel.app/)
- **Backend API**: [https://reunify-eycx.onrender.com/api](https://reunify-eycx.onrender.com/api)
- **Health Status**: [https://reunify-eycx.onrender.com/api/health](https://reunify-eycx.onrender.com/api/health)

---

###  Core Pillars
- **Geometric Bauhaus UI**: A custom design system following high-contrast, bold-border aesthetics (Red, Blue, Yellow).
- **Clean Architecture**: Orchestrated via Domain Entities, Services, and Repositories for maximum scalability.
- **Direct Referrals**: Students skip the ATS through verified alumni-driven job boards.
- **Mentorship Hub**: Professional 1-on-1 mentorship request flow with real-time status tracking.

---

###  Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Vanilla CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB Cloud (Atlas) |
| **ORM** | Prisma |
| **Auth** | JWT (JSON Web Tokens) with Role-Based Access Control |

---

###  Repository Structure
```
reunify/
├── backend/          # RESTful API with DDD Pattern
│   ├── src/
│   │   ├── domain/     # Logic-pure Entities (User, Job, Referral)
│   │   ├── services/   # Business processes & Application logic
│   │   ├── controllers/# Express entry points
│   │   └── data/       # Prisma Repository implementations
├── frontend/         # Bauhaus Next.js Application
│   ├── src/
│   │   ├── app/        # Bauhaus Layouts & Interactive Pages
│   │   ├── lib/        # API Orchestration
│   │   └── types/      # Global Type definitions
└── *.md              # Mermaid Documentation & Blueprints
```

---

###  Documentation & Blueprints
Explore the architectural diagrams inside the repository root:
- [Entity-Relationship Diagram](./ErDiagram.md)
- [Class Hierarchy](./classDiagram.md)
- [Sequence Workflows](./sequenceDiagram.md)
- [User Case Flow](./useCaseDiagram.md)

---

###  Getting Started Locally

1. **Clone the Repo**
2. **Backend**: `cd backend && npm install && npx prisma generate && npm run dev`
3. **Frontend**: `cd frontend && npm install && npm run dev`