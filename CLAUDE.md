# CLAUDE.md

This file provides context and working conventions for Claude when assisting with this project. It is part of the project's SDLC documentation and reflects intentional, standards-driven use of AI tooling.

---

## Project Overview

**BF Scheduler** is a Benjamin Franklin-inspired daily time-blocking app. It is a solo portfolio project built to MVP standards. The goal is a clean, working product — not an over-engineered one.

See `README.md` for full project context, MVP scope, and success criteria.

---

## Tech Stack

- **Language:** TypeScript (strict mode preferred)
- **Framework:** React (functional components and hooks only — no class components)
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **State:** React state + localStorage (no Redux, no external state library at MVP)
- **Package manager:** npm

Do not suggest or introduce dependencies outside this stack without asking first.

---

## Code Conventions

- Use functional components with typed props interfaces
- Prefer explicit types over `any`
- Keep components small and single-purpose
- Co-locate component styles with components when possible
- Do not add comments unless the logic is genuinely non-obvious
- Do not add docstrings or JSDoc unless asked
- Avoid over-abstracting — if something is used once, don't wrap it in a utility

---

## SDLC & Workflow

This project follows lightweight Agile with 1-2 week sprints. When helping with tasks:

- Stay within the defined MVP scope unless explicitly told otherwise
- Do not add features, refactor surrounding code, or gold-plate solutions
- If a task seems to be scope creep, flag it and ask before proceeding
- Prefer the simplest solution that satisfies the requirement

---

## localStorage

All persistence is via `localStorage`. There is no backend. Do not suggest or scaffold any backend, API, or database solution unless the user explicitly requests a post-MVP feature.

---

## What NOT to Do

- Do not introduce class components
- Do not add a state management library (Redux, Zustand, Jotai, etc.) without approval
- Do not create extra files, helpers, or abstractions that aren't needed yet
- Do not auto-commit or push to the remote without explicit user instruction
- Do not make changes outside the scope of what was asked
