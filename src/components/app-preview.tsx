"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function AppPreview() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">See InvoiceHub in Action</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our intuitive interface makes invoice management a breeze. Explore the
          key features below.
        </p>
      </div>

      <div className="relative">
        {/* Browser frame */}
        <div className="rounded-xl overflow-hidden border border-border bg-card shadow-xl">
          {/* Browser header */}
          <div className="bg-muted p-3 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive opacity-70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground w-80 truncate">
                app.invoicehub.com/dashboard
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 bg-card">
                      <div className="text-sm text-muted-foreground mb-1">
                        Outstanding
                      </div>
                      <div className="text-2xl font-bold">$12,450</div>
                      <div className="text-xs text-green-500 mt-2">
                        +12% from last month
                      </div>
                    </Card>
                    <Card className="p-4 bg-card">
                      <div className="text-sm text-muted-foreground mb-1">
                        Paid
                      </div>
                      <div className="text-2xl font-bold">$24,800</div>
                      <div className="text-xs text-green-500 mt-2">
                        +5% from last month
                      </div>
                    </Card>
                    <Card className="p-4 bg-card">
                      <div className="text-sm text-muted-foreground mb-1">
                        Overdue
                      </div>
                      <div className="text-2xl font-bold">$3,200</div>
                      <div className="text-xs text-destructive mt-2">
                        +2% from last month
                      </div>
                    </Card>
                  </div>
                  <Card className="p-4 bg-card h-64">
                    <div className="text-sm font-medium mb-4">
                      Recent Activity
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          client: "Acme Inc.",
                          amount: "$2,400",
                          status: "Paid",
                          date: "Today",
                        },
                        {
                          client: "Globex Corp",
                          amount: "$1,200",
                          status: "Pending",
                          date: "Yesterday",
                        },
                        {
                          client: "Stark Industries",
                          amount: "$4,800",
                          status: "Overdue",
                          date: "Jul 2, 2024",
                        },
                        {
                          client: "Wayne Enterprises",
                          amount: "$3,600",
                          status: "Paid",
                          date: "Jun 28, 2024",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div>
                            <div className="font-medium">{item.client}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">{item.amount}</div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${item.status === "Paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : item.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                            >
                              {item.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="invoices" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 bg-card">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-medium">All Invoices</div>
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">
                        + New Invoice
                      </div>
                    </div>
                    <div className="space-y-1">
                      {[
                        {
                          id: "INV-001",
                          client: "Acme Inc.",
                          amount: "$2,400",
                          status: "Paid",
                          date: "Jul 5, 2024",
                        },
                        {
                          id: "INV-002",
                          client: "Globex Corp",
                          amount: "$1,200",
                          status: "Pending",
                          date: "Jul 3, 2024",
                        },
                        {
                          id: "INV-003",
                          client: "Stark Industries",
                          amount: "$4,800",
                          status: "Overdue",
                          date: "Jul 2, 2024",
                        },
                        {
                          id: "INV-004",
                          client: "Wayne Enterprises",
                          amount: "$3,600",
                          status: "Paid",
                          date: "Jun 28, 2024",
                        },
                        {
                          id: "INV-005",
                          client: "Umbrella Corp",
                          amount: "$5,200",
                          status: "Pending",
                          date: "Jun 25, 2024",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="font-medium">{item.id}</div>
                            <div>{item.client}</div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">{item.date}</div>
                            <div className="text-right font-medium">
                              {item.amount}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${item.status === "Paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : item.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                            >
                              {item.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="clients" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 bg-card">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-medium">
                        Client Directory
                      </div>
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">
                        + Add Client
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          name: "Acme Inc.",
                          contact: "John Doe",
                          email: "john@acme.com",
                          phone: "(555) 123-4567",
                        },
                        {
                          name: "Globex Corp",
                          contact: "Jane Smith",
                          email: "jane@globex.com",
                          phone: "(555) 987-6543",
                        },
                        {
                          name: "Stark Industries",
                          contact: "Tony Stark",
                          email: "tony@stark.com",
                          phone: "(555) 111-2222",
                        },
                        {
                          name: "Wayne Enterprises",
                          contact: "Bruce Wayne",
                          email: "bruce@wayne.com",
                          phone: "(555) 333-4444",
                        },
                      ].map((client, i) => (
                        <Card
                          key={i}
                          className="p-4 bg-card border border-border"
                        >
                          <div className="font-medium text-lg">
                            {client.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {client.contact}
                          </div>
                          <div className="mt-3 text-sm">{client.email}</div>
                          <div className="text-sm">{client.phone}</div>
                          <div className="mt-4 flex gap-2">
                            <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                              Edit
                            </div>
                            <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                              View Invoices
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 -top-6 -left-6 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
