import Link from "next/link";
import { ArrowUpRight, Check, FileText } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-purple-500/10 opacity-70 dark:opacity-30" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Create{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Professional
              </span>{" "}
              Invoices in Seconds
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Our powerful invoice generation system helps you create, manage,
              and track invoices with ease. Perfect for freelancers, small
              businesses, and enterprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
              >
                Create Your First Invoice
                <FileText className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-lg font-medium"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Unlimited invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span>PDF export included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
