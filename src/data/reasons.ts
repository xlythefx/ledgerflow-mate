export const REASON_LIST = [
  "Asset - Property",
  "Authorities",
  "Authorities - VAT",
  "Authorities - TAX",
  "Loan",
  "Pension",
  "Accounty",
  "Management Fee",
  "Fees - Upwork",
  "Fees - Bank",
  "Fees - Credit card",
  "Fees - Grow",
  "Employee - HR",
  "Employee - IT",
  "Employee - Finance Manager",
  "Employee - CFO",
  "Employee - CTO",
  "Employee - Content - eToro Tier 1",
  "Employee - Content - eToro Tier 2+3",
  "Employee - Content - Kats Botanicals",
  "Employee - Content - Londonlocksmith",
  "Employee - Content - Real Botanicals",
  "Employee - Link building",
  "Employee - Link building - eToro Tier 1",
  "Employee - Link building - eToro Tier 2 + 3",
  "Employee - Link building - Kats Botanicals",
  "Employee - Link building - Real Botanicals",
  "Employee - Link building - FTD limited",
  "Employee - Affiliate - Content",
  "Employee / Freelancer - Upwork",
  "Manager - Affiliate - Content",
  "Manager - Affiliate - SEO",
  "Manager - Affiliate",
  "Manager - Link building - eToro Tier 1",
  "Manager - Link building - eToro Tier 2+3",
  "Manager - Social Media Campaign",
  "Freelancer - Website Development",
  "Link building - Londonlocksmith",
  "Link building - eToro 2+3",
  "Link building - eToro Tier 1",
  "Link building - FTD Systems",
  "Link building - Bybit",
  "Link building - Maryna Kotliar",
  "Link building - Kats Botanicals",
  "Link building - Gamewize SK",
  "Link building - Rock West",
  "Link building - Real botanicals",
  "Link building - Affiliate",
  "Contant - eToro Tier 1",
  "Contant - eToro Tier 2+3",
  "Tools and Subscription",
  "Tools and Subscription - Office",
  "Tools and Subscription - Domains",
  "Tools and Subscription - SEO",
  "Tools and Subscription - Lead generation",
  "Tools and Subscription - Email marketing",
  "Tools and Subscription - Design",
  "Office - General",
  "Income - Clear Talk",
  "Income - Affiliate",
  "Income - Kats Botanicals",
  "Income - Maryna Kotliar",
  "Income - eToro Tier 2+3",
  "Income - eToro Tier 1",
  "Income - FTD Limited",
  "Income - Rock West",
  "Income - Real Botanicals",
  "Income - Pixel Forge Labs",
  "Clear Talk - Tools and subscription",
  "Clear Talk - Teachers",
  "Clear Talk - Content",
  "Insurance",
  "Business trip",
  "Upwork - Content clients",
  "Upwork - Content affiliate",
] as const;

export type ReasonString = (typeof REASON_LIST)[number] | string;

export interface ParsedReason {
  full: string;
  segments: string[];
}

export function parseReason(reason: string): ParsedReason {
  // Normalize "\" or "/" separators to " - "
  const normalized = reason.replace(/\s*[\/\\]\s*/g, " - ");
  const segments = normalized.split(" - ").map((s) => s.trim()).filter(Boolean);
  return { full: reason, segments };
}

export interface SegmentHierarchy {
  level1: string[];
  level2Map: Record<string, string[]>;
  level3Map: Record<string, string[]>;
}

export function getSegmentHierarchy(reasons: string[]): SegmentHierarchy {
  const level1Set = new Set<string>();
  const level2Map: Record<string, Set<string>> = {};
  const level3Map: Record<string, Set<string>> = {};

  for (const reason of reasons) {
    const { segments } = parseReason(reason);
    if (segments.length >= 1) {
      level1Set.add(segments[0]);
    }
    if (segments.length >= 2) {
      const key = segments[0];
      if (!level2Map[key]) level2Map[key] = new Set();
      level2Map[key].add(segments[1]);
    }
    if (segments.length >= 3) {
      const key = `${segments[0]}||${segments[1]}`;
      if (!level3Map[key]) level3Map[key] = new Set();
      level3Map[key].add(segments[2]);
    }
  }

  const toRecord = (map: Record<string, Set<string>>) => {
    const result: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(map)) {
      result[k] = Array.from(v).sort();
    }
    return result;
  };

  return {
    level1: Array.from(level1Set).sort(),
    level2Map: toRecord(level2Map),
    level3Map: toRecord(level3Map),
  };
}

// Segment depth color classes using design tokens
export const segmentColors: Record<number, string> = {
  0: "bg-info/15 text-info border-info/30",
  1: "bg-primary/15 text-primary border-primary/30",
  2: "bg-warning/15 text-warning border-warning/30",
};
