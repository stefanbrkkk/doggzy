---
description: Resume work on the business plan seamlessly across sessions
---

# /pickup-session — Resume Workflow

Use this workflow to pick up exactly where we left off after a break or new day.

## Goals
- Recover active context (what we were doing, decisions, next steps).
- Load the correct section execution file and continue work.
- Surface blockers, open questions, and the most recent progress.

## Prerequisites
- Ensure internet (if any external links) and repo available.

## Steps
1) Identify last touched files
   - Look at `docs/execution-plan/` (including `detailed-plan/`) and sort by modified time.
   - Open the most recently modified file(s) and read `Current Status`, `Decisions & Open Questions`, and `Progress Log`.

2) Load core context
   - Open `docs/README.md` to re-anchor navigation and current links.
   - Open `docs/execution-plan/1-initial-high-level-plan.md` to re-anchor the big picture.
   - Read memory key: “Dog welfare org & portal scope”.

3) Rebuild task list
   - From the open execution file, list remaining checkboxes under `Progress Log`.
   - Translate into active TODOs with priorities.

4) Confirm today’s focus
   - If a specific subsection is in progress (e.g., `docs/execution-plan/detailed-plan/09-product-technology.md`), continue there.
   - Otherwise, default to the earliest section without progress (by file order 01..16).

5) Start the work session
   - Summarize the last state in one paragraph.
   - Propose the next 2–3 concrete actions and request confirmation if needed.

6) Preserve a breadcrumb
   - Update the current execution file’s `Current Status` with today’s date/time and brief note.
   - Append one bullet to `Progress Log` describing what was done.

7) Wrap-up at end of session
   - Update `Progress Log` checkboxes.
   - Add any `Decisions & Open Questions`.
   - Note next actions for `/pickup-session` to find tomorrow.

## Notes
- Keep changes within the requested scope; avoid adding features unless approved.
- Prefer high-quality, small commits linked to the execution file edited.
