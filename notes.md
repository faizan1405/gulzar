# Shadi Mubarak — Matrimonial Site Notes & Mind Map

This file contains the mind map of the project, details of the folder structure, and key development notes.

---

## 1. Project Mind Map

The mind map below visualizes the architectural components, core integrations, user flows, and database relations of the Shadi Mubarak Matrimonial Site.

```mermaid
graph TD
    %% Styling and Classes
    classDef main fill:#f9f6f0,stroke:#d4af37,stroke-width:2px,color:#2c3e50;
    classDef database fill:#e8f4f8,stroke:#2980b9,stroke-width:2px,color:#2c3e50;
    classDef external fill:#fbf2ea,stroke:#e67e22,stroke-width:2px,color:#2c3e50;
    classDef flow fill:#f0fbf4,stroke:#27ae60,stroke-width:1.5px,color:#2c3e50;
    classDef api fill:#f5f0fb,stroke:#8e44ad,stroke-width:1.5px,color:#2c3e50;

    %% Primary Nodes
    App[Shadi Mubarak Web Application]:::main
    DB[(MongoDB Atlas via Prisma)]:::database
    Auth[NextAuth v5 Google Login / Simulator]:::external
    Razorpay[Razorpay Payments / Sandbox Simulator]:::external

    %% Relations
    App --> Auth
    App --> DB
    App --> Razorpay

    %% Database Models Subgraph
    subgraph Data Models (schema.prisma)
        User[User Model]
        Profile[MatrimonialProfile]
        Purchase[PackagePurchase]
        CuratedLead[CuratedLeadAssignment]
        VerifyRequest[VerificationRequest]
        Audit[AuditLog]

        User --> Profile
        Profile --> Purchase
        Profile --> CuratedLead
        Profile --> VerifyRequest
        User --> Audit
    end

    %% Application Flows Subgraph
    subgraph User Journey & UI Flow
        direction TB
        Onboard[Onboarding Wizard<br/>5 Steps + Theme Choice]:::flow
        VerifyLock[Manual Phone Verification<br/>Status: PENDING/APPROVED]:::flow
        Paywall[Subscription Paywall<br/>18% GST + Blurred View]:::flow
        Directory[Profile Directory<br/>Search, Filter & Theme Styling]:::flow

        Onboard --> VerifyLock
        VerifyLock --> Paywall
        Paywall --> Directory
    end

    %% Route Endpoints Subgraph
    subgraph API Route Endpoints (src/app/api)
        direction LR
        ApiAuth[api/auth<br/>NextAuth endpoints]:::api
        ApiPayment[api/payment/order & verify<br/>Razorpay Checkout & Webhooks]:::api
        ApiProfile[api/profile<br/>CRUD & Completion Verification]:::api
        ApiAdmin[api/admin/verification & packages<br/>Approvals & Settings]:::api
    end

    App --> Onboard
    App --> ApiAuth
    App --> ApiPayment
    App --> ApiProfile
    App --> ApiAdmin

    %% Scripts Subgraph
    subgraph Utility Scripts
        direction LR
        BackupScript[backup.ts<br/>Database Backups]
        SeedScript[seed.ts<br/>Seeding 25-30 Profiles]
        CleanupScript[cleanup.ts<br/>Safe Demo Data Cleanup]
    end

    DB -.-> SeedScript
    DB -.-> CleanupScript
    DB -.-> BackupScript
```

---

## 2. Folder Structure

Below is the structured layout of the project, mapping out key files and their purposes.

```text
Gulzar bhai/
├── prisma/
│   └── schema.prisma         # Prisma schema defining User, Account, Session, VerificationToken, MatrimonialProfile, PackagePurchase, CuratedLeadAssignment, VerificationRequest, and AuditLog models
├── public/                   # Static assets (images, icons, theme assets, SVG patterns)
├── scripts/                  # Database utility scripts
│   ├── backup.ts             # Script to backup the database before migrations or seeding
│   ├── cleanup.ts            # Script to clean up seeded demo data safely
│   └── seed.ts               # Seeding script populating 25-30 realistic, structured profiles
├── src/
│   ├── app/
│   │   ├── api/              # API Route Handlers (endpoints)
│   │   │   ├── admin/        # Admin endpoints
│   │   │   │   ├── packages/ # Handles admin package updates
│   │   │   │   └── verification/ # Handles admin verification actions
│   │   │   ├── auth/         # NextAuth.js catch-all endpoints
│   │   │   ├── payment/      # Razorpay payment endpoints
│   │   │   │   ├── order/    # Creates new Razorpay orders (with 18% GST)
│   │   │   │   └── verify/   # Cryptographically verifies Razorpay signatures/callbacks
│   │   │   ├── profile/      # Handles profile CRUD and status updates
│   │   │   └── upload/       # Profile picture file/base64 uploads
│   │   ├── favicon.ico       # Site icon
│   │   ├── globals.css       # Global styling rules, premium typography, and 8 color theme HSL mappings
│   │   ├── layout.tsx        # Next.js global layout wrapper with fonts and metadata
│   │   └── page.tsx          # Core Page Component containing Onboarding Wizard, Directory, Admin Control panel, and Simulator views
│   ├── components/           # Reusable UI component blocks
│   │   └── NikahComponents.tsx # Custom components (Header, Footer, Profile Card, Details Modal, Onboarding Wizard steps, Admin Queue, Simulator Controls)
│   ├── auth.ts               # NextAuth.js configurations, provider registration, and middleware helpers
│   └── lib/                  # Library/Utility functions
│       ├── db.ts             # Global Prisma Client instance initialization
│       ├── packages.ts       # Packages config metadata and structures
│       └── profileStore.ts   # fallbacks, local storage mock data system & state management
├── .env                      # Application environment variables (MongoDB URL, NextAuth secrets, Google Client IDs)
├── .env.example              # Template for environment configuration
├── .gitignore                # Git untracked file settings
├── AGENTS.md                 # Rules & conventions for AI coding agents
├── CLAUDE.md                 # Developer shortcuts and general CLI instructions
├── eslint.config.mjs         # ESLint layout configurations
├── next-env.d.ts             # Next.js TypeScript environment declarations
├── next.config.ts            # Next.js compiler/bundler configurations
├── package.json              # Project dependencies, script configurations, and node engines
├── PROJECT_NOTES.md          # Approved business rules, pricing tiers, design updates, and development log
└── tsconfig.json             # TypeScript configurations
```

---

## 3. Key Development & Business Notes

### Billing & Pricing Models
* **GST Rate**: A flat rate of **18% GST** must be dynamically appended to all transactions.
* **Standard Monthly Membership**: ₹300 Base + ₹54 GST = **₹354**. Allows users to view unblurred photos & phone numbers.
* **Curated Profiles**: ₹5,500 Base + ₹990 GST = **₹6,490**. Success fee of ₹21,000 on marriage.
* **Second-Marriage Profiles**: ₹11,000 Base + ₹1,980 GST = **₹12,980**.
* **High-Profile Matches**: ₹21,000 Base + ₹3,780 GST = **₹24,780**. Success fee of ₹25,000 on marriage.

### Privacy & Verification Rules
1. **Manual Verification**: Profiles start with status `PENDING` and must be approved by an Admin via telephone verification before they become visible in directory searches.
2. **Privacy Masking**: Unauthenticated users or non-paying users will see blurred profile pictures and masked contact details (phone numbers, email).
3. **Audit Log Trail**: Every change in verification status is audited inside the `AuditLog` table, tracking the admin actor, the target profile, and timestamp.

### Theme & Branding
* The design uses a premium **marriage-card/invitation aesthetic** featuring soft cream backgrounds, refined gold borders, and Islamic geometric SVGs.
* Supports **8 Custom Themes** mapping HSL styling variables globally (e.g. Emerald, Crimson, Gold, Sapphire, Plum, Teal, Terracotta, and Amber).
