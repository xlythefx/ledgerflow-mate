import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, CheckCircle2, PlusCircle, Sparkles, FileSpreadsheet } from "lucide-react";

interface BankLine {
  id: string;
  date: string;
  description: string;
  amount: number;
  matchId?: string;
  matchConfidence?: number;
  aiSuggested?: boolean;
}

const mockBankLines: BankLine[] = [
  { id: "b1", date: "2025-03-28", description: "JOHN SMITH FREELANCE", amount: -4500, matchId: "1", matchConfidence: 98, aiSuggested: false },
  { id: "b2", date: "2025-03-27", description: "AWS *SERVICES", amount: -1234.56, matchId: "2", matchConfidence: 95, aiSuggested: true },
  { id: "b3", date: "2025-03-26", description: "SEMRUSH.COM SUBSCRIPTION", amount: -449.95, matchId: "4", matchConfidence: 92, aiSuggested: true },
  { id: "b4", date: "2025-03-25", description: "WIRE TRANSFER - CHEN D", amount: -6800, matchId: "5", matchConfidence: 85, aiSuggested: false },
  { id: "b5", date: "2025-03-24", description: "UNKNOWN VENDOR #4412", amount: -780, aiSuggested: true },
  { id: "b6", date: "2025-03-23", description: "PAYPAL *FREELANCER", amount: -950, aiSuggested: false },
];

export default function ReconciliationPage() {
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [correlated, setCorrelated] = useState<Set<string>>(new Set());

  const handleCorrelate = (id: string) => {
    setCorrelated((prev) => new Set(prev).add(id));
  };

  return (
    <DashboardLayout title="Bank Reconciliation">
      <div className="space-y-6">
        {/* Upload Zone */}
        {!uploaded ? (
          <div
            className={`glass-card p-12 flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); setUploaded(true); }}
            onClick={() => setUploaded(true)}
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
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  bank_statement_march.csv
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {mockBankLines.length} lines imported
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setUploaded(false); setCorrelated(new Set()); }} className="border-border">
                Upload New File
              </Button>
            </div>

            {/* Correlation Table */}
            <div className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Bank Description</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Confidence</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-center">Source</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBankLines.map((line) => {
                    const isCorrelated = correlated.has(line.id);
                    const hasMatch = !!line.matchId;

                    return (
                      <TableRow key={line.id} className={`border-border transition-colors ${isCorrelated ? "opacity-50" : "hover:bg-accent/30"}`}>
                        <TableCell className="text-sm">
                          {new Date(line.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{line.description}</TableCell>
                        <TableCell className="text-sm font-medium text-right tabular-nums text-destructive">
                          ${Math.abs(line.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                          {hasMatch ? (
                            <span className={`text-sm font-medium ${
                              line.matchConfidence! >= 95 ? "text-success" : line.matchConfidence! >= 85 ? "text-warning" : "text-muted-foreground"
                            }`}>
                              {line.matchConfidence}%
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {line.aiSuggested && (
                            <Badge variant="outline" className="bg-info/10 text-info border-info/30 text-[10px]">
                              <Sparkles className="h-2.5 w-2.5 mr-1" />
                              AI
                            </Badge>
                          )}
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
