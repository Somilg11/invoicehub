import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import InvoiceEditor from "@/components/invoice-editor";

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch invoice data if it's an existing invoice
  let invoiceData = null;
  let clientsData = [];

  if (params.id !== "new") {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        client:clients(*),
        items:invoice_items(*)
      `,
      )
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (error || !invoice) {
      redirect("/dashboard/invoices");
    }

    invoiceData = invoice;
  }

  // Fetch clients for the dropdown
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", session.user.id)
    .order("name");

  if (clients) {
    clientsData = clients;
  }

  return (
    <div className="container py-10">
      <InvoiceEditor
        invoice={invoiceData}
        clients={clientsData}
        isNew={params.id === "new"}
      />
    </div>
  );
}
