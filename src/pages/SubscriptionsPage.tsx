import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, CalendarClock, AlertTriangle, CreditCard, RefreshCw, Repeat } from "lucide-react";
import { mockSubscriptions, type Subscription } from "@/data/mockSubscriptions";
import { ReasonBadges } from "@/components/ReasonBadges";
import { differenceInHours, differenceInDays, format, parseISO, addMonths, addYears } from "date-fns";

function getDueStatus(nextBillingDate: string): "overdue" | "urgent" | "soon" | "normal" {
  const now = new Date();
  const due = parseISO(nextBillingDate);
  const hoursUntil = differenceInHours(due, now);
  if (hoursUntil < 0) return "overdue";
  if (hoursUntil <= 48) return "urgent";
  if (differenceInDays(due, now) <= 7) return "soon";
  return "normal";
}

function DueBadge({ nextBillingDate }: { nextBillingDate: string }) {
  const status = getDueStatus(nextBillingDate);
  if (status === "overdue")
    return <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[11px]">Overdue</Badge>;
  if (status === "urgent")
    return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 text-[11px]">Due &lt;48h</Badge>;
  if (status === "soon")
    return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[11px]">This week</Badge>;
  return null;
}

function StatusBadge({ status }: { status: Subscription["status"] }) {
  if (status === "active")
    return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">Active</Badge>;
  if (status === "paused")
    return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 text-[11px]">Paused</Badge>;
  return <Badge className="bg-muted text-muted-foreground text-[11px]">Cancelled</Badge>;
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const filtered = useMemo(() => {
    return mockSubscriptions.filter((s) => {
      const matchesSearch = s.toolName.toLowerCase().includes(search.toLowerCase());
      const matchesCycle = cycleFilter === "all" || s.billingCycle === cycleFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesCycle && matchesStatus;
    });
  }, [search, cycleFilter, statusFilter]);

  const upcoming7Days = useMemo(() => {
    const now = new Date();
    return mockSubscriptions
      .filter((s) => {
        if (s.status !== "active") return false;
        const due = parseISO(s.nextBillingDate);
        const days = differenceInDays(due, now);
        return days >= 0 && days <= 7;
      })
      .sort((a, b) => parseISO(a.nextBillingDate).getTime() - parseISO(b.nextBillingDate).getTime());
  }, []);

  const totalMonthly = useMemo(() => {
    return mockSubscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + (s.billingCycle === "Monthly" ? s.amount : s.amount / 12), 0);
  }, []);

  return (
    <DashboardLayout title="Subscriptions">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Repeat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{mockSubscriptions.filter((s) => s.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Monthly Spend</p>
                  <p className="text-2xl font-bold">${totalMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due This Week</p>
                  <p className="text-2xl font-bold">{upcoming7Days.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming in next 7 days */}
        {upcoming7Days.length > 0 && (
          <Card className="border-yellow-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-yellow-500" />
                Upcoming in the next 7 days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcoming7Days.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedSub(s)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-sm">{s.toolName}</div>
                      <DueBadge nextBillingDate={s.nextBillingDate} />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{format(parseISO(s.nextBillingDate), "MMM d, yyyy")}</span>
                      <span className="font-semibold">${s.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools…"
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={cycleFilter} onValueChange={setCycleFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cycles</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscriptions Table */}
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Tool Name</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Cycle</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Next Billing</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedSub(s)}
                  >
                    <TableCell className="font-medium">{s.toolName}</TableCell>
                    <TableCell className="font-semibold">${s.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {s.billingCycle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{format(parseISO(s.nextBillingDate), "MMM d, yyyy")}</span>
                        <DueBadge nextBillingDate={s.nextBillingDate} />
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell><ReasonBadges reason={s.reason} /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Auto-Sync Note */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Auto-Sync: When a matching &quot;Paid&quot; transaction arrives via webhook, the Next Billing Date advances automatically.</span>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedSub?.toolName}</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                  <p className="font-semibold">${selectedSub.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Billing Cycle</p>
                  <p className="font-medium">{selectedSub.billingCycle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Next Billing Date</p>
                  <p className="font-medium">{format(parseISO(selectedSub.nextBillingDate), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                  <StatusBadge status={selectedSub.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Bank</p>
                  <p className="font-medium">{selectedSub.bank}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Due Status</p>
                  <DueBadge nextBillingDate={selectedSub.nextBillingDate} />
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Reason</p>
                <ReasonBadges reason={selectedSub.reason} />
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>
                  Next auto-advance: {selectedSub.billingCycle === "Monthly"
                    ? format(addMonths(parseISO(selectedSub.nextBillingDate), 1), "MMM d, yyyy")
                    : format(addYears(parseISO(selectedSub.nextBillingDate), 1), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
