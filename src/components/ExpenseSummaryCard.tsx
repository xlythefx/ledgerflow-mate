import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingDown } from "lucide-react";
import type { Transaction } from "@/data/mockData";

interface ExpenseSummaryCardProps {
  transactions: Transaction[];
  activeFilter: string | null;
}

export function ExpenseSummaryCard({ transactions, activeFilter }: ExpenseSummaryCardProps) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => !t.reason.startsWith("Income"));
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="glass-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Total Amount{activeFilter ? ` · ${activeFilter}` : ""}
            </p>
            <p className="text-xl font-bold tabular-nums">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground">{transactions.length} transactions</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-destructive/15 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Total Expenses{activeFilter ? ` · ${activeFilter}` : ""}
            </p>
            <p className="text-xl font-bold tabular-nums">
              ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground">{expenses.length} expense items</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
