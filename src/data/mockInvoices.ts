export type InvoiceStatus = "matched" | "unmatched" | "pending";

export interface Invoice {
  id: string;
  fileName: string;
  fileType: "pdf" | "image";
  uploadDate: string;
  vendor: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  matchedTransactionId?: string;
  ocrData: {
    vendor: string;
    invoiceNumber: string;
    date: string;
    amount: string;
    currency: string;
    taxAmount?: string;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
    notes?: string;
    confidence: number;
  };
}

export const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    fileName: "invoice_john_smith_mar25.pdf",
    fileType: "pdf",
    uploadDate: "2025-03-28",
    vendor: "John Smith - SEO Manager",
    invoiceNumber: "JS-2025-031",
    invoiceDate: "2025-03-28",
    amount: 4500,
    currency: "USD",
    status: "matched",
    matchedTransactionId: "1",
    ocrData: {
      vendor: "John Smith - SEO Manager",
      invoiceNumber: "JS-2025-031",
      date: "2025-03-28",
      amount: "4,500.00",
      currency: "USD",
      lineItems: [
        { description: "SEO Management - March 2025", quantity: 1, unitPrice: 4500, total: 4500 },
      ],
      notes: "March salary - SEO management",
      confidence: 97,
    },
  },
  {
    id: "inv-2",
    fileName: "aws_invoice_mar25.pdf",
    fileType: "pdf",
    uploadDate: "2025-03-27",
    vendor: "AWS Cloud Services",
    invoiceNumber: "AWS-9281734",
    invoiceDate: "2025-03-27",
    amount: 1234.56,
    currency: "USD",
    status: "matched",
    matchedTransactionId: "2",
    ocrData: {
      vendor: "Amazon Web Services, Inc.",
      invoiceNumber: "AWS-9281734",
      date: "2025-03-27",
      amount: "1,234.56",
      currency: "USD",
      taxAmount: "0.00",
      lineItems: [
        { description: "EC2 Instances", quantity: 1, unitPrice: 892.30, total: 892.30 },
        { description: "S3 Storage", quantity: 1, unitPrice: 156.26, total: 156.26 },
        { description: "CloudFront CDN", quantity: 1, unitPrice: 186.00, total: 186.00 },
      ],
      confidence: 99,
    },
  },
  {
    id: "inv-3",
    fileName: "semrush_receipt.png",
    fileType: "image",
    uploadDate: "2025-03-26",
    vendor: "Semrush",
    invoiceNumber: "SEM-44812",
    invoiceDate: "2025-03-26",
    amount: 449.95,
    currency: "USD",
    status: "matched",
    matchedTransactionId: "4",
    ocrData: {
      vendor: "Semrush Inc.",
      invoiceNumber: "SEM-44812",
      date: "2025-03-26",
      amount: "449.95",
      currency: "USD",
      lineItems: [
        { description: "Guru Plan - Monthly", quantity: 1, unitPrice: 449.95, total: 449.95 },
      ],
      confidence: 94,
    },
  },
  {
    id: "inv-4",
    fileName: "david_chen_invoice.pdf",
    fileType: "pdf",
    uploadDate: "2025-03-25",
    vendor: "David Chen",
    invoiceNumber: "DC-2025-008",
    invoiceDate: "2025-03-24",
    amount: 6800,
    currency: "USD",
    status: "matched",
    matchedTransactionId: "5",
    ocrData: {
      vendor: "David Chen - Web Development",
      invoiceNumber: "DC-2025-008",
      date: "2025-03-24",
      amount: "6,800.00",
      currency: "USD",
      lineItems: [
        { description: "Website Redesign - Phase 2", quantity: 40, unitPrice: 150, total: 6000 },
        { description: "Bug fixes & QA", quantity: 8, unitPrice: 100, total: 800 },
      ],
      notes: "Net 30 payment terms",
      confidence: 96,
    },
  },
  {
    id: "inv-5",
    fileName: "unknown_vendor_receipt.jpg",
    fileType: "image",
    uploadDate: "2025-03-26",
    vendor: "Unknown",
    invoiceNumber: "UNK-001",
    invoiceDate: "2025-03-25",
    amount: 780,
    currency: "USD",
    status: "pending",
    ocrData: {
      vendor: "Unclear - partially obscured",
      invoiceNumber: "UNK-001",
      date: "2025-03-25",
      amount: "780.00",
      currency: "USD",
      lineItems: [
        { description: "Consulting services", quantity: 1, unitPrice: 780, total: 780 },
      ],
      notes: "Low quality scan - vendor name partially visible",
      confidence: 62,
    },
  },
  {
    id: "inv-6",
    fileName: "freelancer_invoice_elena.pdf",
    fileType: "pdf",
    uploadDate: "2025-03-23",
    vendor: "Elena Petrova",
    invoiceNumber: "EP-2025-012",
    invoiceDate: "2025-03-22",
    amount: 1500,
    currency: "USD",
    status: "unmatched",
    ocrData: {
      vendor: "Elena Petrova - Virtual Assistant",
      invoiceNumber: "EP-2025-012",
      date: "2025-03-22",
      amount: "1,500.00",
      currency: "USD",
      lineItems: [
        { description: "Link outreach - March batch", quantity: 1, unitPrice: 1200, total: 1200 },
        { description: "Email management", quantity: 1, unitPrice: 300, total: 300 },
      ],
      confidence: 95,
    },
  },
  {
    id: "inv-7",
    fileName: "wework_invoice_apr.pdf",
    fileType: "pdf",
    uploadDate: "2025-03-24",
    vendor: "WeWork",
    invoiceNumber: "WW-TLV-20250401",
    invoiceDate: "2025-03-24",
    amount: 3200,
    currency: "USD",
    status: "matched",
    matchedTransactionId: "6",
    ocrData: {
      vendor: "WeWork Companies LLC",
      invoiceNumber: "WW-TLV-20250401",
      date: "2025-03-24",
      amount: "3,200.00",
      currency: "USD",
      taxAmount: "576.00",
      lineItems: [
        { description: "Hot Desk - April 2025", quantity: 1, unitPrice: 2624, total: 2624 },
        { description: "VAT (18%)", quantity: 1, unitPrice: 576, total: 576 },
      ],
      confidence: 98,
    },
  },
  {
    id: "inv-8",
    fileName: "upwork_receipt_content.pdf",
    fileType: "pdf",
    uploadDate: "2025-03-16",
    vendor: "Upwork",
    invoiceNumber: "UPW-8834291",
    invoiceDate: "2025-03-16",
    amount: 997.50,
    currency: "USD",
    status: "unmatched",
    ocrData: {
      vendor: "Upwork Global Inc.",
      invoiceNumber: "UPW-8834291",
      date: "2025-03-16",
      amount: "997.50",
      currency: "USD",
      taxAmount: "0.00",
      lineItems: [
        { description: "Content writing - 5 articles", quantity: 5, unitPrice: 190, total: 950 },
        { description: "Upwork service fee", quantity: 1, unitPrice: 47.50, total: 47.50 },
      ],
      confidence: 91,
    },
  },
];

// Transactions that are missing invoices
export const transactionsMissingInvoices = ["3", "6", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
