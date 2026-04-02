import { useState, useMemo, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FileText,
  Image,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Upload,
  Search,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { mockInvoices, transactionsMissingInvoices, type Invoice, type InvoiceStatus } from "@/data/mockInvoices";
import { mockTransactions } from "@/data/mockData";

// ── Status helpers ──

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; icon: React.ElementType; className: string }> = {
  matched: { label: "Matched", icon: CheckCircle2, className: "bg-success/15 text-success border-success/30" },
  unmatched: { label: "Unmatched", icon: AlertCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
  pending: { label: "Pending Review", icon: Clock, className: "bg-warning/15 text-warning border-warning/30" },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`${config.className} text-[11px]`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

// ── OCR Preview Panel ──

function OcrPreviewPanel({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const matchedTxn = invoice.matchedTransactionId
    ? mockTransactions.find((t) => t.id === invoice.matchedTransactionId)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Left: Document Preview Mock */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {invoice.fileType === "pdf" ? (
              <FileText className="h-4 w-4 text-destructive" />
            ) : (
              <Image className="h-4 w-4 text-info" />
            )}
            <span className="text-sm font-medium truncate">{invoice.fileName}</span>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Mock document preview */}
        <div className="bg-muted/50 rounded-lg border border-border p-8 flex flex-col items-center justify-center min-h-[200px]">
          {invoice.fileType === "pdf" ? (
            <FileText className="h-16 w-16 text-muted-foreground/40" />
          ) : (
            <Image className="h-16 w-16 text-muted-foreground/40" />
          )}
          <p className="text-xs text-muted-foreground mt-3">Document preview</p>
          <p className="text-[10px] text-muted-foreground">{invoice.fileName}</p>
        </div>
      </div>

      {/* Right: OCR Extracted Data */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-info" />
            AI-Extracted Data
          </h4>
          <Badge variant="outline" className="text-[10px] bg-info/10 text-info border-info/30">
            {invoice.ocrData.confidence}% confidence
          </Badge>
        </div>

        {/* Extracted fields */}
        <div className="space-y-3">
          {[
            { label: "Vendor", value: invoice.ocrData.vendor },
            { label: "Invoice #", value: invoice.ocrData.invoiceNumber },
            { label: "Date", value: invoice.ocrData.date },
            { label: "Amount", value: `${invoice.ocrData.currency} ${invoice.ocrData.amount}` },
            ...(invoice.ocrData.taxAmount ? [{ label: "Tax", value: `${invoice.ocrData.currency} ${invoice.ocrData.taxAmount}` }] : []),
          ].map((field) => (
            <div key={field.label} className="flex items-start justify-between gap-2">
              <span className="text-xs text-muted-foreground shrink-0">{field.label}</span>
              <span className="text-sm font-medium text-right">{field.value}</span>
            </div>
          ))}
        </div>

        {/* Line items */}
        {invoice.ocrData.lineItems.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Line Items</p>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] text-muted-foreground h-7">Item</TableHead>
                    <TableHead className="text-[10px] text-muted-foreground h-7 text-right">Qty</TableHead>
                    <TableHead className="text-[10px] text-muted-foreground h-7 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.ocrData.lineItems.map((item, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="text-xs py-1.5">{item.description}</TableCell>
                      <TableCell className="text-xs py-1.5 text-right tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="text-xs py-1.5 text-right tabular-nums">${item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {invoice.ocrData.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-xs bg-muted/50 rounded-md p-2 border border-border">{invoice.ocrData.notes}</p>
          </div>
        )}

        {/* Matched transaction */}
        {matchedTxn && (
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground mb-2">Matched Transaction</p>
            <div className="bg-success/5 border border-success/20 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{matchedTxn.recipient}</span>
                <span className="text-xs tabular-nums font-medium">${matchedTxn.amount.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{matchedTxn.subject}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(matchedTxn.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadLinkedTxnId, setUploadLinkedTxnId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openUploadModal = (txnId?: string) => {
    setUploadLinkedTxnId(txnId ?? null);
    setUploadedFile(null);
    setUploadNotes("");
    setUploadOpen(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const linkedTxn = uploadLinkedTxnId ? mockTransactions.find((t) => t.id === uploadLinkedTxnId) : null;

  const filteredInvoices = useMemo(() => {
    if (statusFilter === "all") return mockInvoices;
    return mockInvoices.filter((inv) => inv.status === statusFilter);
  }, [statusFilter]);

  const missingTxns = useMemo(
    () => mockTransactions.filter((t) => transactionsMissingInvoices.includes(t.id)),
    []
  );

  const counts = useMemo(() => ({
    total: mockInvoices.length,
    matched: mockInvoices.filter((i) => i.status === "matched").length,
    unmatched: mockInvoices.filter((i) => i.status === "unmatched").length,
    pending: mockInvoices.filter((i) => i.status === "pending").length,
    missing: transactionsMissingInvoices.length,
  }), []);

  return (
    <DashboardLayout title="Invoice Management">
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Invoices", value: counts.total, color: "text-foreground" },
            { label: "Matched", value: counts.matched, color: "text-success" },
            { label: "Unmatched", value: counts.unmatched, color: "text-destructive" },
            { label: "Missing Docs", value: counts.missing, color: "text-warning" },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold mt-1 tabular-nums ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="vault" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="vault" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Invoice Vault
            </TabsTrigger>
            <TabsTrigger value="missing" className="text-xs">
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              Action Center
              {counts.missing > 0 && (
                <Badge variant="outline" className="ml-1.5 bg-warning/15 text-warning border-warning/30 text-[10px] px-1.5">
                  {counts.missing}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Invoice Vault Tab */}
          <TabsContent value="vault" className="space-y-4">
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-card border-border text-xs h-8">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="unmatched">Unmatched</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? "s" : ""}
              </span>
              <div className="flex-1" />
              <Button size="sm" variant="outline" className="h-8 text-xs border-border" onClick={() => openUploadModal()}>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload Invoice
              </Button>
            </div>

            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium text-xs">File</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs">Vendor</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs">Invoice #</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs text-right">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs text-center">Status</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      className="border-border hover:bg-accent/30 cursor-pointer"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {inv.fileType === "pdf" ? (
                            <FileText className="h-4 w-4 text-destructive/70 shrink-0" />
                          ) : (
                            <Image className="h-4 w-4 text-info/70 shrink-0" />
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm truncate max-w-[160px] block">{inv.fileName}</span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">{inv.fileName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{inv.vendor}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{inv.invoiceNumber}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(inv.invoiceDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-right tabular-nums">
                        ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(inv);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Action Center Tab */}
          <TabsContent value="missing" className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <p className="text-sm text-muted-foreground">
                These transactions are missing an attached invoice or receipt.
              </p>
            </div>

            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium text-xs">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs">Paid To</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs">Subject</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs">Reason</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs text-right">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-xs text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missingTxns.map((txn) => (
                    <TableRow key={txn.id} className="border-border hover:bg-accent/30">
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{txn.recipient}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-muted-foreground truncate block max-w-[200px] cursor-default">
                              {txn.subject}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[300px]">
                            <p className="text-xs">{txn.subject}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{txn.reason}</TableCell>
                      <TableCell className="text-sm font-medium text-right tabular-nums">
                        ${txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10">
                          <Upload className="h-3 w-3 mr-1" />
                          Attach
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* OCR Preview Sheet */}
        <Sheet open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
          <SheetContent className="w-[440px] sm:w-[480px] p-0 border-border">
            <SheetHeader className="sr-only">
              <SheetTitle>Invoice Details</SheetTitle>
            </SheetHeader>
            {selectedInvoice && (
              <OcrPreviewPanel invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
