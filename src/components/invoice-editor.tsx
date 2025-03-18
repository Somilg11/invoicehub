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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Invoice, Client, InvoiceItem } from "@/types/invoice";
import { Trash2, Plus, FileDown, Save, ArrowLeft } from "lucide-react";
import { generatePDF } from "@/utils/pdf-generator";

interface InvoiceEditorProps {
  invoice: Invoice | null;
  clients: Client[];
  isNew: boolean;
}

export default function InvoiceEditor(
  { invoice, clients, isNew }: InvoiceEditorProps = {
    invoice: null,
    clients: [],
    isNew: true,
  },
) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    client_id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    notes: string;
    tax_rate: number;
    status: "draft" | "unpaid" | "paid" | "overdue";
    items: {
      id?: string;
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }[];
    subtotal: number;
    tax_amount: number;
    total: number;
  }>({
    client_id: "",
    invoice_number: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    tax_rate: 0,
    status: "draft",
    items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
    subtotal: 0,
    tax_amount: 0,
    total: 0,
  });

  // Initialize form with invoice data if editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        client_id: invoice.client_id,
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        notes: invoice.notes || "",
        tax_rate: invoice.tax_rate,
        status: invoice.status,
        items: invoice.items?.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        })) || [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
        subtotal: invoice.subtotal,
        tax_amount: invoice.tax_amount,
        total: invoice.total,
      });
    } else if (clients.length > 0) {
      // Set first client as default for new invoices
      setFormData((prev) => ({ ...prev, client_id: clients[0].id }));
    }
  }, [invoice, clients]);

  // Calculate totals whenever items or tax rate changes
  useEffect(() => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );
    const taxAmount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + taxAmount;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total,
    }));
  }, [formData.items, formData.tax_rate]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item changes
  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Calculate amount
    if (field === "quantity" || field === "unit_price") {
      const quantity =
        field === "quantity" ? Number(value) : updatedItems[index].quantity;
      const unitPrice =
        field === "unit_price" ? Number(value) : updatedItems[index].unit_price;
      updatedItems[index].amount = quantity * unitPrice;
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Add new item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unit_price: 0, amount: 0 },
      ],
    }));
  };

  // Remove item
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: updatedItems }));
    }
  };

  // Save invoice
  const saveInvoice = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (!formData.client_id) {
        throw new Error("Please select a client");
      }

      if (!formData.invoice_number) {
        throw new Error("Invoice number is required");
      }

      if (formData.items.some((item) => !item.description)) {
        throw new Error("All items must have a description");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (isNew) {
        // Create new invoice
        const { data: invoice, error: invoiceError } = await supabase
          .from("invoices")
          .insert({
            user_id: user.id,
            client_id: formData.client_id,
            invoice_number: formData.invoice_number,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            status: formData.status,
            notes: formData.notes,
            subtotal: formData.subtotal,
            tax_rate: formData.tax_rate,
            tax_amount: formData.tax_amount,
            total: formData.total,
          })
          .select()
          .single();

        if (invoiceError) throw new Error(invoiceError.message);

        // Create invoice items
        const itemsToInsert = formData.items.map((item) => ({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert);

        if (itemsError) throw new Error(itemsError.message);

        setSuccess("Invoice created successfully");
        router.push(`/dashboard/invoices/${invoice.id}`);
      } else {
        // Update existing invoice
        if (!invoice) throw new Error("Invoice not found");

        const { error: invoiceError } = await supabase
          .from("invoices")
          .update({
            client_id: formData.client_id,
            invoice_number: formData.invoice_number,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            status: formData.status,
            notes: formData.notes,
            subtotal: formData.subtotal,
            tax_rate: formData.tax_rate,
            tax_amount: formData.tax_amount,
            total: formData.total,
          })
          .eq("id", invoice.id)
          .eq("user_id", user.id);

        if (invoiceError) throw new Error(invoiceError.message);

        // Handle items - delete existing and insert new
        const { error: deleteError } = await supabase
          .from("invoice_items")
          .delete()
          .eq("invoice_id", invoice.id);

        if (deleteError) throw new Error(deleteError.message);

        const itemsToInsert = formData.items.map((item) => ({
          invoice_id: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert);

        if (itemsError) throw new Error(itemsError.message);

        setSuccess("Invoice updated successfully");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error saving invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      setLoading(true);
      // Find client details
      const client = clients.find((c) => c.id === formData.client_id);
      if (!client) throw new Error("Client not found");

      await generatePDF({
        invoice: {
          id: invoice?.id || "new",
          client_id: formData.client_id,
          invoice_number: formData.invoice_number,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          status: formData.status,
          notes: formData.notes,
          tax_rate: formData.tax_rate,
          subtotal: formData.subtotal,
          tax_amount: formData.tax_amount,
          total: formData.total,
          items: formData.items.map(item => ({
            ...item,
            id: item.id || "",
            invoice_id: invoice?.id || "new",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          client,
        },
      });
      setSuccess("PDF exported successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error exporting PDF:", err);
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
            onClick={() => router.push("/dashboard/invoices")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToPDF}
            disabled={loading || isNew}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button size="sm" onClick={saveInvoice} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {isNew ? "Create Invoice" : "Update Invoice"}
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) =>
                      handleSelectChange("client_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    name="invoice_number"
                    value={formData.invoice_number}
                    onChange={handleChange}
                    placeholder="INV-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    name="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    name="tax_rate"
                    type="number"
                    value={formData.tax_rate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Payment terms, additional information, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end border-b pb-4 last:border-0"
                  >
                    <div className="col-span-12 md:col-span-5">
                      <Label htmlFor={`item-${index}-description`}>
                        Description
                      </Label>
                      <Input
                        id={`item-${index}-description`}
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Label htmlFor={`item-${index}-quantity`}>Quantity</Label>
                      <Input
                        id={`item-${index}-quantity`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        min="1"
                        step="1"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Label htmlFor={`item-${index}-price`}>Unit Price</Label>
                      <Input
                        id={`item-${index}-price`}
                        type="number"
                        value={item.unit_price}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unit_price",
                            Number(e.target.value),
                          )
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                      <Input
                        id={`item-${index}-amount`}
                        type="number"
                        value={item.amount}
                        readOnly
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end border-t pt-4">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({formData.tax_rate}%):</span>
                  <span>${formData.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
