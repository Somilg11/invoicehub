"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-border bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold">
            InvoiceHub
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/invoices"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Invoices
            </Link>
            <Link
              href="/dashboard/clients"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Clients
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
