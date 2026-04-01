import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReasonBadges } from "@/components/ReasonBadges";
import { mockTransactions } from "@/data/mockData";
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
  Upload,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Columns,
  Eye,
  Check,
} from "lucide-react";

// ── Types ──

interface BankLine {
  id: string;
  date: string;
  description: string;
  amount: number;
  matchId?: string;
  matchConfidence?: number;
  aiSuggested?: boolean;
}

type WizardStep = "upload" | "preview" | "mapping" | "correlate";

const DB_FIELDS = [
  { value: "date", label: "Date" },
  { value: "recipient", label: "Paid To" },
  { value: "payer", label: "Paid By" },
  { value: "subject", label: "Subject" },
  { value: "reason", label: "Reason" },
  { value: "bank", label: "Bank" },
  { value: "amount", label: "Amount" },
  { value: "ignore", label: "— Ignore —" },
] as const;

const STEPS: { key: WizardStep; label: string; icon: React.ElementType }[] = [
  { key: "upload", label: "Upload", icon: Upload },
  { key: "preview", label: "Preview", icon: Eye },
  { key: "mapping", label: "Map Columns", icon: Columns },
  { key: "correlate", label: "Correlate", icon: Check },
];

// ── Mock parsed CSV ──

const mockCsvHeaders = ["Transaction Date", "Details", "Debit", "Credit", "Running Balance"];
const mockCsvRows = [
  ["03/28/2025", "JOHN SMITH FREELANCE", "4500.00", "", "23,412.50"],
  ["03/27/2025", "AWS *SERVICES", "1234.56", "", "27,912.50"],
  ["03/26/2025", "SEMRUSH.COM SUBSCRIPTION", "449.95", "", "29,147.06"],
  ["03/25/2025", "WIRE TRANSFER - CHEN D", "6800.00", "", "29,597.01"],
  ["03/24/2025", "UNKNOWN VENDOR #4412", "780.00", "", "36,397.01"],
  ["03/23/2025", "PAYPAL *FREELANCER", "950.00", "", "37,177.01"],
];

const mockBankLines: BankLine[] = [
  { id: "b1", date: "2025-03-28", description: "JOHN SMITH FREELANCE", amount: -4500, matchId: "1", matchConfidence: 98, aiSuggested: false },
  { id: "b2", date: "2025-03-27", description: "AWS *SERVICES", amount: -1234.56, matchId: "2", matchConfidence: 95, aiSuggested: true },
  { id: "b3", date: "2025-03-26", description: "SEMRUSH.COM SUBSCRIPTION", amount: -449.95, matchId: "4", matchConfidence: 92, aiSuggested: true },
  { id: "b4", date: "2025-03-25", description: "WIRE TRANSFER - CHEN D", amount: -6800, matchId: "5", matchConfidence: 85, aiSuggested: false },
  { id: "b5", date: "2025-03-24", description: "UNKNOWN VENDOR #4412", amount: -780, aiSuggested: true },
  { id: "b6", date: "2025-03-23", description: "PAYPAL *FREELANCER", amount: -950, aiSuggested: false },
];

// ── Component ──

export default function ReconciliationPage() {
  const [step, setStep] = useState<WizardStep>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    mockCsvHeaders.forEach((h) => (initial[h] = "ignore"));
    // auto-guess
    initial["Transaction Date"] = "date";
    initial["Details"] = "recipient";
    initial["Debit"] = "amount";
    initial["Running Balance"] = "ignore";
    return initial;
  });
  const [correlated, setCorrelated] = useState<Set<string>>(new Set());

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const handleFileAccept = useCallback(() => {
    setFileName("bank_statement_march.csv");
    setStep("preview");
  }, []);

  const handleCorrelate = (id: string) => {
    setCorrelated((prev) => new Set(prev).add(id));
  };

  const resetWizard = () => {
    setStep("upload");
    setFileName("");
    setCorrelated(new Set());
  };

  const requiredMapped = ["date", "recipient", "amount"];
  const mappedFields = Object.values(columnMapping).filter((v) => v !== "ignore");
  const allRequiredMapped = requiredMapped.every((f) => mappedFields.includes(f));

  return (
    <DashboardLayout title="Bank Reconciliation">
      <div className="space-y-6">
        {/* Wizard Steps Indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const isActive = i === currentStepIndex;
            const isCompleted = i < currentStepIndex;
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground/50" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div
            className={`glass-card p-12 flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileAccept(); }}
            onClick={handleFileAccept}
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium">Drop your bank statement here</p>
              <p className="text-sm text-muted-foreground mt-1">Supports CSV and Excel files</p>
            </div>
            <Button variant="outline" className="mt-2 border-border">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  {fileName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {mockCsvRows.length} rows detected · {mockCsvHeaders.length} columns
                </span>
              </div>
            </div>

            <div className="glass-card overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {mockCsvHeaders.map((h) => (
                      <TableHead key={h} className="text-muted-foreground font-medium text-xs whitespace-nowrap">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCsvRows.slice(0, 5).map((row, i) => (
                    <TableRow key={i} className="border-border">
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-sm font-mono whitespace-nowrap">
                          {cell || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetWizard} className="border-border">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep("mapping")}>
                Map Columns
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Column Mapping */}
        {step === "mapping" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Map each CSV column to a database field. <span className="text-destructive">*</span> Date, Paid To, and Amount are required.
            </p>

            <div className="glass-card divide-y divide-border">
              {mockCsvHeaders.map((header) => {
                const sampleValues = mockCsvRows.slice(0, 3).map((row) => row[mockCsvHeaders.indexOf(header)]);
                return (
                  <div key={header} className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{header}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        e.g. {sampleValues.filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Select
                      value={columnMapping[header]}
                      onValueChange={(val) =>
                        setColumnMapping((prev) => ({ ...prev, [header]: val }))
                      }
                    >
                      <SelectTrigger className="w-[220px] bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DB_FIELDS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>

            {!allRequiredMapped && (
              <p className="text-xs text-destructive">
                Please map Date, Description, and Amount before proceeding.
              </p>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("preview")} className="border-border">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep("correlate")} disabled={!allRequiredMapped}>
                Run Correlation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Correlate */}
        {step === "correlate" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  {fileName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {mockBankLines.length} lines imported
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={resetWizard} className="border-border">
                Upload New File
              </Button>
            </div>

            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium w-[90px]">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Paid To / By</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Subject</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Reason</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Bank</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right w-[110px]">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Match</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBankLines.map((line) => {
                    const isCorrelated = correlated.has(line.id);
                    const hasMatch = !!line.matchId;
                    const matchedTxn = hasMatch ? mockTransactions.find((t) => t.id === line.matchId) : null;
                    return (
                      <TableRow key={line.id} className={`border-border transition-colors ${isCorrelated ? "opacity-50" : "hover:bg-accent/30"}`}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {new Date(line.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </TableCell>
                        <TableCell>
                          {matchedTxn ? (
                            <>
                              <div className="text-sm font-medium">{matchedTxn.recipient}</div>
                              <div className="text-xs text-muted-foreground">by {matchedTxn.payer}</div>
                            </>
                          ) : (
                            <div className="text-sm font-medium">{line.description}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                          {matchedTxn ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-default truncate block">{matchedTxn.subject}</span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-[300px]">
                                <p className="text-xs">{matchedTxn.subject}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {matchedTxn ? (
                            <ReasonBadges reason={matchedTxn.reason} />
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {matchedTxn?.bank ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-right tabular-nums">
                          ${Math.abs(line.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {hasMatch ? (
                              <span className={`text-sm font-medium ${
                                line.matchConfidence! >= 95 ? "text-success" : line.matchConfidence! >= 85 ? "text-warning" : "text-muted-foreground"
                              }`}>
                                {line.matchConfidence}%
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                            {line.aiSuggested && (
                              <Badge variant="outline" className="bg-info/10 text-info border-info/30 text-[10px]">
                                <Sparkles className="h-2.5 w-2.5 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {isCorrelated ? (
                            <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-[11px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Matched
                            </Badge>
                          ) : hasMatch ? (
                            <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10" onClick={() => handleCorrelate(line.id)}>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Correlate
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="h-7 text-xs border-warning/30 text-warning hover:bg-warning/10" onClick={() => handleCorrelate(line.id)}>
                              <PlusCircle className="h-3 w-3 mr-1" />
                              Add Missing
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{correlated.size} of {mockBankLines.length} reconciled</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(correlated.size / mockBankLines.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
