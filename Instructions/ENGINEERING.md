# ENGINEERING.md

## Objective

Build a production-quality full-stack Reading Metrics Dashboard.

Prioritize:

* Maintainability
* Clean architecture
* Clear separation of concerns
* Simple but scalable data model

Avoid overengineering.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* React Query (TanStack Query)
* Recharts
* React Hook Form
* Zod

## Backend

* Node.js
* Express (or Fastify)
* TypeScript

## Database

* SQLite (local development + simplicity)
* Prisma ORM (recommended)

## Package Manager

* npm

---

# Architecture Overview

Use a strict 3-layer architecture:

```text
/client   → React frontend
/server   → Node.js backend API
/shared   → Shared types + schemas
```

---

# Core Principle

Frontend must NEVER:

* Access database directly
* Call external APIs directly
* Contain business logic for analytics

All data access flows through the backend.

---

# Database Design

## Choice: SQLite + Prisma

This project uses:

* SQLite for local development (simple, file-based DB)
* Prisma ORM for schema management and queries

This combination provides:

* Zero setup overhead
* Strong typing
* Easy migration to PostgreSQL later if needed

---

## Prisma Setup

Prisma should live in:

```text
/server/prisma
```

Database file:

```text
/server/prisma/dev.db
```

---

## Core Data Model

### Book Table (Primary Source of Truth)

```prisma
model Book {
  id              String   @id @default(cuid())
  title           String
  author          String
  genre           String
  pages           Int
  estimatedWords  Int
  rating          Float?
  dateFinished    DateTime?
  coverUrl        String?
  createdAt       DateTime @default(now())
}
```

---

## Design Principles for Data

* The `Book` table is the ONLY required table
* All analytics are derived at runtime
* No precomputed statistics tables
* No complex relationships required

---

## Derived Data Strategy

All dashboard metrics are calculated dynamically:

### Examples:

* Total Books → `COUNT(Book)`
* Total Pages → `SUM(pages)`
* Estimated Words → `SUM(pages * 275)`
* Top Author → `GROUP BY author`
* Top Genre → `GROUP BY genre`

👉 No analytics storage layer is required

---

# Backend Responsibilities

The Node.js server is responsible for:

## 1. Database Access

* All Prisma queries
* All CRUD operations for books

## 2. External API Integration

* Open Library API
* Google Books API (fallback)

## 3. Data Normalization

* Convert external API responses into clean Book objects
* Ensure consistent schema before saving

## 4. Business Logic

* No business logic in frontend
* All transformations happen here

---

# API Layer Design

## Books

* GET `/api/books`
* POST `/api/books`
* PUT `/api/books/:id`
* DELETE `/api/books/:id`

---

## Search

* GET `/api/search?q=`

Returns:

* Normalized book results from external APIs

---

## Analytics

* GET `/api/stats`

Returns:

* Total books
* Total pages
* Estimated words
* Top author
* Top genre
* Derived breakdowns

---

# Frontend Responsibilities

React app should:

* Render UI only
* Use React Query for all server state
* Never compute heavy analytics logic
* Never access external APIs directly

---

# Data Flow

1. User interacts with UI
2. React Query calls backend API
3. Backend queries Prisma OR external APIs
4. Backend normalizes data
5. Frontend receives clean typed response
6. UI renders according to DESIGN.md

---

# Book Entry System (Admin Mode)

A controlled admin interface must allow:

* Searching books via API
* Selecting correct result
* Editing metadata
* Saving to database

Rules:

* Always validate data before saving
* Allow manual override of all fields
* Never trust external API data blindly

---

# Charts & Analytics

Use Recharts for visualization.

Rules:

* All charts must use derived backend data OR simple frontend aggregation
* Charts must reflect DESIGN.md styling
* No default library styling

---

# Styling

* Tailwind CSS is the implementation layer
* DESIGN.md is the source of truth

Rules:

* No inline styles
* No ad-hoc CSS files unless necessary
* Use consistent spacing and tokens

---

# Component Architecture

Follow feature-based structure:

```text
/client/src/features/books
/client/src/features/dashboard
/client/src/features/authors
/client/src/components/ui
```

Rules:

* Keep components small and focused
* Avoid mixing UI + business logic
* Extract reusable hooks for shared logic

---

# Validation

Use Zod for:

* API responses
* Form validation
* Data normalization

Never trust external API responses.

---

# Error Handling

Every API must handle:

* Loading states
* Error states
* Empty states

No silent failures allowed.

---

# Testing & Verification

Before completing any feature:

## Backend

* Prisma queries work correctly
* API endpoints respond correctly
* External API integration works

## Frontend

* UI renders correctly
* Charts display valid data
* Admin flow works end-to-end
* Responsive layout works

---

# Self-Review Checklist

Before marking work complete:

### Engineering

* Is DB schema minimal and clean?
* Is business logic separated?
* Is code modular and reusable?
* Are APIs consistent?

### Product

* Does UI match DESIGN.md?
* Is layout balanced?
* Are charts meaningful?
* Are there any empty or awkward sections?

---

# Completion Standard

A feature is only complete when:

* It works end-to-end
* Database integration is correct
* UI is consistent with DESIGN.md
* No broken or missing states exist
* Code is maintainable and modular
