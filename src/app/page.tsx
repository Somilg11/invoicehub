import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import AppPreview from "@/components/app-preview";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Receipt,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <Hero />

      {/* App Preview Section */}
      <AppPreview />

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Invoice System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing the way businesses handle invoicing with our
              powerful, easy-to-use platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description: "Create professional invoices in seconds",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Storage",
                description: "All your data is encrypted and protected",
              },
              {
                icon: <Receipt className="w-6 h-6" />,
                title: "PDF Export",
                description: "Download and share invoices instantly",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Client Management",
                description: "Easily manage all your client information",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-foreground/80">
                Invoices Generated
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-primary-foreground/80">Happy Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-primary-foreground/80">
                Uptime Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Streamline Your Invoicing?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who've simplified their invoicing
            process with our platform.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
