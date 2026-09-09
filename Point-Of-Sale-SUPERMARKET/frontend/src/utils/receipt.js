import { jsPDF } from 'jspdf';
import { formatZmw } from './currency.js';

export function downloadReceipt(sale, { cashierName, customerName }) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a5' });
  const left = 16;
  let y = 18;
  pdf.setFontSize(18);
  pdf.text('FreshMart Supermarket', left, y);
  y += 9;
  pdf.setFontSize(10);
  pdf.text('Point of Sale Receipt', left, y);
  y += 9;
  pdf.text(`Transaction ID: ${sale.id}`, left, y);
  y += 6;
  pdf.text(`Receipt: ${sale.receiptNumber}`, left, y);
  y += 6;
  pdf.text(`Date: ${new Date(sale.createdAt).toLocaleString('en-ZM')}`, left, y);
  y += 6;
  pdf.text(`Cashier: ${cashierName}`, left, y);
  y += 6;
  pdf.text(`Customer: ${customerName || 'Walk-in customer'}`, left, y);
  y += 10;
  pdf.line(left, y, 132, y);
  y += 7;
  sale.items.forEach((item) => {
    pdf.text(`${item.name} x${item.quantity}`, left, y);
    pdf.text(formatZmw(item.lineTotal), 132, y, { align: 'right' });
    y += 6;
  });
  y += 2;
  pdf.line(left, y, 132, y);
  y += 7;
  pdf.text('Subtotal', left, y);
  pdf.text(formatZmw(sale.subtotal), 132, y, { align: 'right' });
  y += 6;
  pdf.text('Discount', left, y);
  pdf.text(formatZmw(sale.discount), 132, y, { align: 'right' });
  y += 7;
  pdf.setFontSize(12);
  pdf.text('Total', left, y);
  pdf.text(formatZmw(sale.total), 132, y, { align: 'right' });
  y += 8;
  pdf.setFontSize(10);
  pdf.text(`Payment method: ${sale.payment.method}`, left, y);
  pdf.save(`${sale.receiptNumber || 'freshmart-receipt'}.pdf`);
}