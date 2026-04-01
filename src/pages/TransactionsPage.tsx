import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReasonBadges } from "@/components/ReasonBadges";
import { ReasonFilter } from "@/components/ReasonFilter";
import { ExpenseSummaryCard } from "@/components/ExpenseSummaryCard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { mockTransactions } from "@/data/mockData";
import { parseReason } from "@/data/reasons";

const statusStyles: Record<string, string> = {
  completed: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [department, setDepartment] = useState("all");
  const [project, setProject] = useState("all");

  const filtered = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchesSearch =
        t.recipient.toLowerCase().includes(search.toLowerCase()) ||
        t.transactionId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      const { segments } = parseReason(t.reason);
      const matchesCategory = category === "all" || segments[0] === category;
      const matchesDept = department === "all" || segments[1] === department;
      const matchesProject = project === "all" || segments[2] === project;

      return matchesSearch && matchesStatus && matchesCategory && matchesDept && matchesProject;
    });
  }, [search, statusFilter, category, department, project]);

  const activeFilterLabel = [
    category !== "all" ? category : null,
    department !== "all" ? department : null,
    project !== "all" ? project : null,
  ].filter(Boolean).join(" › ") || null;

  return (
    <DashboardLayout title="Transactions">
      <div className="space-y-4">
        {/* KPI Cards */}
        <ExpenseSummaryCard transactions={filtered} activeFilter={activeFilterLabel} />

        {/* Filters */}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-card border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <ReasonFilter
            category={category}
            department={department}
            project={project}
            onCategoryChange={setCategory}
            onDepartmentChange={setDepartment}
            onProjectChange={setProject}
          />
          <div className="ml-auto text-sm text-muted-foreground">
            {filtered.length} transactions
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                <TableHead className="text-muted-foreground font-medium">Paid To</TableHead>
                <TableHead className="text-muted-foreground font-medium">Paid By</TableHead>
                <TableHead className="text-muted-foreground font-medium">Reason</TableHead>
                <TableHead className="text-muted-foreground font-medium">Tags</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((txn) => (
                <TableRow key={txn.id} className="border-border hover:bg-accent/30 transition-colors">
                  <TableCell className="text-sm">
                    {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{txn.recipient}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{txn.payer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {txn.reason}
                  </TableCell>
                  <TableCell>
                    <ReasonBadges reason={txn.reason} />
                  </TableCell>
                  <TableCell className="text-sm font-medium text-right tabular-nums">
                    ${txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusStyles[txn.status]} text-[11px] capitalize`}>
                      {txn.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
    </DashboardLayout>
  );
}
