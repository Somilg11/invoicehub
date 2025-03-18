"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Client } from "@/types/invoice";
import { Save, ArrowLeft } from "lucide-react";

interface ClientEditorProps {
  client: Client | null;
  isNew: boolean;
}

export default function ClientEditor(
  { client, isNew }: ClientEditorProps = { client: null, isNew: true },
) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  // Initialize form with client data if editing
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        company: client.company || "",
      });
    }
  }, [client]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save client
  const saveClient = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (!formData.name) {
        throw new Error("Client name is required");
      }

      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (isNew) {
        // Create new client
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({
            user_id: user.id,
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            address: formData.address || null,
            company: formData.company || null,
          })
          .select()
          .single();

        if (clientError) throw new Error(clientError.message);

        setSuccess("Client created successfully");
        router.push(`/dashboard/clients/${newClient.id}`);
      } else {
        // Update existing client
        if (!client) throw new Error("Client not found");

        const { error: clientError } = await supabase
          .from("clients")
          .update({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            address: formData.address || null,
            company: formData.company || null,
          })
          .eq("id", client.id)
          .eq("user_id", user.id);

        if (clientError) throw new Error(clientError.message);

        setSuccess("Client updated successfully");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error saving client:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/clients")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={saveClient} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {isNew ? "Create Client" : "Update Client"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/15 text-green-500 p-3 rounded-md">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "New Client" : "Edit Client"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={saveClient} disabled={loading}>
            {isNew ? "Create Client" : "Update Client"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
