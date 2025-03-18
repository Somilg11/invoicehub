import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import ClientEditor from "@/components/client-editor";

export default async function ClientPage({
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

  // Fetch client data if it's an existing client
  let clientData = null;

  if (params.id !== "new") {
    const { data: client, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (error || !client) {
      redirect("/dashboard/clients");
    }

    clientData = client;
  }

  return (
    <div className="container py-10">
      <ClientEditor client={clientData} isNew={params.id === "new"} />
    </div>
  );
}
