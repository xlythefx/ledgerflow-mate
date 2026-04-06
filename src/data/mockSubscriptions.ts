export interface Subscription {
  id: string;
  toolName: string;
  amount: number;
  billingCycle: "Monthly" | "Yearly";
  nextBillingDate: string;
  status: "active" | "paused" | "cancelled";
  reason: string;
  bank: string;
}

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub-1", toolName: "Semrush", amount: 449.95,
    billingCycle: "Monthly", nextBillingDate: "2026-04-08",
    status: "active", reason: "Tools and Subscription - SEO", bank: "PayPal",
  },
  {
    id: "sub-2", toolName: "Google Workspace", amount: 288,
    billingCycle: "Yearly", nextBillingDate: "2026-04-07",
    status: "active", reason: "Tools and Subscription - Email marketing", bank: "PayPal",
  },
  {
    id: "sub-3", toolName: "AWS Cloud Services", amount: 1234.56,
    billingCycle: "Monthly", nextBillingDate: "2026-04-12",
    status: "active", reason: "Tools and Subscription - Domains", bank: "Discount Wire",
  },
  {
    id: "sub-4", toolName: "Ahrefs", amount: 199,
    billingCycle: "Monthly", nextBillingDate: "2026-04-06",
    status: "active", reason: "Tools and Subscription - SEO", bank: "PayPal",
  },
  {
    id: "sub-5", toolName: "Slack Business+", amount: 150,
    billingCycle: "Monthly", nextBillingDate: "2026-04-20",
    status: "active", reason: "Tools and Subscription - General", bank: "Discount Wire",
  },
  {
    id: "sub-6", toolName: "Notion Team", amount: 96,
    billingCycle: "Yearly", nextBillingDate: "2026-06-15",
    status: "active", reason: "Tools and Subscription - General", bank: "PayPal",
  },
  {
    id: "sub-7", toolName: "Mailchimp Premium", amount: 350,
    billingCycle: "Monthly", nextBillingDate: "2026-04-09",
    status: "paused", reason: "Tools and Subscription - Email marketing", bank: "PayPal",
  },
  {
    id: "sub-8", toolName: "Canva Pro", amount: 120,
    billingCycle: "Yearly", nextBillingDate: "2026-09-01",
    status: "active", reason: "Tools and Subscription - Design", bank: "PayPal",
  },
];
