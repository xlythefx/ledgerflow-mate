import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Save } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [frequency, setFrequency] = useState("weekly");
  const [reportTypes, setReportTypes] = useState({
    fullSummary: true,
    tagReport: false,
    reconciliation: true,
    burnRate: false,
  });

  const toggleReport = (key: keyof typeof reportTypes) => {
    setReportTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout title="Notification Settings">
      <div className="max-w-2xl space-y-6">
        {/* Email Toggle */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Email Reports</CardTitle>
                  <CardDescription>Receive automated financial reports via email</CardDescription>
                </div>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
          </CardHeader>
        </Card>

        {emailEnabled && (
          <>
            {/* Frequency */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Frequency</CardTitle>
                <CardDescription>How often should reports be sent?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-3">
                  {[
                    { value: "daily", label: "Daily", desc: "Every morning at 8:00 AM" },
                    { value: "weekly", label: "Weekly", desc: "Every Monday at 8:00 AM" },
                    { value: "monthly", label: "Monthly", desc: "First day of the month" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors">
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <div className="flex-1">
                        <Label htmlFor={opt.value} className="font-medium cursor-pointer">{opt.label}</Label>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Report Types */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Report Types</CardTitle>
                <CardDescription>Select which reports to include</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "fullSummary" as const, label: "Full Summary", desc: "Complete overview of all expenses and categories" },
                  { key: "tagReport" as const, label: "Specific Tag Report", desc: "Breakdown by selected tags and departments" },
                  { key: "reconciliation" as const, label: "Reconciliation Status", desc: "Unmatched bank transactions needing review" },
                  { key: "burnRate" as const, label: "Burn Rate Alert", desc: "Alert when burn rate exceeds threshold" },
                ].map((opt) => (
                  <div key={opt.key} className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors">
                    <Checkbox checked={reportTypes[opt.key]} onCheckedChange={() => toggleReport(opt.key)} id={opt.key} className="mt-0.5" />
                    <div>
                      <Label htmlFor={opt.key} className="font-medium cursor-pointer">{opt.label}</Label>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Email Recipients */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="email@company.com" defaultValue="anastasia@company.com" className="bg-card border-border" />
              </CardContent>
            </Card>
          </>
        )}

        <Button className="w-full" onClick={() => toast.success("Notification settings saved")}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </DashboardLayout>
  );
}
