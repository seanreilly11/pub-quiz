# Round Two — UI Design Spec

*Phase 1 consumer UI · approved 28 June 2026*

---

## Overview

Round Two is a pub quiz night finder for Bristol. The UI's core job is making accurate listings **findable fast** and making that accuracy **visibly credible**. There are no accounts, so every feature is open and every filtered view is shareable via URL.

---

## Design Direction

**Theme:** "Pub Atmosphere" — dark, after-dark, candlelit. Feels like the venue itself.

### Palette

| Token | Hex | Use |
|---|---|---|
| `ink` | `#13201B` | App background |
| `bottle` | `#1C3328` | Panels, cards, header |
| `bottle2` | `#24412F` | Raised surfaces, hover state |
| `brass` | `#D8A33B` | Primary accent — wordmark, CTAs, active chips, entry fee |
| `brassSoft` | `#E8C77E` | Highlights, hover on brass |
| `chalk` | `#F1EAD9` | Primary text |
| `chalkDim` | `#A89F8B` | Secondary text, labels, metadata |
| `confirmed` | `#6FBE8E` | Pub-confirmed trust state |
| `website` | `#D89B4C` | From-website trust state |
| `line` | `rgba(241,234,217,0.12)` | Hairlines, dividers, borders |

### Typography

- **Oswald** (display): wordmark, section headers, eyebrow labels (tracked out, uppercase)
- **Inter** (body): all body copy, controls, metadata, data fields

### Motion

Restrained. Pins drop-in staggered on load; selected pin scales up; trust stamp "presses in" on detail open; card hover lifts. All animations respect `prefers-reduced-motion`.

### Responsive approach

**Mobile-first throughout.** All CSS starts from the smallest viewport and adds complexity upward via `min-width` breakpoints — never `max-width` overrides.

- Spacing and font sizes use `rem` (base 16px) so they scale with user font preferences
- Layout widths use `%` or `fr` units; fixed `px` widths only for minimum touch targets (44px) and map legend overlays
- Breakpoints: `md` = `768px` (tablet/desktop split), `lg` = `1024px` (wide desktop)
- Tailwind classes written mobile-first: base class = mobile, `md:` = desktop enhancement (e.g. `flex-col md:flex-row`)
- The detail panel and result list are `hidden md:flex` — they don't exist in the DOM on mobile, replaced by the bottom sheet

---

## Routes

| Route | Description |
|---|---|
| `/` | Map-first home: map + filter rail + result list + detail overlay |
| `/quiz/[city]/[slug]` | Server-rendered listing page (same detail component, for SEO) |
| `/meet` | Meet in the middle (labelled "Preview") |
| `/admin` | Placeholder only in Phase 1 |

---

## Screen 1: Home (`/`)

Design is **mobile-first**. The mobile layout is the base; desktop adds panels without changing any component behaviour.

### Mobile layout (base)

```
┌──────────────────────┐
│ ROUND TWO      [🔍]  │  ← header
├──────────────────────┤
│ [Any][Mon][Tue][Wed]→│  ← day chips (horizontal scroll)
├──────────────────────┤
│  [Map]   [List]      │  ← view toggle
├──────────────────────┤
│                      │
│   MAP — full screen  │  (Map view active)
│   ● ●   ◉  ●        │
│                      │
│ ┌────────────────┐   │
│ │ 9 quizzes  ╌╌╌│   │  ← bottom sheet peeks up
│ │ [card] [card]  │   │
│ └────────────────┘   │
└──────────────────────┘
```

- **Map view (default):** Full-screen map. Bottom sheet peeks up showing count + top 2 cards; drag up to reveal full scrollable list.
- **List view:** Full-screen scrollable card list, map hidden.
- **Day chips** scroll horizontally in a single row (no wrap).
- **Within slider + search** are tucked behind a filter icon (🔍) in the header to keep the rail compact on mobile. Tapping opens a bottom sheet with both controls.
- **Detail:** Tapping a card or pin slides a full-screen bottom sheet up from the bottom with all listing fields, trust stamp, and verification trail. Swipe down or × to dismiss.

### Desktop enhancement (`md` breakpoint and up)

```
┌─────────────────────────────────────────────────────┐
│ ROUND TWO              [Meet in the middle →]        │  ← header (52px)
├─────────────────────────────────────────────────────┤
│ Night: [Any][Mon][Tue]…  Within: ──●── 3mi  [🔍 …] │  ← filter rail (all controls visible)
├──────────────────────────┬──────────────┬────────────┤
│                          │              │            │
│   MAP (Mapbox dark)      │   DETAIL     │  RESULTS   │
│   pins: ● confirmed      │   OVERLAY    │  LIST      │
│         ◉ website        │   (400px)    │  (340px)   │
│                          │              │            │
└──────────────────────────┴──────────────┴────────────┘
```

- Map/List toggle disappears; all three panels coexist.
- Filter rail shows all controls inline (no collapsed sheet).
- Detail overlay slides in between map and list panel when a pin or card is selected.
- "Meet in the middle" nav link visible in header.

### Header

- Wordmark `ROUND TWO` in Oswald/brass, uppercase, tracked
- Tagline `Bristol pub quiz nights` in chalk/dim (hidden on mobile to save space)
- "Meet in the middle" link right-aligned (desktop); replaced by 🔍 filter icon (mobile)

### Filter Rail

- **Night chips:** `Any | Mon | Tue | Wed | Thu | Fri | Sat | Sun` — pill shape, active state fills brass
- **Within slider:** range input 0.5–5 mi, current value shown in brass
- **Search box:** dark inset, placeholder `Pub name or area…`
- All three filters update map pins, result list, and URL params simultaneously

### Map

- Mapbox GL JS, custom dark style matching ink/bottle palette
- One pin per venue; pins are `border-radius: 50% 50% 50% 0; transform: rotate(-45deg)` drop-pin shape
- **Green pin** (`confirmed`) = pub replied to confirm; **amber pin** (`website`) = from their site only
- Selected pin scales up with a glow ring; selecting a pin cross-highlights its card and opens detail
- Legend overlay (top-left): `● Checked with pub / ● From their website`

### Result List

Scrollable list of `VenueCard` components sorted by distance.

**VenueCard fields:** name, area, night + time, distance, entry fee, trust pill.

**Trust pill variants:**
- `confirmed`: solid green border, filled dot — `Checked with pub · {date}`
- `website`: dashed amber border, amber dot — `From pub's site · {date}`

Shape (solid vs dashed) distinguishes states independently of colour for colourblind users.

**Empty state:** "No quizzes match. Try another night or widen the distance."

### Detail (bottom sheet on mobile / overlay panel on desktop)

Shows all MVP fields when a venue is selected.

**Fields (2-col grid):** Night, Starts, Entry fee (in brass), Frequency, Host, Booking required.

**General notes:** left-bordered block in brass.

**Trust Stamp:**
- `confirmed`: solid green card, circular seal rotated −6°, checkmark icon, `CHECKED WITH THE PUB` / `confirmed by reply · {date}`
- `website`: dashed amber card, clock icon, `FROM THEIR WEBSITE` / `awaiting pub reply · since {date}`

**"How we know" trail:** 3-step vertical timeline
1. Found on their website — `{foundDate} · scraped from {domain}`
2. Emailed the pub — `{emailDate} · asked to confirm details`
3. Pub confirmed by reply — `{confirmedDate}` (filled dot) **or** Reply pending (dim dot, shown for `website` source)

**Website CTA:** full-width brass button `Visit their website →`.

**Close:** × button top-right (desktop) / swipe down (mobile).

---

## Screen 2: Listing Page (`/quiz/[city]/[slug]`)

Server-rendered. Uses the same `ListingDetail` component as the overlay — no separate design needed. Rendered at full-page width with a back link to `/`.

---

## Screen 3: Meet in the Middle (`/meet`)

**Preview banner** (brass tint, full width below header): `PREVIEW · Drop a pin for each mate and we'll find the fairest quiz for everyone.`

### Mobile layout (base)

```
┌──────────────────────┐
│ ROUND TWO   [← Back] │  ← header
├──────────────────────┤
│ ▒ PREVIEW  Drop …    │  ← preview banner
├──────────────────────┤
│                      │
│   MAP — full screen  │
│   ● You              │
│   ···> ◎ midpoint    │
│        ···> ● Ash    │
│   ● Roz   [+] add   │
│                      │
│ ┌────────────────┐   │
│ │ Fairest for…   │   │  ← bottom sheet peeks
│ │ 1. Quill & Q ★ │   │
│ │ 2. Foxed Badger│   │
│ └────────────────┘   │
└──────────────────────┘
```

- Map fills the screen; ranked results peek up in a bottom sheet (drag up for full list)
- Friend pins placed by tapping the map; `[+]` placeholder pin invites adding more

### Desktop enhancement

```
┌──────────────────────────┬──────────────────┐
│   MAP                    │ Fairest for      │
│   ● You  ● Ash  ● Roz   │ everyone         │
│   ···> ◎ midpoint <···   │ ─────────────    │
│   · venue dots ·         │ 1. Quill & Q. ★ │
│   [+] add mate           │ 2. Foxed Badger  │
│                          │ 3. Anchor & C.   │
└──────────────────────────┴──────────────────┘
```

- Ranked results move to a fixed right panel (same width as the result list on `/`)

### Shared behaviour (all viewports)

- Each person gets a colour-coded circle pin (You = brass, others = purple/pink/teal)
- Dashed lines connect each person's pin to the computed centroid
- Centroid shown as an amber ring marker with `MIDPOINT` label
- Venue dots (green) appear near midpoint; closest to midpoint = #1
- #1 gets "Fairest for everyone" badge in confirmed-green
- `[+]` empty-slot pin (dashed outline) invites adding more friends (max 4)

---

## Component Inventory

| Component | Purpose |
|---|---|
| `Header` | Logo + meet link |
| `FilterRail` | DayChips + DistanceSlider + SearchBox |
| `MapView` | Mapbox map + pin rendering |
| `VenuePin` | Map pin, trust-coded, selectable |
| `Legend` | Map overlay explaining pin colours |
| `ResultList` | Scrollable list of VenueCards |
| `VenueCard` | Name, area, night/time, distance, fee, TrustPill |
| `TrustPill` | Inline badge — solid green or dashed amber |
| `ListingDetail` | Full detail panel/page: fields + TrustStamp + VerificationTrail + CTA |
| `TrustStamp` | Large stamp element — confirmed (solid seal) or website (dashed) |
| `VerificationTrail` | 3-step timeline showing how data was gathered |
| `MobileViewToggle` | Map / List tab switcher (mobile only) |
| `MobileBottomSheet` | Draggable sheet for map-peek and detail on mobile |
| `MeetMode` | `/meet` page: FriendPins + MidpointMarker + RankedResults |

`TrustPill`, `TrustStamp`, and `VerificationTrail` are standalone reusable components — they appear in cards, detail, and (later) the admin app.

---

## Accessibility

- Semantic HTML throughout; headings in logical order
- Map pins are `<button>` elements with `aria-label="The Foxed Badger — Tuesday 8pm, confirmed"`
- Trust states use shape (solid vs dashed border) **and** colour — passes colourblind check
- `focus-visible` outlines in brass on all interactive elements
- WCAG AA contrast on all text/background combinations
- All animations gated on `prefers-reduced-motion: no-preference`

---

## Data

All data in Phase 1 comes from `lib/data.ts` (mock). Types mirror `schema.sql` field names exactly so the swap to Supabase is mechanical — no UI changes required.

Key type: `TriviaVenue` with fields `id`, `slug`, `name`, `area`, `city`, `lat`, `lng`, `day`, `startTime`, `frequency`, `entryFeeRaw`, `bookingRequired`, `host`, `generalNotes`, `foodDrinkDeals?`, `websiteUrl`, `verification: { source, foundDate, emailDate, confirmedDate }`.

`emailDate` is the date the pub was emailed to confirm. Shown as step 2 of the verification trail. Present on all venues (email is sent for both trust states; `confirmedDate` is only populated for `source: 'pub'`).

`verification.source` drives all trust UI: `'pub'` = confirmed state, `'website'` = from-website state.

---

## Out of Scope (Phase 1)

No backend, no Supabase, no auth, no localStorage, no email, no scraping. Admin route is a placeholder only.
