import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sparkles,
  LogOut,
  CreditCard,
  Receipt,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();

  // 🔔 One-time welcome message (new user vs existing user)
  useEffect(() => {
    const message = sessionStorage.getItem("welcomeMessage");

    if (message) {
      toast({
        title: message,
      });
      sessionStorage.removeItem("welcomeMessage");
    }
  }, [toast]);

  const handleSignOut = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  const displayName =
    user?.username || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              NovaPay
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button onClick={handleSignIn} className="gap-2">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {isAuthenticated ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Welcome back to Novapay!
              </h1>
              <p className="text-xl text-muted-foreground">
                Your Smart Payment Management Hub
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Payments
                </h3>
                <p className="text-muted-foreground">
                  Process and manage all your payment transactions
                </p>
                <Button variant="outline" className="w-full">
                  View Payments
                </Button>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Invoices
                </h3>
                <p className="text-muted-foreground">
                  Create and track invoices for your clients
                </p>
                <Button variant="outline" className="w-full">
                  View Invoices
                </Button>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Analytics
                </h3>
                <p className="text-muted-foreground">
                  Monitor financial trends and insights
                </p>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-auth-gradient flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-foreground">
                Your Smart Payment Management Hub
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track transactions, manage accounts, and monitor
                financial insights — all in one secure and intuitive
                dashboard.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handleSignIn}
                size="lg"
                className="text-lg px-8"
              >
                Get Started
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Real-Time Transactions
                </h3>
                <p className="text-muted-foreground">
                  View and track every incoming and outgoing payment
                  instantly with clear, structured logs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Smart Billing & Invoices
                </h3>
                <p className="text-muted-foreground">
                  Generate, manage, and automate invoices with
                  seamless scheduling and reminders.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Analytics & Insights
                </h3>
                <p className="text-muted-foreground">
                  Visualize financial health with charts, summaries,
                  and AI-powered spending analysis.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
