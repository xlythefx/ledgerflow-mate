export interface Transaction {
  id: string;
  date: string;
  transactionId: string;
  recipient: string;
  payer: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  tags: { label: string; category: string; subItems?: string[]; employees?: string[] }[];
}

export const mockTransactions: Transaction[] = [
  {
    id: "1", date: "2025-03-28", transactionId: "TXN-001247",
    recipient: "John Smith - SEO Manager", payer: "Anastasia", amount: 4500,
    status: "completed",
    tags: [
      { label: "Managers", category: "department", subItems: ["SEO Team", "Content Ops"], employees: ["John Smith", "Sarah Kim", "Alex Turner"] },
      { label: "Link Building", category: "project", subItems: ["Outreach Campaign Q1"], employees: ["John Smith", "Nina Patel"] },
      { label: "ClientCo", category: "client", subItems: ["Retainer Contract"], employees: ["John Smith"] },
    ],
  },
  {
    id: "2", date: "2025-03-27", transactionId: "TXN-001246",
    recipient: "AWS Cloud Services", payer: "Anastasia", amount: 1234.56,
    status: "completed",
    tags: [
      { label: "Infrastructure", category: "department", subItems: ["Cloud", "DevOps"], employees: ["David Chen", "Mike Ross"] },
      { label: "IP Services", category: "project", subItems: ["Proxy Network", "Server Fleet"], employees: ["David Chen"] },
    ],
  },
  {
    id: "3", date: "2025-03-27", transactionId: "TXN-001245",
    recipient: "Maria Lopez - Content Writer", payer: "Anastasia", amount: 2200,
    status: "pending",
    tags: [
      { label: "Content", category: "department", subItems: ["Writers", "Editors"], employees: ["Maria Lopez", "Tom Briggs", "Anya Shah"] },
      { label: "Blog Refresh", category: "project", employees: ["Maria Lopez"] },
      { label: "InternalOps", category: "client" },
    ],
  },
  {
    id: "4", date: "2025-03-26", transactionId: "TXN-001244",
    recipient: "Semrush Subscription", payer: "Anastasia", amount: 449.95,
    status: "completed",
    tags: [
      { label: "Tools", category: "department", subItems: ["SEO Tools", "Analytics"], employees: ["John Smith", "Sarah Kim"] },
      { label: "Link Building", category: "project", employees: ["John Smith", "Nina Patel"] },
    ],
  },
  {
    id: "5", date: "2025-03-25", transactionId: "TXN-001243",
    recipient: "David Chen - Developer", payer: "Anastasia", amount: 6800,
    status: "completed",
    tags: [
      { label: "Engineering", category: "department", subItems: ["Frontend", "Backend"], employees: ["David Chen", "Lisa Wang", "Raj Gupta"] },
      { label: "Dashboard v2", category: "project", subItems: ["Finance Module", "Reports"], employees: ["David Chen", "Lisa Wang"] },
      { label: "ClientCo", category: "client", employees: ["David Chen"] },
    ],
  },
  {
    id: "6", date: "2025-03-24", transactionId: "TXN-001242",
    recipient: "WeWork Office Space", payer: "Anastasia", amount: 3200,
    status: "completed",
    tags: [
      { label: "Operations", category: "department", subItems: ["Facilities"], employees: ["Anastasia", "HR Team"] },
    ],
  },
  {
    id: "7", date: "2025-03-23", transactionId: "TXN-001241",
    recipient: "Elena Petrova - VA", payer: "Anastasia", amount: 1500,
    status: "failed",
    tags: [
      { label: "Admin", category: "department", employees: ["Elena Petrova"] },
      { label: "Outreach", category: "project", subItems: ["Email Campaigns"], employees: ["Elena Petrova", "Nina Patel"] },
      { label: "MegaCorp", category: "client", employees: ["Elena Petrova"] },
    ],
  },
  {
    id: "8", date: "2025-03-22", transactionId: "TXN-001240",
    recipient: "Google Workspace", payer: "Anastasia", amount: 288,
    status: "completed",
    tags: [
      { label: "Tools", category: "department", employees: ["All Staff"] },
      { label: "InternalOps", category: "client" },
    ],
  },
];
