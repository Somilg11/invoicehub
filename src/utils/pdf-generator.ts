import { Invoice, Client } from "@/types/invoice";

interface PDFInvoice
  extends Omit<Invoice, "user_id" | "created_at" | "updated_at"> {
  client: Client;
}

interface PDFGeneratorProps {
  invoice: PDFInvoice;
}

export const generatePDF = async ({ invoice }: PDFGeneratorProps) => {
  // In a real application, you would use a library like jspdf or pdfmake
  // For this example, we'll create a simple HTML-based PDF and trigger a download

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          font-size: 16px;
          line-height: 24px;
        }
        .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
          border-collapse: collapse;
        }
        .invoice-box table td {
          padding: 5px;
          vertical-align: top;
        }
        .invoice-box table tr td:nth-child(2) {
          text-align: right;
        }
        .invoice-box table tr.top table td {
          padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
        }
        .invoice-box table tr.information table td {
          padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .invoice-box table tr.details td {
          padding-bottom: 20px;
        }
        .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
        }
        .invoice-box table tr.item.last td {
          border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(2) {
          border-top: 2px solid #eee;
          font-weight: bold;
        }
        .status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .status.paid {
          background-color: #d1fae5;
          color: #047857;
        }
        .status.unpaid {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .status.draft {
          background-color: #e5e7eb;
          color: #4b5563;
        }
        .status.overdue {
          background-color: #fef3c7;
          color: #92400e;
        }
        @media only screen and (max-width: 600px) {
          .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
          }
          .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="4">
              <table>
                <tr>
                  <td class="title">
                    INVOICE
                  </td>
                  <td>
                    <div class="status ${invoice.status}">${invoice.status}</div><br />
                    Invoice #: ${invoice.invoice_number}<br />
                    Created: ${new Date(invoice.issue_date).toLocaleDateString()}<br />
                    Due: ${new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    <strong>From:</strong><br />
                    Your Company Name<br />
                    Your Address<br />
                    Your Email
                  </td>
                  <td>
                    <strong>To:</strong><br />
                    ${invoice.client.name}<br />
                    ${invoice.client.company || ""}<br />
                    ${invoice.client.email || ""}<br />
                    ${invoice.client.address || ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="heading">
            <td>Item</td>
            <td>Quantity</td>
            <td>Unit Price</td>
            <td>Amount</td>
          </tr>

          ${
            invoice.items
              ?.map(
                (item) => `
            <tr class="item">
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${item.unit_price.toFixed(2)}</td>
              <td>$${item.amount.toFixed(2)}</td>
            </tr>
          `,
              )
              .join("") || ""
          }

          <tr class="total">
            <td colspan="3">Subtotal:</td>
            <td>$${invoice.subtotal.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Tax (${invoice.tax_rate}%):</td>
            <td>$${invoice.tax_amount.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td colspan="3">Total:</td>
            <td>$${invoice.total.toFixed(2)}</td>
          </tr>
        </table>

        ${
          invoice.notes
            ? `
        <div style="margin-top: 30px;">
          <strong>Notes:</strong>
          <p>${invoice.notes}</p>
        </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `;

  // Create a Blob with the HTML content
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Create a link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = `Invoice-${invoice.invoice_number}.html`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);

  return true;
};
