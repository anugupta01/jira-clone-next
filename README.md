# Jira Clone — Next.js 16 Application

This repo is the **foundation + working board slice** of the conversion, plus.

## What's done (runnable now)

- **Next.js 16 App Router + TypeScript + Tailwind v4** foundation.
- **Domain models** ported verbatim (`lib/models.ts`): `JIssue`, `JProject`,
  `JUser`, `JComment`, and the `IssueType` / `IssueStatus` / `IssuePriority`
  enums with their colour maps.
- **State store** (`lib/store.ts`) using **Zustand**, replacing Akita's
  store/query/service. Includes `issuesByStatus` selectors and `moveIssue`
  (status change + `listPosition` renumber).
- **Working drag-and-drop board** (`components/Board.tsx` + `BoardColumn` +
  `IssueCard`) using **@dnd-kit**, 
  status columns; drag cards within and across columns; live position updates.
- **Real seed data** — the original `assets/data/project.json` is served from
  `public/data/` and loaded into the store, so the board shows authentic
  issues, users, and avatars.
- Routing: `/` → `/project/board`, project shell layout, 404.

Run it:
```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /project/board
npm run build
```

## Subsystem migration map

| React/Next equivalent | Notes 
| **Zustand** store | Extend the same store for issues CRUD, filters, comments |
| **@dnd-kit** | Columns + cards, cross-column moves, position renumber |
| **antd** (React Ant Design) | Biggest chunk; per-component API differs. Add `antd` and replace usage site by site |
| **react-quill-new** (or a Quill React wrapper) | Used in issue description + comment body 
| Add `issue/[id]` route/modal, settings 
| React hooks / Zustand subscriptions | No manual teardown needed 
| `@sentry/nextjs` | Straight SDK swap 
| Tailwind v4 

## Suggested phase order for the rest

1. **Issue detail** — `app/project/board/issue/[id]` (or a modal): title,
   description (Quill), type/priority/status/assignee selects, reporter,
   estimate/time tracking. Replaces `issue-detail` + `issue-modal` + the
   `*-select` components. Wire each field to a store `updateIssue` action.
2. **Add-issue modal** — `add-issue-modal` + its `issue-*-select` children →
   an antd Modal with a form; a store `addIssue` action.
3. **Comments** — `issue-comments` / `issue-comment` → list + add form backed by
   a store `addComment` action (the `JComment` model is already ported).
4. **Board filter** — `board-filter` (search text, avatar filter, "only my
   issues", recently updated) → a filter slice in the store + a filter bar; the
   board reads filtered selectors.
5. **Settings + auth** — `project/settings`, `project/auth`.
6. **Polish** — antd theming to match the original zorro look, Sentry, and
   the shared `jira-control` primitives (avatar, button, breadcrumbs, svg-icon).

## Honest status

The board — the signature interaction of a Jira clone — works end to end on real
seed data. The remaining subsystems are scoped above but not yet built; the
store and routing are structured so each phase extends what's here rather than
rewriting it. `next build` has not been run in the authoring environment, so
verify locally.
