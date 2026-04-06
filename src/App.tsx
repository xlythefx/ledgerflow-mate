import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import TransactionsPage from "./pages/TransactionsPage";
import ReconciliationPage from "./pages/ReconciliationPage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import InvoicesPage from "./pages/InvoicesPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <AuthGuard>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TransactionsPage />} />
            <Route path="/reconciliation" element={<ReconciliationPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthGuard>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
