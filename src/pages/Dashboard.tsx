import React, { useState } from "react";
import LoginPage from "../pages/LoginPage";
import { Card } from "@/components/ui/card";
import { CreditCard, BarChart3, Wallet } from "lucide-react";

export default function Dashboard() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Payment Dashboard
        </h1>

        <p className="text-gray-600 max-w-2xl">
          Track payments, review transaction history, and manage your cards all
          in one user-friendly space.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

          {/* Card – Manage Cards */}
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-foreground">
              Manage Cards
            </h3>

            <p className="text-muted-foreground">
              Add, track, and manage all your payment cards securely.
            </p>
          </Card>

          {/* Card – Transactions */}
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-foreground">
              Transactions
            </h3>

            <p className="text-muted-foreground">
              View detailed transaction history and track your expenses.
            </p>
          </Card>

          {/* Card – Analytics */}
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-foreground">
              Analytics
            </h3>

            <p className="text-muted-foreground">
              Get insights into your spending patterns and budget.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

