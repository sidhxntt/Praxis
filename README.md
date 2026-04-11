# Praxis ⚡️

> A powerful CLI toolkit for scaffolding modern web development projects — from rapid prototypes to production-grade fullstack applications.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=flat&logo=python&logoColor=ffdd54)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=flat&logo=django&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Overview

<video width="600" controls>
  <source src="./praxis demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Praxis is more than a scaffolding tool — it's an expression of engineering philosophy. Built by a developer, for developers, Praxis eliminates the repetitive grunt work of project setup and lets you focus on what actually matters: building great software.

Whether you're spinning up a new SaaS app, a standalone backend, or a fullstack monorepo, Praxis gives you a production-ready foundation from the very first command. No boilerplate hunting, no configuration rabbit holes — just clean, opinionated scaffolding that reflects industry best practices.

---

## The Praxis Ecosystem

Praxis ships in two editions:

| | **Praxis CLI** | **Praxis Pro** |
|---|---|---|
| **Stack** | Node.js / TypeScript | Python / Django |
| **Focus** | Frontend, Backend, Fullstack scaffolding | Advanced backend boilerplate generation |
| **Best for** | Rapid project initialization | Production-grade backend systems |
| **Framework** | Next.js, Vite.js, Express | Django + DRF |
| **Status** | ✅ Stable | 🔧 Active development |

---

## Praxis CLI

### Features

- 🚀 **Interactive CLI** — Beautiful prompts with time-based greetings and animations
- 🎯 **Multiple Project Types** — Frontend, Backend, and Fullstack templates
- 💻 **TypeScript & JavaScript** — Both language variants for every template
- 🗄️ **Database Integration** — MongoDB and PostgreSQL pre-configured out of the box
- ⚡ **Framework Support** — Next.js and Vite.js templates (React / Vue)
- 🛠️ **Production-Ready** — Redis caching, BullMQ, JWT auth, Docker, and more
- 🎨 **Animated Interface** — Colorful terminal experience with figlet art
- ✅ **Dependency Checks** — Automatic Git and Node.js validation

---

### Prerequisites

- **Node.js** v14 or higher
- **Git**
- **npm** or **yarn**

---

### Installation

```bash
# Global install (recommended)
npm install -g praxiflow

# Or use without installing
npx praxiflow
```

---

### Quick Start

```bash
praxiflow
```

Follow the interactive prompts:

```
# Welcome animation plays
# Good morning, Alex! Let's set up your project. 🏄

? Name of your project › my-awesome-app
? Pick a project type. › Fullstack
? Pick a language for your Fullstack Framework. › TypeScript
? Choose your frontend framework. › NextJS
? Choose a Database. › MongoDB

# 📁 Folder created: /current/path/my-awesome-app
# Installing TypeScript NextJS MongoDB framework...
# Installation successful.
#
# Next steps:
#   1. cd my-awesome-app/
#   2. npm install
#   3. Checkout README.md for manual
#
#   HAPPY CODING ✨✨
```

---

### Project Types

#### Frontend

| Framework | Variants |
|-----------|----------|
| **Next.js** | Raw setup or pre-configured template |
| **Vite.js** | React or Vue, raw or pre-configured |

Both available in JavaScript and TypeScript.

#### Backend (Standalone)

A fully production-ready backend, independent of any frontend framework:

| Feature | Detail |
|---------|--------|
| **Databases** | MongoDB (Mongoose ODM) or PostgreSQL |
| **ORM** | Prisma — pre-configured with sample data seeding |
| **Caching** | Redis — speeds up repeated queries |
| **Job Queue** | BullMQ — background jobs (emails, notifications, payments) |
| **Auth** | JWT authentication and role-based authorization |
| **Payments** | LemonSqueezy integration pre-wired |
| **Monitoring** | Prometheus + Grafana |
| **Deployment** | Dockerized with Docker Compose |
| **Architecture** | OOP-based — clean, scalable, maintainable |

> The backend is intentionally decoupled from the frontend. Migrate or scale each side independently.

#### Fullstack

Combines a frontend framework with the standalone backend:

| Combo | Description |
|-------|-------------|
| Next.js + Backend | Full SaaS foundation with Next.js frontend |
| Vite.js + Backend | Lightweight frontend + full backend |

Fullstack templates support MongoDB or PostgreSQL and JavaScript or TypeScript.

---

### Template Branch Naming

Praxis clones templates from versioned branches:

```
js-{framework}                  → JavaScript frontend
ts-{framework}                  → TypeScript frontend
js-{framework}-{database}       → JavaScript fullstack
ts-{framework}-{database}       → TypeScript fullstack
```

---

### Project Structure (Praxis CLI)

```
Praxis/
├── src/
│   ├── controllers/
│   │   ├── cancelOperation.ts      # Handle user cancellation
│   │   ├── cloneRepo.ts            # Git repository cloning
│   │   ├── ending.ts               # Final messages and branding
│   │   ├── errorHandling.ts        # Error management
│   │   ├── nextSteps.ts            # Post-install instructions
│   │   ├── refining.ts             # Template cleanup and setup
│   │   ├── runCommand.ts           # Shell command execution
│   │   └── user_touch.ts           # User interaction utilities
│   ├── prompts/
│   │   ├── backend/                # Backend-specific prompts
│   │   ├── frontend/               # Frontend-specific prompts
│   │   ├── fullstack/              # Fullstack-specific prompts
│   │   └── projectType.ts          # Main project type selection
│   ├── utils/
│   │   ├── BaseFrameworkInstaller.ts
│   │   ├── BackendFrameworkInstaller.ts
│   │   ├── FrontedFrameworkInstaller.ts
│   │   └── FullstackFrameworkInstaller.ts
│   └── index.ts                    # CLI entry point
├── package.json
└── tsconfig.json
```

---

### Development

```bash
# Clone and set up
git clone <repository-url>
cd praxis
npm install

# Development mode
npm run dev

# Build
npm run build

# Run built version
npm run prod
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Run with ts-node for development |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run prod` | Run the compiled production build |

---

## Praxis Pro

Praxis Pro is the Python-powered evolution of Praxis CLI — a boilerplate generator and backend automation assistant built on Django and Django REST Framework.

While Praxis CLI prioritizes rapid scaffolding across multiple stacks, Praxis Pro goes deep on backend architecture. It takes full advantage of Django's comprehensive toolkit — robust ORM, admin panel, built-in authentication, and advanced security middleware — to deliver a superior foundation for complex applications.

> 🔧 Praxis Pro is currently in active refinement.

---

### Why Django?

Unlike Express, Django ships as a complete backend solution:

- Built-in ORM with migrations
- Powerful admin interface out of the box
- Native authentication and session management
- Advanced security middleware (CSRF, XSS, clickjacking protection)
- Battle-tested at scale

Praxis Pro builds on this foundation and adds the infrastructure layers that production systems actually need.

---

### Praxis Pro Features

#### Core Framework
- **Django + DRF** — Built-in ORM, admin interface, enhanced security, and DRF for API development
- **Auto-generated API Docs** — Swagger UI and ReDoc available out of the box
- **OOP-based architecture** — Clean, maintainable, easy to extend

#### Observability & Logging
- **Centralized Logging (ELK Stack)** — Filebeat + Kibana for real-time log visualization
- **Elasticsearch indexing** — Model-level indexing for fast, efficient querying
- **Sentry Integration** — Real-time error tracking with centralized reporting

#### Infrastructure & Deployment
- **Kubernetes Ready** — Pre-generated YAML manifests for `kubectl` and `minikube`
- **Automated ELK Setup** — Scripts that handle the full ELK stack configuration
- **Gunicorn + Nginx** — Production-grade WSGI and reverse proxy configuration pre-wired
- **Docker Compose** — Full containerized setup included

#### Developer Workflow
- **Automated Setup Scripts** — Eliminate time-consuming manual configuration
- **Sample Data Seeding** — Get up and running with realistic test data immediately
- **Prebuilt API Routes** — Auth, CRUD, OAuth, payments (LemonSqueezy), and more

---

### Praxis Pro vs Praxis CLI

| Capability | Praxis CLI | Praxis Pro |
|---|---|---|
| Frontend scaffolding | ✅ Next.js, Vite.js | ❌ |
| Backend scaffolding | ✅ Express-based | ✅ Django + DRF |
| Language | TypeScript / JavaScript | Python |
| ORM | Prisma | Django ORM |
| Auth | JWT | Django auth + DRF |
| Caching | Redis | Redis |
| Job queue | BullMQ | Celery (via setup scripts) |
| Monitoring | Prometheus + Grafana | Sentry + ELK |
| Logging | Standard | Centralized ELK + Kibana |
| Kubernetes | ❌ | ✅ Pre-configured YAMLs |
| Deployment | Docker Compose | Docker Compose + Nginx + Gunicorn |
| API docs | ❌ | ✅ Swagger + ReDoc |
| Status | ✅ Stable | 🔧 In refinement |

---

## Design Philosophy

Praxis is built around three principles:

**1. Decoupled by default** — The backend is never tied to the frontend. Every component can be migrated, replaced, or scaled independently.

**2. Production from day one** — Templates aren't toy examples. They include auth, monitoring, error handling, and deployment config from the start.

**3. Minimal friction** — A single command gets you from zero to a running, structured project. No reading docs before you can write code.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

---

## License

MIT

---

Built with ❤️ for the developer community — by a developer who got tired of setting up the same things over and over.