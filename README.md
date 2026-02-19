# Pomofocus Clone

## Project Overview
This project is a Pomofocus-inspired productivity app built with React and TypeScript. It includes a Pomodoro timer flow and task management features with local persistence.

## Features Implemented
- Pomodoro timer with mode switching (`Pomodoro`, `Short Break`, `Long Break`)
- Start, pause, reset, and fast-forward (`complete now`) timer actions
- Auto transition support for completion callbacks
- Task management with create, toggle, delete, and update
- Active task selection and dynamic timer subtitle
- Task notes (optional) in add/edit flow and task list display
- Inline task editing (title, note, estimated pomodoros)
- Estimated/completed pomodoro tracking per task
- Theme switching by timer mode:
  - Focus mode (red) for Pomodoro
  - Break mode (blue) for Short/Long Break
- Local storage persistence with migration-safe task loading

## Tech Stack
- React
- Vite
- TypeScript
- Vitest
- Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)

## Development
Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Testing
Run the test suite:

```bash
npm run test:run
```

## Production Build
Build and preview the production bundle:

```bash
npm run build
npm run preview
```
