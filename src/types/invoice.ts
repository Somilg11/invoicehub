export interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: "paid" | "unpaid" | "overdue" | "draft";
  notes?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
  client?: Client;
  items?: InvoiceItem[];
}

export interface InvoiceFormData {
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  notes?: string;
  tax_rate: number;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[];
}
