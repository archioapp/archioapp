# Development Workflow Operating System

## Internal Document -- Phase 1 Trading Copilot

---

## PART 1 -- Architecture Overview

### What You Are Building

A **controlled multi-stream development system** with one protected source of truth and three independent workstreams that can operate in parallel without contaminating each other.

**MAIN** is the locked vault. It holds only approved, verified, stable code. Nothing enters MAIN without passing through a human review gate. MAIN is never edited directly -- it only receives merges from approved pull requests.

**Three workstreams** (KAN, TEAM A, TEAM B) each start from the same approved MAIN foundation. They work independently on assigned scopes. If one stream breaks, it is discarded and rebuilt from MAIN. The other streams are unaffected.

**Review gate**: When any stream finishes work, they create a Pull Request. That PR must pass a verification checklist and receive approval from both you and Luke before it can merge into MAIN. No exceptions.

**Recovery**: If any stream produces bad work, you delete the branch, create a new one from MAIN, and restart. MAIN is never affected.

```
                    +------------------+
                    |      MAIN        |
                    |  (protected)     |
                    |  source of truth |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
        +-----v-----+  +----v------+  +----v------+
        |   KAN      |  |  TEAM A   |  |  TEAM B   |
        | (working)  |  | (working) |  | (working) |
        +-----+------+  +----+------+  +----+------+
              |              |              |
         feature/*      feature/*      feature/*
         branches       branches       branches
              |              |              |
              v              v              v
          PR -> Review -> Verify -> Merge to MAIN
```

---

## PART 2 -- Recommended Structure (v0 + GitHub)

### Repository: ONE Repo

Use a single repository (`v0-phase1step1`). Multiple repos fragment the codebase and make shared components impossible to manage. A single repo with branch isolation gives you the same separation with better tooling.

### v0 Projects: ONE Project, Multiple Chats

- **One v0 project** connected to the repo
- **Separate v0 chats** for each workstream (KAN chat, TEAM A chat, TEAM B chat)
- Each chat operates on its own branch (set in v0 settings)
- The MAIN branch chat is your **review-only** environment -- you never build features there

### Branch Strategy: Permanent Stream Branches + Feature Branches

Each workstream gets a **permanent base branch** that tracks their current state. Feature work happens in sub-branches off the stream branch.

```
main                          <-- protected, stable, approved only
kan/base                      <-- KAN's working branch (created from main)
kan/feature/ai-copilot-view   <-- feature branch off kan/base
team-a/base                   <-- TEAM A's working branch (created from main)
team-a/feature/chart-engine   <-- feature branch off team-a/base
team-b/base                   <-- TEAM B's working branch (created from main)
team-b/feature/session-panel  <-- feature branch off team-b/base
```

### Why This Is Better Than Your Original Idea

Your original structure is solid. One improvement: using `/base` branches for each stream (not just direct feature branches) gives you a persistent "team workspace" that accumulates approved features within that stream before they go to MAIN. This prevents the situation where a team has 5 features in progress and cannot easily PR them individually.

---

## PART 3 -- Exact Branching Model

### Branch Naming Convention

```
main                              # Protected source of truth
kan/base                          # KAN persistent workspace
kan/feature/<feature-name>        # KAN feature branches
kan/fix/<fix-description>         # KAN hotfix branches
team-a/base                      # TEAM A persistent workspace
team-a/feature/<feature-name>    # TEAM A feature branches
team-a/fix/<fix-description>     # TEAM A hotfix branches
team-b/base                      # TEAM B persistent workspace
team-b/feature/<feature-name>    # TEAM B feature branches
team-b/fix/<fix-description>     # TEAM B hotfix branches
```

### Branch Lifecycle

```
1. MAIN exists as protected branch
2. Create kan/base from main
3. Create team-a/base from main
4. Create team-b/base from main
5. KAN creates kan/feature/copilot-ai from kan/base
6. KAN finishes -> PR from kan/feature/copilot-ai -> kan/base
7. KAN self-reviews, merges into kan/base
8. When ready for MAIN: PR from kan/base -> main
9. You + Luke review, verify, approve
10. Merge into main
11. After merge: team-a/base and team-b/base rebase from main (controlled sync)
```

### Recreating a Clean Branch

If kan/base gets corrupted:
```bash
git branch -D kan/base
git checkout main
git checkout -b kan/base
git push origin kan/base --force
```

KAN starts fresh from the last approved MAIN state. No other team is affected.

---

## PART 4 -- Approval / Verification Pass System

### Step-by-Step Workflow

#### When a Team Finishes Work

```
STEP 1: TEAM SELF-CHECK
  - Developer runs the build locally (or checks v0 preview)
  - Developer confirms their changes are within assigned scope
  - Developer confirms no accidental deletions or off-scope changes

STEP 2: CREATE PULL REQUEST
  - PR from team-x/base -> main
  - PR title format: [TEAM-X] <Feature Description>
  - PR description MUST include:
    - What was changed (summary)
    - Files touched (list)
    - What was NOT changed (scope confirmation)
    - Screenshot/recording of visual result
    - Any known issues or trade-offs

STEP 3: AUTOMATED CHECKS
  - Build must pass (Vercel preview deployment)
  - No TypeScript errors
  - No broken imports
  - Preview URL is functional

STEP 4: VERIFICATION PASS (You + Luke)
  - Visual consistency check
  - Route verification (all routes still work)
  - Import verification (no broken imports)
  - Component check (no accidental deletion of shared components)
  - Architecture check (no drift from approved patterns)
  - Scope check (no changes outside assigned scope)
  - Design system check (colors, typography, spacing match system)
  - Product direction check (does this align with the vision?)
  - Hidden changes check (diff review for anything unexpected)

STEP 5: DECISION
  - APPROVED: Merge into main. Delete the feature branch.
  - CHANGES REQUESTED: Team revises. New commits dismiss stale approvals.
    Re-review.
  - REJECTED: Branch is abandoned. Team creates new branch from main
    if needed.
```

### Verification Pass Checklist

Use this checklist for every PR to MAIN:

```
[ ] Build passes (Vercel preview deploys successfully)
[ ] No TypeScript / compilation errors
[ ] All existing routes still function
[ ] No broken imports across the codebase
[ ] No accidental deletion of shared components
[ ] No architecture drift (file structure matches conventions)
[ ] No off-scope refactors or changes
[ ] Visual consistency with approved design system
[ ] Typography, colors, spacing match design tokens
[ ] Product direction alignment confirmed
[ ] Diff reviewed for hidden/unexpected changes
[ ] Performance: no obvious regressions
[ ] Mobile responsiveness maintained
[ ] No console errors in browser dev tools
[ ] PR description is complete and accurate
```

---

## PART 5 -- GitHub Protection Rules for MAIN

### Settings to Enable on main Branch

Go to: **Repository Settings > Branches > Branch protection rules > Add rule**

Branch name pattern: `main`

```
[x] Require a pull request before merging
    [x] Required approving reviews: 2
    [x] Dismiss stale pull request approvals when new commits are pushed
    [x] Require review from Code Owners (optional, if you set up CODEOWNERS)
    [x] Require approval of the most recent reviewable push

[x] Require status checks to pass before merging
    [x] Require branches to be up to date before merging
    - Add status checks: Vercel deployment, build check

[x] Require conversation resolution before merging

[x] Require linear history (prevents merge commits, keeps history clean)

[ ] Require signed commits (optional, adds complexity)

[x] Require deployments to succeed before merging
    - Select: Vercel Preview deployment

[x] Do not allow bypassing the above settings
    - Even admins cannot bypass

[x] Restrict who can push to matching branches
    - Only allow: your GitHub account + Luke's GitHub account
    - Nobody else can push, even accidentally

[ ] Allow force pushes: OFF
[ ] Allow deletions: OFF
```

### Additional Repository Settings

```
Settings > General > Pull Requests:
[x] Allow squash merging (keeps MAIN history clean)
[ ] Allow merge commits: OFF
[ ] Allow rebase merging: OFF (or ON if you prefer linear history)
[x] Automatically delete head branches (cleans up after merge)
```

---

## PART 6 -- Responsibility Matrix

### KAN (Project Owner / Technical Director)

```
ROLE: Architect, designer, quality gate, final authority
SCOPE: Everything (full codebase authority)
RESPONSIBILITIES:
  - Defines product direction and design system
  - Reviews and approves all PRs to main
  - Can work on any part of the codebase via kan/base
  - Sets architectural standards and patterns
  - Makes final call on rejections
  - Manages branch recovery and resets
  - Maintains the operating system document
DOES NOT:
  - Push directly to main
  - Merge without Luke's co-approval
```

### LUKE (Co-Reviewer / Technical Validator)

```
ROLE: Technical reviewer, quality validator
SCOPE: Full codebase review authority
RESPONSIBILITIES:
  - Reviews all PRs to main alongside KAN
  - Validates technical correctness
  - Checks for architecture drift
  - Checks for hidden changes
  - Validates build and deployment
  - Co-approves or requests changes
DOES NOT:
  - Push directly to main
  - Merge without KAN's co-approval
  - Override KAN's architectural decisions
```

### TEAM A

```
ROLE: Feature developer (assigned scope)
SCOPE: Defined per sprint/task assignment
RESPONSIBILITIES:
  - Works exclusively on team-a/base and team-a/feature/* branches
  - Follows architectural patterns established in main
  - Self-checks before creating PRs
  - Provides complete PR descriptions
  - Responds to review feedback promptly
  - Does NOT touch files outside assigned scope
DOES NOT:
  - Push to main
  - Push to kan/* or team-b/* branches
  - Modify shared architecture without approval
  - Refactor outside assigned scope
```

### TEAM B

```
ROLE: Feature developer (assigned scope)
SCOPE: Defined per sprint/task assignment
RESPONSIBILITIES:
  - Works exclusively on team-b/base and team-b/feature/* branches
  - Follows architectural patterns established in main
  - Self-checks before creating PRs
  - Provides complete PR descriptions
  - Responds to review feedback promptly
  - Does NOT touch files outside assigned scope
DOES NOT:
  - Push to main
  - Push to kan/* or team-a/* branches
  - Modify shared architecture without approval
  - Refactor outside assigned scope
```

### Scope Boundaries (File Ownership Example)

Define clear ownership so teams do not collide:

```
SHARED (no team edits without approval):
  - app/layout.tsx
  - app/globals.css
  - lib/utils.ts
  - lib/types/*
  - lib/stores/*
  - components/ui/*

KAN (primary ownership):
  - Architecture decisions
  - Design system tokens
  - Core component patterns
  - Plan documents

TEAM A (example assignment):
  - components/copilot/*
  - components/charts/*
  - app/api/copilot/*

TEAM B (example assignment):
  - components/trading-controls/*
  - components/session-*
  - components/liquidity-*
```

Adjust ownership per sprint. The point is: **each team knows exactly what files they can touch**.

---

## PART 7 -- Operating Rules for v0

### Project Structure

```
ONE v0 project: connected to fxp1casso/v0-phase1step1
ONE repository: all code lives here
MULTIPLE v0 chats: one per workstream
```

### Chat Organization

```
CHAT: "KAN - Main Development"
  - Branch: kan/base (or kan/feature/*)
  - Full architectural authority
  - Can reference and modify any file

CHAT: "TEAM A - [Current Assignment]"
  - Branch: team-a/base (or team-a/feature/*)
  - Scope limited to assigned files
  - Must follow existing patterns

CHAT: "TEAM B - [Current Assignment]"
  - Branch: team-b/base (or team-b/feature/*)
  - Scope limited to assigned files
  - Must follow existing patterns

CHAT: "REVIEW - Main Branch"
  - Branch: main
  - Read-only review environment
  - Used by KAN + Luke to verify PRs
```

### Avoiding AI Memory Loss

v0 chats lose context over long conversations. Protect against this:

1. **Master instruction document**: Keep `docs/` directory with:
   - `WORKFLOW-OPERATING-SYSTEM.md` -- this document
   - `DESIGN-SYSTEM.md` -- design tokens, patterns, conventions
   - `ARCHITECTURE.md` -- file structure, component patterns, data flow

2. **Plan files**: Keep `v0_plans/` directory with:
   - `fast-sketch.md` -- current implementation plan

3. **Per-chat rules**: Use the v0 Settings > Rules to paste key instructions that persist across messages

4. **Reference files over memory**: When starting a new chat or resuming, tell v0 to read the plan files first

5. **Scope reminders**: At the start of each TEAM chat, state:
   ```
   You are working on team-a/base branch.
   Your scope is: components/copilot/* and app/api/copilot/*
   Do not modify files outside this scope.
   Read v0_plans/fast-sketch.md for the current plan.
   ```

### Starting Each Team From the Same Foundation

1. MAIN is the approved foundation
2. Create team branch from MAIN: `git checkout main && git checkout -b team-a/base`
3. In v0, connect the chat to that branch
4. The team's v0 chat starts with the full approved codebase
5. Team works in isolation -- their changes only exist on their branch

### Bringing Approved Work Back to MAIN

1. Team finishes work on their branch
2. Team creates PR: `team-a/base -> main`
3. KAN + Luke review using the verification checklist
4. If approved: squash merge into main
5. After merge: other team branches rebase from updated main
6. Rebase command:
   ```
   git checkout team-b/base && git rebase main && git push --force-with-lease
   ```

---

## PART 8 -- Safety / Recovery Plan

### Scenario: Team A Breaks Their Branch Badly

```
1. Do NOT panic. MAIN is unaffected.
2. Assess: Can the branch be fixed with a few reverts?
   - YES: Use git revert to undo bad commits
   - NO: Destroy and rebuild

3. Destroy and rebuild:
   git checkout main
   git branch -D team-a/base
   git push origin --delete team-a/base
   git checkout -b team-a/base
   git push origin team-a/base

4. Team A starts fresh from the last approved MAIN state
5. Cherry-pick any good commits from the old branch if needed
```

### Scenario: Team B Goes Off the Rails (Scope Creep)

```
1. Reject the PR with clear feedback
2. If the branch is salvageable:
   - Team B reverts off-scope changes
   - Re-submits for review
3. If the branch is not salvageable:
   - Destroy team-b/base
   - Rebuild from main
   - Reassign the task with clearer scope boundaries
```

### Scenario: Bad Code Reaches MAIN (Emergency)

```
1. Identify the bad merge commit on main
2. Revert the merge:
   git checkout main
   git revert -m 1 <merge-commit-hash>
   git push origin main

3. MAIN is restored to pre-merge state
4. Investigate what went wrong in the review process
5. Fix the verification checklist if needed
6. Team reworks and resubmits
```

### Scenario: v0 Chat Loses Context

```
1. Start a new v0 chat connected to the same branch
2. First message:
   "Read docs/WORKFLOW-OPERATING-SYSTEM.md and v0_plans/fast-sketch.md"
3. State your scope and current task
4. v0 rebuilds context from the plan files + codebase
```

### Golden Rule

**MAIN is sacred. When in doubt, do not merge. Destroy the branch and start over. It is always cheaper to rebuild a feature branch than to fix a corrupted main.**

---

## PART 9 -- Deliverables Summary

### 1. Architecture Summary

Single repo, single v0 project, multiple chats, protected main, three isolated workstreams with permanent base branches and disposable feature branches.

### 2. Branch Naming Model

```
main
kan/base
kan/feature/<name>
kan/fix/<name>
team-a/base
team-a/feature/<name>
team-a/fix/<name>
team-b/base
team-b/feature/<name>
team-b/fix/<name>
```

### 3. PR / Approval Workflow

```
Team finishes -> Self-check -> PR to main -> Automated checks ->
KAN review -> Luke review -> Verification pass ->
APPROVED (merge) | CHANGES REQUESTED (revise) | REJECTED (rebuild)
```

### 4. Verification Pass Checklist

```
[ ] Build passes
[ ] No TypeScript errors
[ ] All routes function
[ ] No broken imports
[ ] No deleted shared components
[ ] No architecture drift
[ ] No off-scope changes
[ ] Visual consistency
[ ] Design system alignment
[ ] Product direction alignment
[ ] Diff reviewed for hidden changes
[ ] No performance regressions
[ ] Mobile responsive
[ ] No console errors
[ ] PR description complete
```

### 5. GitHub Protection Rules

```
[x] Require PR for merging
[x] 2 required approvals
[x] Dismiss stale approvals
[x] Require conversation resolution
[x] Require status checks
[x] Require deployments to succeed
[x] No bypass allowed
[x] Restrict push access
[ ] Force push: OFF
[ ] Deletions: OFF
[x] Squash merge only
[x] Auto-delete head branches
```

### 6. Team Responsibility Matrix

| Role   | Scope              | Can Push To        | Reviews    |
|--------|--------------------|--------------------|------------|
| KAN    | Full codebase      | kan/*              | All PRs    |
| Luke   | Full review        | (review only)      | All PRs    |
| Team A | Assigned files     | team-a/*           | Self-check |
| Team B | Assigned files     | team-b/*           | Self-check |

### 7. v0 Chat Operating Rules

- One project, multiple chats
- Each chat locked to a specific branch
- Plan files in `v0_plans/` and `docs/` are the persistent brain
- New chats start by reading plan files
- Scope stated explicitly at chat start
- MAIN chat is review-only

### 8. Recovery / Rollback Workflow

- Branch corrupted: Delete and rebuild from main
- Bad merge to main: `git revert -m 1 <hash>`
- Scope creep: Reject PR, rebuild if needed
- Context loss: New chat + read plan files
- Golden rule: Main is sacred. When in doubt, rebuild the branch.

---

## Weaknesses in Your Original Idea (Addressed Above)

1. **No persistent team workspace**: Your original plan had feature branches only. The `/base` branch pattern gives each team a persistent working state that accumulates their changes before PRing to main.

2. **No automated checks mentioned**: Added Vercel preview deployment as an automated quality gate before human review.

3. **No file ownership boundaries**: Without explicit scope boundaries, teams will inevitably edit shared files and create merge conflicts. The file ownership matrix solves this.

4. **No v0 context recovery plan**: Long v0 chats lose context. The plan files + per-chat rules system ensures any new chat can rebuild full project understanding.

5. **No emergency rollback for MAIN**: Added `git revert -m 1` workflow for the worst case where bad code reaches main.
