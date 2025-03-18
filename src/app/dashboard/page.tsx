import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch recent invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link href="/dashboard/invoices/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Total Invoices
              </h3>
              <p className="text-3xl font-bold">{invoices?.length || 0}</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Paid Invoices
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                {invoices?.filter((inv) => inv.status === "paid").length || 0}
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Unpaid Invoices
              </h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-500">
                {invoices?.filter(
                  (inv) => inv.status === "unpaid" || inv.status === "overdue",
                ).length || 0}
              </p>
            </div>
          </div>

          {/* Recent Invoices Section */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-8 border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-medium">Recent Invoices</h2>
            </div>

            {invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          <Link href={`/dashboard/invoices/${invoice.id}`}>
                            {invoice.invoice_number}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {invoice.clients?.name || "Unknown Client"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          ${invoice.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : invoice.status === "overdue" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p>
                  No invoices found. Create your first invoice to get started.
                </p>
                <Link href="/dashboard/invoices/new">
                  <Button className="mt-4">Create Invoice</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/invoices/new">
              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
                <h3 className="font-medium mb-2">Create New Invoice</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a new invoice for your clients
                </p>
              </div>
            </Link>

            <Link href="/dashboard/clients">
              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
                <h3 className="font-medium mb-2">Manage Clients</h3>
                <p className="text-sm text-muted-foreground">
                  Add, edit or remove client information
                </p>
              </div>
            </Link>

            <Link href="/dashboard/invoices">
              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
                <h3 className="font-medium mb-2">View All Invoices</h3>
                <p className="text-sm text-muted-foreground">
                  See all your invoices in one place
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
