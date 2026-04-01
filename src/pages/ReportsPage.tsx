import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingDown, BarChart3, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "Oct", amount: 42000 },
  { month: "Nov", amount: 38500 },
  { month: "Dec", amount: 51200 },
  { month: "Jan", amount: 44800 },
  { month: "Feb", amount: 39600 },
  { month: "Mar", amount: 47200 },
];

const categoryData = [
  { name: "Managers", value: 12500, color: "hsl(160, 84%, 39%)" },
  { name: "Engineering", value: 9800, color: "hsl(210, 100%, 52%)" },
  { name: "Tools & Infra", value: 5200, color: "hsl(280, 65%, 60%)" },
  { name: "Content", value: 4400, color: "hsl(38, 92%, 50%)" },
  { name: "Operations", value: 3800, color: "hsl(340, 75%, 55%)" },
  { name: "Admin", value: 2100, color: "hsl(200, 50%, 50%)" },
];

const tagReport = [
  { tag: "Managers", total: 12500, count: 4 },
  { tag: "Link Building", total: 8900, count: 6 },
  { tag: "Engineering", total: 9800, count: 3 },
  { tag: "IP Services", total: 5200, count: 8 },
  { tag: "Content", total: 4400, count: 5 },
  { tag: "ClientCo", total: 11300, count: 7 },
  { tag: "MegaCorp", total: 3200, count: 2 },
];

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <Select defaultValue="march">
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="march">March 2025</SelectItem>
              <SelectItem value="february">February 2025</SelectItem>
              <SelectItem value="january">January 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold mt-1 tabular-nums">$47,172.51</p>
                  <p className="text-xs text-destructive mt-1">+19.1% vs last month</p>
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
                  <p className="text-2xl font-bold mt-1 tabular-nums">$1,521/day</p>
                  <p className="text-xs text-success mt-1">-3.2% vs last month</p>
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
                  <p className="text-2xl font-bold mt-1 tabular-nums">6</p>
                  <p className="text-xs text-muted-foreground mt-1">Active this month</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">By Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={260}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55} strokeWidth={0}>
                      {categoryData.map((entry, i) => (
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
                  {categoryData.map((cat) => (
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
              {tagReport.map((row) => (
                <div key={row.tag} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="text-sm font-medium">{row.tag}</span>
                    <span className="text-xs text-muted-foreground ml-2">({row.count} txns)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(row.total / 13000) * 100}%` }}
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
