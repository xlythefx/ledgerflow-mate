export interface Transaction {
  id: string;
  date: string;
  transactionId: string;
  recipient: string;
  payer: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  reason: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: "1", date: "2025-03-28", transactionId: "TXN-001247",
    recipient: "John Smith - SEO Manager", payer: "Anastasia", amount: 4500,
    status: "completed", reason: "Manager - Affiliate - SEO",
  },
  {
    id: "2", date: "2025-03-27", transactionId: "TXN-001246",
    recipient: "AWS Cloud Services", payer: "Anastasia", amount: 1234.56,
    status: "completed", reason: "Tools and Subscription - Domains",
  },
  {
    id: "3", date: "2025-03-27", transactionId: "TXN-001245",
    recipient: "Maria Lopez - Content Writer", payer: "Anastasia", amount: 2200,
    status: "pending", reason: "Employee - Content - eToro Tier 1",
  },
  {
    id: "4", date: "2025-03-26", transactionId: "TXN-001244",
    recipient: "Semrush Subscription", payer: "Anastasia", amount: 449.95,
    status: "completed", reason: "Tools and Subscription - SEO",
  },
  {
    id: "5", date: "2025-03-25", transactionId: "TXN-001243",
    recipient: "David Chen - Developer", payer: "Anastasia", amount: 6800,
    status: "completed", reason: "Freelancer - Website Development",
  },
  {
    id: "6", date: "2025-03-24", transactionId: "TXN-001242",
    recipient: "WeWork Office Space", payer: "Anastasia", amount: 3200,
    status: "completed", reason: "Office - General",
  },
  {
    id: "7", date: "2025-03-23", transactionId: "TXN-001241",
    recipient: "Elena Petrova - VA", payer: "Anastasia", amount: 1500,
    status: "failed", reason: "Employee - Link building - eToro Tier 1",
  },
  {
    id: "8", date: "2025-03-22", transactionId: "TXN-001240",
    recipient: "Google Workspace", payer: "Anastasia", amount: 288,
    status: "completed", reason: "Tools and Subscription - Email marketing",
  },
  {
    id: "9", date: "2025-03-21", transactionId: "TXN-001239",
    recipient: "eToro Affiliate Payout", payer: "eToro", amount: 12500,
    status: "completed", reason: "Income - eToro Tier 1",
  },
  {
    id: "10", date: "2025-03-20", transactionId: "TXN-001238",
    recipient: "Nina Patel - Outreach", payer: "Anastasia", amount: 1800,
    status: "completed", reason: "Link building - Kats Botanicals",
  },
  {
    id: "11", date: "2025-03-19", transactionId: "TXN-001237",
    recipient: "Bank Transfer Fee", payer: "Bank", amount: 45,
    status: "completed", reason: "Fees - Bank",
  },
  {
    id: "12", date: "2025-03-18", transactionId: "TXN-001236",
    recipient: "Tax Authority Payment", payer: "Anastasia", amount: 8900,
    status: "completed", reason: "Authorities - TAX",
  },
  {
    id: "13", date: "2025-03-17", transactionId: "TXN-001235",
    recipient: "Clear Talk Teachers", payer: "Anastasia", amount: 3400,
    status: "pending", reason: "Clear Talk - Teachers",
  },
  {
    id: "14", date: "2025-03-16", transactionId: "TXN-001234",
    recipient: "Upwork Freelancer - Content", payer: "Anastasia", amount: 950,
    status: "completed", reason: "Upwork - Content affiliate",
  },
  {
    id: "15", date: "2025-03-15", transactionId: "TXN-001233",
    recipient: "Insurance Premium", payer: "Anastasia", amount: 1200,
    status: "completed", reason: "Insurance",
  },
  {
    id: "16", date: "2025-03-14", transactionId: "TXN-001232",
    recipient: "Rock West Payout", payer: "Rock West", amount: 5600,
    status: "completed", reason: "Income - Rock West",
  },
];
