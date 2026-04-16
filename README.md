# BF Scheduler

A Benjamin Franklin-inspired daily scheduling application built with TypeScript and React. Franklin was known for structuring his day by the hour with intentional blocks for work, reflection, and personal development. This app brings that discipline into a modern, browser-based interface.

---

## Motivation

Benjamin Franklin's daily schedule — divided into purpose-driven hourly blocks — is one of the most documented examples of intentional time management. This project applies that same philosophy in a lightweight, local-first app that helps users plan their day with clarity and structure.

---

## Goals & Objectives

- Give users a simple, visual way to plan their day hour by hour
- Encourage intentional scheduling inspired by Franklin's time-blocking method
- Deliver a working MVP quickly without over-engineering
- Demonstrate full SDLC process from planning through deployment on a solo project

---

## MVP Scope

The MVP is intentionally minimal. The goal is a working, usable product — not a feature-complete one.

**In scope:**
- 24-hour (or configurable) daily schedule grid
- Add, edit, and delete time blocks with a label and category
- Persist schedule to localStorage (no backend required)
- Responsive layout usable on desktop

**Out of scope for MVP:**
- User accounts or cloud sync
- Multi-day or weekly views
- Recurring tasks / templates
- Mobile-native experience
- Notifications or reminders

---

## Success Criteria

The MVP is considered successful when:

- [ ] A user can open the app and see a full day broken into hourly slots
- [ ] A user can assign a label and category to any time slot
- [ ] Schedule data persists across page refreshes via localStorage
- [ ] The UI is clean, readable, and free of critical bugs
- [ ] The app builds and runs locally without errors

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| UI Framework | React |
| Styling | Tailwind CSS |
| State | React state + localStorage |
| Build Tool | Vite |
| Package Manager | npm |

---

## Planned Features (Post-MVP)

- Weekly and monthly views
- Category color coding
- Franklin's original 13 virtues as optional daily prompts
- Export schedule as PDF or image
- Dark mode

---

## SDLC Methodology

This project follows a lightweight **Agile** process suited for solo development:

- Work is organized into **1-2 week sprints**
- Each sprint has a defined goal and a small backlog of tasks
- Features are prioritized by MVP value, not scope creep
- Progress is tracked via GitHub Issues and project board

**Sprint 1 goal:** Project setup, repo structure, base UI scaffold

---

## Limitations

- Data is stored in localStorage only — clearing browser storage will erase the schedule
- No cross-device sync
- Single-user only — no sharing or collaboration features
- Not optimized for mobile at MVP stage

---

## Setup & Installation

> Prerequisites: Node.js >= 18, npm

```bash
git clone https://github.com/SomeShyGuy/Benjamin-Franklin-Scheduler.git
cd Benjamin-Franklin-Scheduler
npm install
npm run dev
```

App will be available at `http://localhost:5173`

---

## Author

**[Your Name]**
SomeShyGuy 

---

## License

MIT
