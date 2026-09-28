# Archio Profile OS -- Full Product Architecture

---

## SECTION A -- One-sentence identity

The Archio Profile is a **role-aware identity surface** that combines self-expression with platform-verifiable proof, connecting a user's trading history, mentorship record, community standing, and ecosystem participation into one living document controlled by its owner.

---

## SECTION B -- Core profile architecture

### Universal Profile Framework

Every Archio account has exactly **one profile**. That profile is a composition of **modules** -- each module is a vertical slice of data (stats, bio, activity, connections) that can be independently toggled visible/hidden by the owner. The role determines which modules are available, not which profile template is used.

```
+-------------------------------------------------+
|                  PROFILE SHELL                  |
|  (identity card, avatar, handle, role badge)    |
+-------------------------------------------------+
|  MODULE: Bio & External Links                   |
|  MODULE: Trading Stats                          |
|  MODULE: Activity Feed (role-filtered post types)|
|  MODULE: Badges & Achievements                  |
|  MODULE: Community Connections                   |
|  MODULE: [MENTOR ONLY] Methodology Card         |
|  MODULE: [MENTOR ONLY] Student Roster           |
|  MODULE: [ADMIN ONLY] Platform Metrics          |
+-------------------------------------------------+
```

**Key design rules:**
1. One profile, one URL: `archio.app/@handle`
2. Role is a **badge on the profile**, not a separate profile type
3. Modules are **additive by role** -- a mentor gets everything a user gets, plus mentor modules
4. Every data point has a **trust label** (see Section G)
5. The profile shell (identity card) is always visible; everything below it is owner-controlled

### Schema: `profiles_v2` (extends existing `profiles` table)

```
profiles_v2:
  id                UUID PK (= auth.users.id)
  handle            TEXT UNIQUE NOT NULL (3-30 chars, a-z0-9_)
  display_name      TEXT
  avatar_url        TEXT
  banner_url        TEXT
  bio               TEXT (max 500)
  tagline           TEXT (max 120, one-liner under name)
  role              ENUM('student', 'mentor', 'community_owner', 'admin', 'staff')
  verified_level    INT (0-3)
  
  -- Trading identity (from coachProfile store, synced to DB)
  methodology       TEXT
  style             TEXT
  experience_level  TEXT
  experience_years  INT
  markets           TEXT[]
  primary_instruments TEXT[]
  
  -- External links
  twitter_handle    TEXT
  youtube_url       TEXT
  telegram_handle   TEXT
  discord_handle    TEXT
  website_url       TEXT
  
  -- Privacy controls (JSONB for flexibility)
  visibility        JSONB DEFAULT '{}'
  -- Example: { "stats": "public", "trades": "community", "pnl": "private", "bio": "public" }
  
  -- Metadata
  last_active_at    TIMESTAMPTZ
  timezone          TEXT
  created_at        TIMESTAMPTZ
  updated_at        TIMESTAMPTZ
```

---

## SECTION C -- Role model

### How one profile serves all roles

| Aspect | Student | Mentor | Community Owner | Admin/Staff |
|--------|---------|--------|-----------------|-------------|
| **Identity card** | Handle + avatar + level badge | Handle + avatar + MENTOR badge (gold) | Handle + avatar + OWNER badge (purple) | Handle + avatar + STAFF badge (red) |
| **Trading stats** | Yes -- own performance | Yes -- own performance + aggregate student performance | Yes -- own + community aggregate | Platform-wide metrics |
| **Activity feed** | Forecasts, journal entries, challenge updates | + Lessons, mentor updates, strategy notes | + Community announcements, events | + System notices, moderation logs |
| **Badges** | Earned from trading | + Teaching badges, student success badges | + Community growth badges | + Platform contribution badges |
| **Methodology card** | No (references their strategy in copilot) | Yes -- public methodology breakdown | No | No |
| **Student roster** | No | Yes -- list of students with aggregate stats | No | No |
| **Community panel** | Shows communities joined | Shows communities joined + mentoring in | Shows communities owned/managed | All communities |
| **Proof labels** | Self-reported + platform-verified stats | + Mentor-reviewed label, verified track record | + Community verification | + Staff-verified |

### Role escalation
- Users start as `student`
- `mentor` is applied by admin or through a mentor application workflow
- `community_owner` is auto-set when creating an organization
- `admin`/`staff` are set by existing admins only
- A user can hold multiple role attributes (e.g., a mentor who also owns a community) -- the highest role is displayed as the badge, but all role modules are available

---

## SECTION D -- Core universal modules

Every profile, regardless of role, supports these modules:

### 1. Identity Card (always visible, not hideable)
- Avatar (with level-tier ring: slate/sky/violet/amber for Beginner/Intermediate/Advanced/Elite)
- Display name + @handle
- Role badge (with role-specific color)
- Verified level indicator (0-3 checkmarks)
- Tagline (one-liner)
- Last active timestamp
- Follow/Message CTA buttons

### 2. Bio & Links
- 500-char bio with markdown-lite (bold, italic, line breaks)
- External links row: Twitter/X, YouTube, Telegram, Discord, Website
- Each link shows as an icon + handle/domain
- Visibility: `public | community | private`

### 3. Trading Stats Card
- Win rate, accuracy, total trades, avg RR, total P&L, best month
- Streak indicator (fire icon)
- Stats from platform-recorded trades have a green "Verified" chip
- Self-reported stats (imported) have a gray "Self-reported" chip
- Visibility: `public | community | private`

### 4. Trading Identity
- Style badge (Scalp/Day/Swing/Position)
- Methodology badge (ICT/SMC/Price Action/etc.)
- Markets traded (icons for Forex/Crypto/Indices/Commodities)
- Primary instruments list
- Experience level + years
- Visibility: `public | community | private`

### 5. Recent Activity Feed
- Last 20 structured posts (see Section J for post types)
- Each post type has its own card design
- Filterable by type
- Visibility: `public | community | private` (per post)

### 6. Badges & Achievements
- Grid of earned badges with icon + name + date earned
- Categories: Trading (streak, milestones), Community (participation), Special (events)
- Always public (you earned it, you show it)

### 7. Community Connections
- List of servers/communities the user is active in
- Role within each (member/moderator/owner/mentor)
- Join date per community
- Visibility: `public | community | private`

### 8. Forecast History
- Link to full forecast archive
- Summary: total forecasts, accuracy %, top instruments
- Last 5 forecast cards as mini previews
- Visibility: `public | community | private`

---

## SECTION E -- Mentor-specific modules

These modules only appear when `role = 'mentor'`:

### 9. Methodology Card
- Full breakdown of what the mentor teaches
- Entry model names + short descriptions
- Session focus (which killzones)
- Timeframe structure (HTF analysis + LTF entry)
- Core beliefs / trading philosophy (3-5 bullet points)
- "What I do NOT teach" (explicit exclusions)
- Trust label: "Self-described methodology"

### 10. Teaching Record
- Total students (active / graduated / inactive)
- Student success metrics (aggregate win rate, avg P&L improvement)
- Active communities where they mentor
- Total lessons/war rooms hosted
- Trust label: "Platform-verified from student records"

### 11. Student Roster (visibility: community or private)
- List of students who have opted in to be listed
- Each student shows: handle, avatar, current level, time studying with mentor
- Aggregate class stats
- Students can opt out of appearing on mentor's roster

### 12. Mentor Testimonials
- Students can submit short testimonials (max 200 chars)
- Mentor can pin up to 5 testimonials
- Each shows student handle + verified tag + date
- Trust label: "Written by verified student"

### 13. Content Library Preview
- Last 5 lessons, strategy notes, or educational posts
- Links to full Method Vault if available
- Video lesson count + total watch hours

---

## SECTION F -- Privacy / visibility system

### Three-tier visibility model

| Level | Who sees it | Label shown |
|-------|-------------|-------------|
| `public` | Anyone, even logged-out visitors | Globe icon |
| `community` | Only members of shared communities | People icon |
| `private` | Only the profile owner | Lock icon |

### Visibility controls per module

```
visibility: {
  bio:          "public",
  stats:        "community",
  trades:       "private",
  pnl:          "community",
  activity:     "public",
  identity:     "public",    // trading style/methodology
  communities:  "community",
  forecasts:    "public",
  // mentor-only:
  methodology:  "public",
  roster:       "community",
  testimonials: "public",
}
```

### Rules:
1. **Identity card is always public** -- handle, avatar, role badge, tagline, verified level. You exist on the platform, you are findable.
2. **Granular per-module** -- each module has its own visibility toggle
3. **Per-post visibility** -- individual activity posts can override the module-level setting (e.g., module is public but one post is community-only)
4. **P&L is separate from stats** -- a user can show win rate publicly but hide dollar P&L
5. **Mentor profiles default to public** -- mentors are public figures on the platform; they can still hide specific modules but the expectation is openness
6. **"Hidden" badge** -- if a module exists but is hidden from the viewer, show a subtle lock icon with "Hidden by owner" tooltip. Do NOT pretend the data doesn't exist.

---

## SECTION G -- Trust / proof system

### Trust labels taxonomy

| Label | Color | Meaning | Example |
|-------|-------|---------|---------|
| **Verified** | Green | Platform has confirmed this from internal records | Trade stats from recorded executions |
| **Linked** | Blue | Connected to an external verifiable source | Twitter/X handle confirmed via OAuth |
| **Mentor-reviewed** | Gold | A mentor has reviewed and endorsed this | "Strategy reviewed by @JadeCap" |
| **Self-reported** | Gray | User entered this; platform cannot verify | Bio text, experience years, methodology description |
| **Imported** | Slate | Data imported from external source, not verified | MyFXBook stats, TradingView history |

### Where trust labels appear:
- **Stats card** -- each metric row shows its trust label
- **External links** -- "Linked" if OAuth-confirmed, "Self-reported" if manually entered
- **Methodology card** -- "Self-reported" unless a mentor has reviewed it
- **Testimonials** -- always "Verified student" (platform confirms student relationship)
- **Badges** -- always "Verified" (platform-issued)

### Visual treatment:
- Trust label appears as a small chip next to the data point
- Green checkmark for Verified, blue link icon for Linked, gold star for Mentor-reviewed, gray circle for Self-reported
- Hovering the chip shows a tooltip explaining what the label means
- Trust labels are NOT hideable -- if you show data, the label comes with it

---

## SECTION H -- Hover profile card

When a user's avatar or handle appears anywhere in the platform (forecast cards, leaderboards, war rooms, community chats, entry room), hovering or quick-clicking shows a **mini profile card**.

### Structure (280px wide, max 320px tall):

```
+------------------------------------------+
| [Avatar ring]  DisplayName    [ROLE BADGE]|
|              @handle                      |
|              "Tagline here"               |
+------------------------------------------+
| Win: 76% | Acc: 89% | RR: 1.9 | +124R   |
+------------------------------------------+
| [style] Day | [method] ICT | [market] FX |
+------------------------------------------+
| [streak: 4 wins]  [rank #2]              |
+------------------------------------------+
| [Message]         [View Profile]          |
+------------------------------------------+
```

### Key rules:
- Appears on hover after 300ms delay (prevents accidental triggers)
- Dismisses on mouse-leave after 200ms
- On mobile: tap avatar to show, tap outside to dismiss
- Stats shown respect the user's visibility settings -- if stats are `private`, show "Stats hidden" in that row
- The card is the same component everywhere -- `<ProfileHoverCard userId={id} />`
- Clicking "View Profile" navigates to `/@handle`
- If the user is a mentor, show a gold border on the card

---

## SECTION I -- Full profile page

Route: `/@handle` (or `/profile/[handle]` as fallback)

### Layout structure:

```
+=========================================================+
| BANNER IMAGE (or gradient fallback by role color)        |
|                                                          |
|    [Avatar]  Display Name         [Follow] [Message] [...]|
|              @handle  ROLE_BADGE  VERIFIED_CHIPS         |
|              "Tagline"                                    |
|              Joined Mar 2025 . Last active 2h ago         |
|              [Twitter] [YouTube] [Discord] [Website]      |
+=========================================================+
|                                                          |
|  [Tab: Overview]  [Tab: Activity]  [Tab: Forecasts]     |
|  [Tab: Stats]     [Tab: Communities]                     |
|  [Tab: Methodology] (mentor only)                       |
|                                                          |
+==========================================================+
|                                                          |
|  TAB CONTENT AREA                                        |
|                                                          |
|  Overview tab (default):                                 |
|    - Trading Identity card                               |
|    - Stats summary card                                  |
|    - Recent activity (last 5)                            |
|    - Badges grid                                         |
|    - Communities list                                    |
|                                                          |
|  Activity tab:                                           |
|    - Full activity feed with type filters                |
|    - Infinite scroll                                     |
|                                                          |
|  Forecasts tab:                                          |
|    - Forecast archive with accuracy summary              |
|    - Filter by instrument, direction, outcome            |
|                                                          |
|  Stats tab:                                              |
|    - Detailed performance breakdown                      |
|    - By session, by instrument, by month                 |
|    - Equity curve chart                                  |
|    - Drawdown history                                    |
|                                                          |
|  Communities tab:                                        |
|    - Servers joined with role per server                 |
|    - Community activity (messages, forecasts per server) |
|                                                          |
|  Methodology tab (mentor only):                         |
|    - Full methodology card                               |
|    - Entry model breakdowns                              |
|    - Teaching record                                     |
|    - Testimonials                                        |
|    - Content library                                     |
|                                                          |
+==========================================================+
```

### Sidebar (if viewing own profile):
- Edit Profile button
- Visibility Settings panel
- Account Settings link
- Share Profile link (copy URL)

---

## SECTION J -- Public activity / post types

These are NOT generic social posts. Each is a **structured data card** with specific fields.

### 1. Forecast Post
- Instrument, direction, entry, SL, TP, RR
- Confidence level
- Confluences list
- Optional chart screenshot
- Outcome (when resolved): Win/Loss/BE with actual R
- Trust label: "Platform-recorded forecast"

### 2. Trade Journal Entry
- Instrument, direction, entry, exit, P&L
- What went right / what went wrong
- Optional chart screenshot
- Trust label: "Platform-recorded" or "Self-reported"

### 3. Lesson Post (mentor only)
- Title, content (markdown)
- Category: Methodology, Psychology, Risk, Market Structure
- Optional video embed
- Optional file attachments
- Trust label: "Mentor content"

### 4. Strategy Note
- Short-form strategy thought (max 500 chars)
- Optional instrument tag
- Optional timeframe tag
- Trust label: "Self-reported"

### 5. Challenge Update
- Challenge name (e.g., "30-day no revenge trades")
- Day X of Y
- Status: active/completed/failed
- Stats during challenge period
- Trust label: "Platform-tracked challenge"

### 6. Withdrawal Proof
- Amount, broker, date
- Screenshot (verified by platform or self-reported)
- Trust label: "Self-reported" or "Verified" (if broker API connected)

### 7. Mentor Update (mentor only)
- Free-form update about teaching, new content, schedule changes
- Can pin to top of profile
- Trust label: "Mentor content"

### 8. Chart Share
- Chart screenshot with optional annotations
- Instrument + timeframe tags
- Short commentary (max 300 chars)
- Trust label: "Self-reported"

### 9. Milestone
- Auto-generated by platform: "Reached 100 trades", "First 5-win streak", "Advanced level"
- Cannot be faked -- platform-issued only
- Trust label: "Verified milestone"

---

## SECTION K -- External identity

### Integration model:

| Platform | Integration type | Verification method | What it provides |
|----------|-----------------|---------------------|------------------|
| **X/Twitter** | OAuth link | OAuth callback confirms ownership | "Linked" badge, display handle, optional feed embed |
| **YouTube** | URL paste + optional OAuth | OAuth or manual URL | Channel link, subscriber count (if OAuth), video embeds |
| **Telegram** | Handle paste | Manual (no API verification) | "Self-reported" link |
| **Discord** | Handle paste + optional OAuth | OAuth confirms identity | "Linked" badge if OAuth, "Self-reported" if paste |
| **Website** | URL paste | DNS TXT record or meta tag verification | "Verified" if DNS/meta confirmed, "Self-reported" if paste |
| **MyFXBook** | API key | API data pull | "Imported" stats with source attribution |

### Rules:
1. **X/Twitter supports identity, does NOT replace Archio proof.** A linked X account gives you a "Linked" trust badge, but your Archio stats are still the source of truth for trading performance.
2. External links appear as icon buttons in the identity card header
3. Verified/Linked external accounts show the trust chip inline
4. Platform never auto-posts to external accounts without explicit user action
5. External follower counts are shown as "External" data, not mixed with Archio metrics

---

## SECTION L -- Ecosystem connection map

### How the profile connects to every part of Archio:

```
                        +-------------------+
                        |   PROFILE (YOU)   |
                        +-------------------+
                               |
          +--------------------+--------------------+
          |          |         |         |          |
    +-----------+ +-------+ +-------+ +--------+ +--------+
    | Forecast  | | Leader| | Comm- | | War    | | Mentor |
    | Hub       | | board | | unity | | Rooms  | | Dash   |
    +-----------+ +-------+ +-------+ +--------+ +--------+
          |          |         |         |          |
          v          v         v         v          v
    Your forecasts  Your     Your      Your      Your mentor's
    feed into hub.  rank is  profile   profile   profile feeds
    Accuracy flows  computed  appears   appears   the method
    back to stats.  from      in member when you  display. Your
    Others click    verified  lists.    join/     stats appear
    your avatar     trades.   Click     create.   in their
    to see your     Rank      avatar    Others    student
    hover card.     shows on  = hover   see your  roster.
                    profile.  card.     card.
          |
    +-----------+
    | Private   |
    | Dashboard |
    +-----------+
          |
    Your personal
    copilot reads
    from your
    profile's
    strategy,
    risk, and
    psychology
    modules to
    personalize
    AI coaching.
```

### Specific connections:

1. **Forecast Hub** -- Every forecast you create links to your profile. Your accuracy and win rate are computed from resolved forecasts and flow back to your stats card. Clicking your avatar on any forecast card shows the hover card.

2. **Leaderboard** -- Rank is computed from verified platform-recorded trades. Your rank number appears on your profile. The leaderboard row links to your full profile.

3. **Communities** -- Your profile appears in member lists of every community you belong to. Your role per community is shown. Community activity counts contribute to your badges.

4. **War Rooms** -- When you join or create a war room, your hover card is accessible to other participants. War room performance (if tracked) flows back to your stats.

5. **Mentor Dashboard** -- If you follow a mentor, their profile's methodology card is what powers the Mentor Dashboard rail. If you are a mentor, your students' stats are aggregated in your Teaching Record module.

6. **Private Dashboard / Copilot** -- The copilot reads your profile's trading identity, strategy framework, risk parameters, and psychology profile to personalize AI guidance. This is already partially implemented via `useCoachProfile` (Zustand store) -- the profile system syncs this to the database so it persists across devices and is accessible to the platform.

---

## SECTION M -- 3-phase build plan

### Phase 1: Universal Profile System
**Goal:** Every user has a real, database-backed profile with identity card, stats, bio, and visibility controls.

**What to build:**
- `profiles_v2` table migration (extends existing profiles table with handle, tagline, role, trading identity fields, external links, visibility JSONB)
- `ProfileHoverCard` component -- universal hover card used across all surfaces (replaces the current `MemberProfile` modal approach)
- Full profile page at `/@handle` route with tabs: Overview, Activity, Stats, Communities
- Profile settings page for editing bio, links, visibility controls
- Sync `useCoachProfile` store data to database on save
- Trust label component (`<TrustChip level="verified" />`)
- Update `useSession` store to include `handle` and `role` from profiles_v2
- Connect existing `MemberProfile` in community hub to use `ProfileHoverCard`

**Database tables:**
- `profiles_v2` (core identity)
- `profile_badges` (earned achievements, linked to profile)
- `profile_follows` (follower/following relationships)

**Existing code to leverage:**
- `types/auth.ts` -- extend `Profile` interface
- `lib/auth/db.ts` -- extend `getProfile` / `updateProfile`
- `lib/validation/profile.ts` -- extend with new fields
- `lib/stores/coachProfile.ts` -- sync to DB
- `components/community-panel/member-profile.tsx` -- refactor into `ProfileHoverCard`
- `components/auth/UserButton.tsx` -- link to profile page

---

### Phase 2: Mentor Profile Extensions
**Goal:** Mentors get methodology cards, teaching records, student rosters, and testimonials.

**What to build:**
- Methodology tab on profile page
- `mentor_methodology` table (entry models, beliefs, exclusions, session focus)
- `mentor_students` table (student-mentor relationships with opt-in visibility)
- `mentor_testimonials` table (student-submitted, mentor-pinnable)
- Teaching Record card computing aggregate student performance
- Content Library preview pulling from Method Vault data
- Mentor application workflow (student -> apply -> admin approve -> role upgrade)
- Gold mentor badge ring on all avatar appearances

**Database tables:**
- `mentor_methodology` (linked to profile)
- `mentor_students` (relationship + opt-in flag)
- `mentor_testimonials` (text + verified student badge)

**Existing code to leverage:**
- `lib/mentor/templates/jadecap-ict-ny.ts` -- methodology data structure
- `lib/mentor/types.ts` -- `MentorTemplate` type
- `components/mentor/MentorDashboardRail.tsx` -- link from profile to live dashboard

---

### Phase 3: Public Activity + Trust System
**Goal:** Profiles become living documents with structured posts, full trust labeling, and external identity verification.

**What to build:**
- `profile_posts` table with type discriminator (forecast, journal, lesson, strategy_note, challenge, withdrawal_proof, chart_share, milestone)
- Activity feed component with type-specific card renderers
- Activity tab on profile with type filters and infinite scroll
- Trust label system fully integrated across all data surfaces
- External link verification flows (X/Twitter OAuth, Discord OAuth, DNS verification for websites)
- Milestone auto-generation engine (listens to trade events, badge triggers)
- Challenge system (create/join challenges with auto-tracking)
- Withdrawal proof upload with optional broker API verification

**Database tables:**
- `profile_posts` (polymorphic post type with JSONB content field)
- `profile_external_links` (with verification status)
- `profile_challenges` (active challenges with progress tracking)
- `profile_milestones` (auto-generated, immutable)

**Existing code to leverage:**
- `components/community-panel/entry-room.tsx` -- trade journal card design
- `components/forecast-hub/forecast-feed.tsx` -- forecast card design
- `components/community-panel/leaderboard.tsx` -- milestone/badge patterns

---

This architecture ensures the profile is not "just a page" but the **connective tissue of the entire Archio ecosystem** -- every action a user takes (forecast, trade, lesson, community participation) flows through the profile, is labeled for trust, and is controlled for visibility by the owner.
