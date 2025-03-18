import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Users,
  CreditCard,
  BarChart4,
  Clock,
  Download,
  Mail,
  Shield,
  Smartphone,
  Zap,
  Check,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Professional Invoices",
      description:
        "Create beautiful, professional invoices in seconds. Customize with your logo, colors, and branding.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Client Management",
      description:
        "Store and manage all your client information in one place. Quickly access contact details and invoice history.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Payment Tracking",
      description:
        "Track payment status for all invoices. Get notified when payments are received or overdue.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: "Financial Reporting",
      description:
        "Generate detailed reports on your invoicing and payment activity. Track revenue, outstanding payments, and more.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Recurring Invoices",
      description:
        "Set up automatic recurring invoices for regular clients. Save time and ensure consistent billing.",
    },
    {
      icon: <Download className="h-10 w-10 text-primary" />,
      title: "PDF Export",
      description:
        "Export invoices as professional PDF documents. Send directly to clients or download for your records.",
    },
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: "Email Integration",
      description:
        "Send invoices directly to clients via email. Include personalized messages and payment instructions.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Data Storage",
      description:
        "All your data is encrypted and securely stored. Access your invoices from anywhere with peace of mind.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Mobile Friendly",
      description:
        "Create and manage invoices on the go. Our responsive design works perfectly on all devices.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for freelancers just getting started",
      features: [
        "Up to 5 clients",
        "Up to 10 invoices per month",
        "Basic invoice templates",
        "PDF export",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$15",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited clients",
        "Unlimited invoices",
        "Custom invoice templates",
        "Recurring invoices",
        "Client portal",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For established businesses with complex needs",
      features: [
        "Everything in Professional",
        "Multiple team members",
        "Advanced reporting",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Effortless Invoicing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Discover all the tools you need to create, manage, and track your
            invoices with ease. Designed for freelancers, small businesses, and
            enterprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#feature-list">
              <Button size="lg" variant="outline" className="px-8">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="feature-list" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything You Need to Manage Your Invoices
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your business. All plans
              include core features with no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-card rounded-xl overflow-hidden border ${plan.popular ? "border-primary shadow-lg" : "border-border shadow-sm"}`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "" : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"}`}
                    variant={plan.popular ? "default" : "secondary"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Streamline Your Invoicing Process?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join thousands of businesses who've simplified their invoicing with
            InvoiceHub. Start your free trial today.
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
