

# Hierarchical Tagging System with Smart Parsing & Dynamic Totals

## Overview

Replace the current flat tag system with a hierarchical "Reason" system that parses ~80 predefined reason strings (e.g., `"Employee - Content - eToro Tier 1"`) into structured segments. Table rows show colored segment badges; hovering shows the full reason. Filters work per segment level. A KPI card updates totals dynamically based on active filters.

## Data Model

### New file: `src/data/reasons.ts`

- Export the full list of ~80 reason strings as a constant array.
- Export a `parseReason(reason: string)` utility that splits on ` - ` to produce `{ full: string, segments: string[] }`. Example: `"Employee - Content - eToro Tier 1"` → `{ full: "Employee - Content - eToro Tier 1", segments: ["Employee", "Content", "eToro Tier 1"] }`.
- Export a `getSegmentHierarchy(reasons)` function that builds a lookup of unique values at each segment level (Level 1: "Employee", "Link building", "Income", etc.; Level 2: "Content", "SEO", etc.; Level 3: project names).
- Define segment-level color maps (Level 1 = blue/info, Level 2 = purple/primary, Level 3 = amber/warning).

### Update `src/data/mockData.ts`

- Replace the current `tags` array on each transaction with a `reason: string` field (the full reason string, e.g., `"Employee - Content - eToro Tier 1"`).
- Assign realistic reasons from the provided list to each mock transaction.
- Update the `Transaction` interface accordingly.

## Components

### Update `src/components/TagBadge.tsx` → `ReasonBadges`

- New component `ReasonBadges` that takes a `reason: string` prop.
- Calls `parseReason()` to split into segments.
- Renders each segment as a colored `Badge` (color by segment depth).
- Wraps the entire row of badges in a `Tooltip` that shows the full reason string on hover.

### New: `src/components/ReasonFilter.tsx`

- Three cascading `Select` dropdowns: **Category** (Level 1), **Department** (Level 2), **Project** (Level 3).
- Each level's options are derived dynamically from the reason list, filtered by the parent selection.
- Example: selecting "Employee" in Level 1 narrows Level 2 to "Content", "Link building", "HR", "IT", etc.
- Exposes `{ category, department, project }` filter state via props/callbacks.

### New: `src/components/ExpenseSummaryCard.tsx`

- A KPI card showing **Total Expenses** for the currently filtered transaction set.
- Shows the active filter context (e.g., "Filtered: Link building") and count of matching transactions.
- Placed above the table in TransactionsPage.

## Page Updates

### `src/pages/TransactionsPage.tsx`

1. Replace the single tag `Select` filter with the `ReasonFilter` component (3 cascading selects).
2. Update filtering logic: match transactions whose parsed reason segments match the selected category/department/project filters.
3. Add `ExpenseSummaryCard` above the filter bar, passing the filtered transactions to compute the sum.
4. Replace `TagBadge` usage in table rows with `ReasonBadges`.
5. Keep existing search and status filters as-is.

## Technical Notes

- No new dependencies needed — uses existing shadcn `Select`, `Badge`, `Tooltip` components.
- The `parseReason` parser handles edge cases: single-segment reasons (e.g., "Authorities"), typos in the list (e.g., "Contant" kept as-is from source data), and reasons with ` \ ` separators normalized to ` - `.
- All 80+ reasons stored as a flat string array — the hierarchy is derived at runtime via parsing, keeping it aligned with how the Laravel backend will store reason strings.

