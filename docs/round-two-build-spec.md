# Round Two — Build Spec (Phase 1: UI)

*Hand-off brief for Claude Code · v1.0 · 28 June 2026*

> **Read this first.** Phase 1 builds the **consumer-facing UI only**, front-end, on **mock data** shaped to the real schema. No database, no scraping, no email, no auth in this phase. Later phases (§12) wire up Supabase, the verification bot, and the admin app. Build so those slot in later without rework — i.e. type your data to the schema and keep data access behind a thin module you can swap from "mock" to "Supabase" later.

---

## 1. Product in one paragraph

Round Two is a website for finding pub trivia (quiz) nights, launching in a single UK city (Bristol). The one differentiator is **accuracy** — most listings elsewhere are stale, and turning up to a quiz that no longer runs is the core frustration we kill. Accuracy is maintained (in later phases) by a bot that scrapes pub websites for a baseline, then emails pubs to confirm, with every change passing human review. The UI's job in Phase 1 is to make that trustworthiness *visible* and make finding a quiz fast.

---

## 2. Phase 1 scope

**In:** the consumer app — map-first discovery, filters, listing detail with the trust badge and verification trail, and the "meet in the middle" preview. Mock/sample data. Responsive (mobile + desktop). SEO-ready pages.

**Out (later phases):** any backend, Supabase, scraping, email, the admin app, user accounts, saved favourites, notifications, real geocoding. No `localStorage`/`sessionStorage`.

---

## 3. Tech stack (with reasons)

| Layer | Choice | Why | Phase |
|---|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript** | SSR/SSG for the SEO a discovery site lives on; App Router for clean route-level rendering | 1 |
| Styling | **Tailwind CSS** + design tokens (§5) | Fast, consistent; tokens keep the established look | 1 |
| Fonts | **next/font** — Oswald (display) + Inter (body) | Oswald reads like painted pub signage; Inter is clean for data | 1 |
| Map | **Mapbox GL JS** via `react-map-gl` | Custom dark styling fits the brand; cost-friendly on OSM data; same map serves meet-in-the-middle later. Token via `NEXT_PUBLIC_MAPBOX_TOKEN` | 1 |
| Icons | **lucide-react** | Clean, consistent line icons | 1 |
| State / filters | React state + **URL search params** | Encoding day/distance/search in the URL gives shareable filtered links — important since there are no accounts | 1 |
| Data access | Thin **`lib/data.ts`** module returning typed data from a local mock | Lets us swap mock → Supabase later with no UI changes | 1 |
| Database | **PostgreSQL + PostGIS** on **Supabase** | PostGIS powers "within X miles" now and the midpoint maths later; Supabase bundles managed Postgres + auth for when accounts arrive | later |
| Hosting | **Vercel** | First-class Next.js hosting | later |
| Bot pipeline | **Playwright** (scrape) + **Claude API** (extract & parse replies) + cron (quarterly sweep) | Playwright handles JS-heavy pub sites; Claude parses messy pages and free-text email replies | later |
| Email | **Postmark** | Deliverability + inbound-parse webhook + built-in unsubscribe handling for compliance | later |
| Admin auth | **Supabase Auth**, per-admin logins + roles | Per-person sign-in makes the audit trail attributable (a shared password can't) | later |

The full data model is in the companion `schema.sql` / `schema-design.md`. Phase-1 mock data must mirror those field names.

---

## 4. Routes (consumer)

- `/` — **map-first home**: map + filter rail + result list; listing detail opens as an overlay/drawer.
- `/quiz/[city]/[slug]` — **server-rendered listing page** (same detail component) for SEO and direct/shareable links.
- `/meet` — **meet in the middle** preview.
- `/admin` — placeholder only in Phase 1 (built later).

Filters (`day`, `within`, `q`) are reflected in the URL on `/`.

---

## 5. Design system

The look is "after-dark pub" — keep it; do not drift to a generic template.

**Palette**
```
ink        #13201B   app background (dark green-black)
bottle     #1C3328   panels / cards
bottle2    #24412F   raised / hover
brass      #D8A33B   primary accent (lamplight), CTAs, wordmark
brassSoft  #E8C77E   highlights
chalk      #F1EAD9   primary text
chalkDim   #A89F8B   secondary text
confirmed  #6FBE8E   pub-confirmed trust state
website    #D89B4C   from-website trust state (used as dashed outline)
line       rgba(241,234,217,0.12)  hairlines
```

**Type:** Oswald for wordmark, headers, and small tracked-out eyebrow labels; Inter for body, controls, and data.

**Signature element — the verification stamp.** Trust is shown like a landlord stamping a night as correct:
- **Pub-confirmed:** solid green seal, slightly rotated, "Checked with the pub", presses in on detail open.
- **From website:** dashed amber outline, "From their website", "awaiting pub reply".
Differentiate the two states by **shape/treatment as well as colour** (solid vs dashed) so it survives a colourblind check.

**Trust badge copy (exact):**
- Pill (cards/list): `Checked with the pub · {date}` / `From the pub's site · {date}`
- Stamp (detail): `CHECKED WITH THE PUB` + `confirmed by reply · {date}` / `FROM THEIR WEBSITE` + `awaiting pub reply · since {date}`

**Motion (restrained):** pins drop in staggered on load; selected pin scales up; the confirmed stamp presses in; card hover lifts. **Respect `prefers-reduced-motion`.**

**Accessibility:** semantic HTML; visible `focus-visible` outlines (brass); WCAG-AA contrast; map pins are real buttons with `aria-label`; trust never relies on colour alone.

---

## 6. Feature: discovery (home `/`)

A **map-first home** where browse, search, and map coexist (all three weighted equally — that was a deliberate decision):

- **Map** (Mapbox, dark style) with a pin per venue. Pins are colour/shape-coded by trust state. Selecting a pin or a list card cross-highlights the other and opens detail.
- **Filter rail:** night-of-week chips (Any + Mon–Sun), a distance slider ("within N miles"), and a free-text search (pub or area). Filters update the map, the list, and the URL together.
- **Result list:** venue cards (name, area, distance, night, time, fee, trust pill). Clicking opens detail.
- **Empty state:** "No quizzes match. Try another night or widen the distance."
- **Responsive:** on mobile, a Map/List toggle; detail becomes a full-screen sheet.

*Reason:* discovery and SEO carry the product because there are no accounts, so the home must be fast, filterable, and shareable via URL.

---

## 7. Feature: listing detail

Opens as an overlay on `/` and is also the body of `/quiz/[city]/[slug]`. Shows every MVP field:

- Night + frequency, start time, entry fee (raw string as captured), booking required, host.
- **General notes** (short, curated) and **food & drink deals** (nice-to-have).
- **Website link** (prominent CTA) — doubles as transparency to the source.
- **Trust stamp** (§5).
- **"How we know" trail** — a 3-step timeline (Found on website → Emailed the pub → Confirmed / Reply pending) that makes the accuracy engine tangible. In Phase 1 this is rendered from the mock verification data.

*Reason:* the listing page is where the accuracy promise is felt; the badge + trail are the differentiator made visible.

---

## 8. Feature: meet in the middle (preview `/meet`)

Headline social feature, shipped as a clearly-labelled **preview** (it's a fast-follow that lands with geographic expansion):
- User drops a pin per mate on the map (up to ~4).
- Compute the centroid; show a "fair midpoint" marker; rank venues by distance to it; highlight the best as "fairest for everyone" plus runners-up.
- Works with no login (later: shareable links).

*Reason:* meet-in-the-middle's value scales with distance, so it's a fast-follow, but a working preview demonstrates the vision and is a strong group hook.

---

## 9. Data shape (Phase-1 mock)

Type the mock to the schema so the swap to Supabase is mechanical. Field names map to `schema.sql` (`entry_fee_raw`, `booking_required`, `general_notes`, `food_drink_deals`, `website_url`, `verification_source`, `last_confirmed_at`, `last_scraped_at`, `day_of_week`, `start_time`, `frequency`).

```ts
type VerificationSource = 'pub' | 'website';   // 'pub' = confirmed by reply
type DayKey = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';

interface TriviaVenue {
  id: string;
  slug: string;
  name: string;
  area: string;            // e.g. 'Stokes Croft'
  city: string;            // 'Bristol'
  lat: number; lng: number;
  day: DayKey;
  startTime: string;       // '8:00pm'
  frequency: string;       // 'Weekly' | 'Fortnightly' | 'Monthly · first Thu'
  entryFeeRaw: string;     // '£2 per person' | 'Free entry'
  bookingRequired: boolean;
  host: string;            // 'In-house' | 'QuizMasters Co.'
  generalNotes: string;
  foodDrinkDeals?: string;
  websiteUrl: string;
  verification: {
    source: VerificationSource;
    foundDate: string;     // scrape date, e.g. '2 Apr'
    emailDate: string;     // date pub was emailed, e.g. '5 Apr'
    confirmedDate: string; // badge date (populated for source='pub'), e.g. '12 Jun'
  };
}
```

**Sample dataset:** ~9 fictional Bristol pubs across different nights and both trust states, e.g.:

| Name | Area | lat, lng | Night | Source |
|---|---|---|---|---|
| The Foxed Badger | Stokes Croft | 51.4625, -2.5895 | Tue 8:00pm | pub |
| Anchor & Compass | Harbourside | 51.4490, -2.5990 | Wed 7:30pm | website |
| The Tipsy Vicar | Clifton | 51.4570, -2.6170 | Mon 8:30pm | pub |
| Brunel's Arms | Bedminster | 51.4400, -2.5970 | Thu 8:00pm | pub |
| The Hopful | Gloucester Rd | 51.4720, -2.5870 | Sun 7:00pm | website |
| Quill & Quaver | Old City | 51.4540, -2.5945 | Wed 8:00pm | pub |
| The Salty Parrot | Harbourside | 51.4475, -2.6010 | Thu 9:00pm | website |
| Wickham Tavern | Easton | 51.4640, -2.5640 | Tue 7:45pm | pub |
| The Bell & Whistle | Southville | 51.4430, -2.6060 | Fri 8:00pm | website |

(All fictional; for the demo only.) Distance is computed from a fixed "you are here" point near the city centre (51.4545, -2.5879).

---

## 10. Suggested components

`MapView`, `VenuePin`, `FilterRail` (DayChips, DistanceSlider, SearchBox), `VenueCard`, `ResultList`, `TrustPill`, `TrustStamp`, `VerificationTrail`, `ListingDetail`, `MeetMode` (FriendPins, MidpointMarker, RankedResults), `Header`, `MobileViewToggle`, `Legend`.

Keep `TrustPill` / `TrustStamp` / `VerificationTrail` reusable — they're the brand's signature and appear in cards, detail, and (later) admin.

---

## 11. Phase-1 acceptance criteria

- [ ] Map-first home renders all sample venues as trust-coded pins; pin ↔ card cross-highlight works.
- [ ] Night, distance, and search filters update map + list + URL together; empty state shows when nothing matches.
- [ ] Listing detail shows all MVP fields, the trust stamp (correct state + copy), and the "how we know" trail.
- [ ] `/quiz/[city]/[slug]` is server-rendered and directly linkable.
- [ ] `/meet` preview: drop pins → midpoint + ranked nearest venues; labelled "preview".
- [ ] Fully responsive; mobile Map/List toggle; detail as full-screen sheet on mobile.
- [ ] Trust states distinguishable without colour; keyboard-navigable; `prefers-reduced-motion` respected; AA contrast.
- [ ] No backend calls, no browser storage; all data from `lib/data.ts`.

---

## 12. Later phases (context, do not build now)

1. **Backend wiring** — Supabase (Postgres + PostGIS); swap `lib/data.ts` from mock to live queries; distance via `ST_DWithin`.
2. **Verification bot** — Playwright scrape → Claude extraction → listing goes live as `live_unverified`; Postmark email loop, **quarterly** re-confirmation, **2 follow-ups (3 emails)** before "no reply"; every change recorded with proof.
3. **Admin app** (`/admin`) — per-admin auth + roles; review queue with field-diff + proof; **review mode per city** (calibration "review all" → "auto-approve majority", with closures and low-confidence parses always reviewed); city + radius → discover → approve list → scrape; full audit trail.
4. **Meet in the middle, full** — shareable links, no login.
5. **Accounts** — saved favourites, notifications.

---

## 13. Decisions & reasons (consolidated log)

| Decision | Choice | Reason |
|---|---|---|
| Launch geography | Single city (Bristol, UK) | Dense local launch seeds a discovery product best |
| Accounts | None at MVP (open browse) | Lean; discovery + SEO carry it; filters shareable via URL instead |
| Discovery model | Map-first + night filter + distance, weighted equally | One screen serves browse, search, and map |
| Listing fields (core) | Day, time, frequency, entry fee, booking required, website link, general notes | The facts users act on; website link doubles as transparency |
| Listing fields (nice-to-have) | Food & drink deals | Changes often; lower priority |
| Trust badge | Date **+ source label**; two states | Showcases when a real pub reply backs the data — the thing competitors can't show |
| Accuracy baseline | Pub website scraped, listing goes live immediately | Fast coverage, no cold-start gate |
| Email loop | Reply-based; **quarterly**; **2 follow-ups** then flag | Simpler to build than a portal; the reply itself is the proof |
| Change review | Human reviews everything at first → **auto-approve majority** once trusted | Earn trust during a calibration period, then cut review load |
| Always-review (even in auto) | Closures + low-confidence parses | Highest-risk signals stay in front of a person; low-confidence is the safety net for day/time/fee |
| Audit trail | Every change logged with proof, auto or manual | Provenance promise; powers a future public "verification history" |
| New-city seeding | City **+ radius** → discover → **approve the list** → scrape | Radius bounds cost/coverage; human approval keeps the quality bar |
| Admin auth | Per-admin logins + roles | Attribution for the audit trail; GDPR accountability |
| Meet in the middle | Fast-follow; preview now | Value scales with distance; preview shows the vision |
| Jurisdiction / compliance | UK; PECR + UK GDPR; legitimate interest, opt-outs, suppression list | Confirming listings is data-accuracy, not marketing, but the rules still apply |
| Monetization | Parked | Decide later; doesn't shape the MVP |
| Tech stack | Next.js/Vercel · Mapbox · Supabase Postgres+PostGIS · Playwright + Claude API · Postmark | SEO, geospatial, deliverability, and messy-data parsing each drove a choice (see §3) |

---

*Companion docs: `mvp-spec`, `schema.sql`, `schema-design`, `admin-app-spec`. This brief is self-contained for Phase 1; the companions add depth for later phases.*
