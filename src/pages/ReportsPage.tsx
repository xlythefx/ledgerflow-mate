import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReasonFilter } from "@/components/ReasonFilter";
import { DollarSign, TrendingDown, BarChart3, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { mockTransactions } from "@/data/mockData";
import { parseReason } from "@/data/reasons";

const TAG_COLORS = [
  "hsl(160, 84%, 39%)", "hsl(210, 100%, 52%)", "hsl(280, 65%, 60%)",
  "hsl(38, 92%, 50%)", "hsl(340, 75%, 55%)", "hsl(200, 50%, 50%)",
  "hsl(150, 60%, 45%)", "hsl(25, 85%, 55%)", "hsl(260, 55%, 50%)",
  "hsl(10, 80%, 55%)",
];

export default function ReportsPage() {
  const [category, setCategory] = useState("all");
  const [department, setDepartment] = useState("all");
  const [project, setProject] = useState("all");

  const filtered = useMemo(() => {
    return mockTransactions.filter((txn) => {
      const { segments } = parseReason(txn.reason);
      if (category !== "all" && segments[0] !== category) return false;
      if (department !== "all" && segments[1] !== department) return false;
      if (project !== "all" && segments[2] !== project) return false;
      return true;
    });
  }, [category, department, project]);

  // Expenses only (exclude Income)
  const expenses = useMemo(
    () => filtered.filter((t) => !t.reason.startsWith("Income")),
    [filtered]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((s, t) => s + t.amount, 0),
    [expenses]
  );

  // By primary tag (Level 1)
  const byTag = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    for (const txn of expenses) {
      const { segments } = parseReason(txn.reason);
      const tag = segments[0] || "Other";
      if (!map[tag]) map[tag] = { total: 0, count: 0 };
      map[tag].total += txn.amount;
      map[tag].count += 1;
    }
    return Object.entries(map)
      .map(([tag, data]) => ({ tag, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  // Pie chart data from byTag
  const pieData = useMemo(
    () => byTag.map((item, i) => ({
      name: item.tag,
      value: Math.round(item.total * 100) / 100,
      color: TAG_COLORS[i % TAG_COLORS.length],
    })),
    [byTag]
  );

  // Monthly aggregation
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const txn of expenses) {
      const month = new Date(txn.date).toLocaleString("en", { month: "short" });
      map[month] = (map[month] || 0) + txn.amount;
    }
    return Object.entries(map).map(([month, amount]) => ({ month, amount: Math.round(amount * 100) / 100 }));
  }, [expenses]);

  const maxTag = byTag[0]?.total ?? 1;
  const daysInMonth = 31;
  const burnRate = totalExpenses / daysInMonth;

  const activeFilter = [
    category !== "all" ? category : null,
    department !== "all" ? department : null,
    project !== "all" ? project : null,
  ].filter(Boolean).join(" › ");

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <ReasonFilter
              category={category}
              department={department}
              project={project}
              onCategoryChange={setCategory}
              onDepartmentChange={setDepartment}
              onProjectChange={setProject}
            />
          </div>
          <Button variant="outline" className="border-border">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {activeFilter && (
          <p className="text-xs text-muted-foreground">
            Filtered: <span className="font-medium text-foreground">{activeFilter}</span>
            {" "}— {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold mt-1 tabular-nums">
                    ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Burn Rate</p>
                  <p className="text-2xl font-bold mt-1 tabular-nums">
                    ${Math.round(burnRate).toLocaleString()}/day
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold mt-1 tabular-nums">{byTag.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active tags</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--popover-foreground))" }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Expenses"]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">By Tag</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55} strokeWidth={0}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--popover-foreground))" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {pieData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-medium tabular-nums">${cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tag Report Table */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses by Tag</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {byTag.map((row) => (
                <div key={row.tag} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="text-sm font-medium">{row.tag}</span>
                    <span className="text-xs text-muted-foreground ml-2">({row.count} txns)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(row.total / maxTag) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular-nums w-20 text-right">
                      ${row.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
