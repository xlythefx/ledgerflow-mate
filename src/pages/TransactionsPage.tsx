import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReasonBadges } from "@/components/ReasonBadges";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReasonFilter } from "@/components/ReasonFilter";
import { ExpenseSummaryCard } from "@/components/ExpenseSummaryCard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronLeft, ChevronRight, Calendar, User, Building2, FileText, CreditCard, DollarSign } from "lucide-react";
import { mockTransactions, BANK_OPTIONS, type Transaction } from "@/data/mockData";
import { parseReason } from "@/data/reasons";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [department, setDepartment] = useState("all");
  const [project, setProject] = useState("all");
  const [bankFilter, setBankFilter] = useState("all");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchesSearch =
        t.recipient.toLowerCase().includes(search.toLowerCase()) ||
        t.transactionId.toLowerCase().includes(search.toLowerCase());

      const { segments } = parseReason(t.reason);
      const matchesCategory = category === "all" || segments[0] === category;
      const matchesDept = department === "all" || segments[1] === department;
      const matchesProject = project === "all" || segments[2] === project;

      const matchesBank = bankFilter === "all" || t.bank === bankFilter;

      return matchesSearch && matchesCategory && matchesDept && matchesProject && matchesBank;
    });
  }, [search, category, department, project, bankFilter]);

  const activeFilterLabel = [
    category !== "all" ? category : null,
    department !== "all" ? department : null,
    project !== "all" ? project : null,
  ].filter(Boolean).join(" › ") || null;

  return (
    <DashboardLayout title="Transactions">
      <div className="space-y-4">
        <ExpenseSummaryCard transactions={filtered} activeFilter={activeFilterLabel} />

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by recipient or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <ReasonFilter
            category={category}
            department={department}
            project={project}
            onCategoryChange={setCategory}
            onDepartmentChange={setDepartment}
            onProjectChange={setProject}
          />
          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger className="w-[170px] bg-card border-border">
              <SelectValue placeholder="Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              {BANK_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">
            {filtered.length} transactions
          </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((txn) => (
                <TableRow
                  key={txn.id}
                  className="border-border hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedTxn(txn)}
                >
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{txn.recipient}</div>
                    <div className="text-xs text-muted-foreground">by {txn.payer}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default truncate block">{txn.subject}</span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[300px]">
                        <p className="text-xs">{txn.subject}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <ReasonBadges reason={txn.reason} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{txn.bank}</TableCell>
                  <TableCell className="text-sm font-medium text-right tabular-nums">
                    {(() => {
                      const isIncome = txn.reason.startsWith("Income");
                      return (
                        <span className={`inline-flex items-center gap-1 ${isIncome ? "text-emerald-500" : "text-destructive"}`}>
                          {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                          ${txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page 1 of 1</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled className="bg-card border-border">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled className="bg-card border-border">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTxn} onOpenChange={(open) => !open && setSelectedTxn(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTxn && (() => {
            const isIncome = selectedTxn.reason.startsWith("Income");
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg">Transaction Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {/* Amount highlight */}
                  <div className={`flex items-center justify-center gap-2 py-4 rounded-lg ${isIncome ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                    {isIncome ? <ArrowUpRight className="h-6 w-6 text-emerald-500" /> : <ArrowDownLeft className="h-6 w-6 text-destructive" />}
                    <span className={`text-2xl font-bold tabular-nums ${isIncome ? "text-emerald-500" : "text-destructive"}`}>
                      ${selectedTxn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <Separator />

                  {/* Detail rows */}
                  <div className="grid gap-3 text-sm">
                    <DetailRow icon={Calendar} label="Date" value={new Date(selectedTxn.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })} />
                    <DetailRow icon={User} label="Paid To" value={selectedTxn.recipient} />
                    <DetailRow icon={User} label="Paid By" value={selectedTxn.payer} />
                    <DetailRow icon={FileText} label="Subject" value={selectedTxn.subject} />
                    <DetailRow icon={CreditCard} label="Bank" value={selectedTxn.bank} />
                    <DetailRow icon={DollarSign} label="Transaction ID" value={selectedTxn.transactionId} />
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5 font-medium">Reason</p>
                    <ReasonBadges reason={selectedTxn.reason} />
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium break-words">{value}</p>
      </div>
    </div>
  );
}