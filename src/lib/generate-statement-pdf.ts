import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Transaction } from './transactions';

// BBVA brand colors (RGB)
const NAVY = [18, 32, 63] as const;    // primary
const CYAN = [0, 191, 219] as const;   // accent teal
const WHITE = [255, 255, 255] as const;
const LIGHT_GRAY = [245, 245, 245] as const;
const GRAY = [120, 130, 145] as const;
const DARK = [30, 40, 60] as const;

function drawHeader(doc: jsPDF, startDate: Date, endDate: Date) {
  const w = doc.internal.pageSize.getWidth();

  // Navy header bar
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, w, 42, 'F');

  // Cyan accent line under header
  doc.setFillColor(...CYAN);
  doc.rect(0, 42, w, 3, 'F');

  // BBVA logo text
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BBVA', 20, 28);

  // Statement title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Account Statement', w - 20, 20, { align: 'right' });
  doc.setFontSize(9);
  doc.text(
    `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
    w - 20,
    30,
    { align: 'right' }
  );
}

function drawAccountInfo(doc: jsPDF, balance: number, y: number): number {
  const w = doc.internal.pageSize.getWidth();

  // Light background box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(15, y, w - 30, 38, 4, 4, 'F');

  // Cyan left accent
  doc.setFillColor(...CYAN);
  doc.rect(15, y, 3, 38, 'F');

  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Account *67', 25, y + 14);

  doc.setTextColor(...GRAY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('ES12 0182 **** **** **** 0067', 25, y + 23);

  doc.setTextColor(...NAVY);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${balance.toFixed(2)} €`, w - 25, y + 18, { align: 'right' });

  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Available balance', w - 25, y + 27, { align: 'right' });

  return y + 48;
}

function drawTableHeader(doc: jsPDF, y: number): number {
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(...NAVY);
  doc.rect(15, y, w - 30, 10, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', 20, y + 7);
  doc.text('Description', 60, y + 7);
  doc.text('Category', 135, y + 7);
  doc.text('Amount', w - 20, y + 7, { align: 'right' });

  return y + 14;
}

function drawTransactionRow(
  doc: jsPDF,
  txn: Transaction,
  y: number,
  isEven: boolean
): number {
  const w = doc.internal.pageSize.getWidth();

  if (isEven) {
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(15, y - 4, w - 30, 12, 'F');
  }

  doc.setTextColor(...DARK);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(format(txn.date, 'dd/MM/yy'), 20, y + 3);

  // Description (truncated)
  const desc = txn.description.length > 30
    ? txn.description.substring(0, 28) + '...'
    : txn.description;
  doc.text(desc, 60, y + 3);

  // Category badge
  doc.setFillColor(...CYAN);
  const catText = txn.category.charAt(0).toUpperCase() + txn.category.slice(1);
  const catWidth = doc.getTextWidth(catText) + 6;
  doc.roundedRect(133, y - 3, catWidth, 9, 2, 2, 'F');
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(catText, 136, y + 3);

  // Amount
  const isNeg = txn.amount < 0;
  doc.setTextColor(isNeg ? 180 : 0, isNeg ? 40 : 140, isNeg ? 40 : 60);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`${txn.amount.toFixed(2)} €`, w - 20, y + 3, { align: 'right' });

  return y + 12;
}

function drawFooter(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Cyan line
  doc.setFillColor(...CYAN);
  doc.rect(0, h - 18, w, 2, 'F');

  // Footer text
  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'BBVA, S.A. - This document is for informational purposes only.',
    w / 2,
    h - 10,
    { align: 'center' }
  );
  doc.text(
    `Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
    w / 2,
    h - 5,
    { align: 'center' }
  );
}

function drawSummary(doc: jsPDF, transactions: Transaction[], y: number): number {
  const w = doc.internal.pageSize.getWidth();

  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, y);
  y += 8;

  // Category totals
  const totals: Record<string, { count: number; total: number }> = {};
  for (const txn of transactions) {
    if (!totals[txn.category]) totals[txn.category] = { count: 0, total: 0 };
    totals[txn.category].count++;
    totals[txn.category].total += txn.amount;
  }

  const entries = Object.entries(totals).sort((a, b) => a[1].total - b[1].total);
  const colW = (w - 40) / 2;

  for (let i = 0; i < entries.length; i++) {
    const [cat, data] = entries[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xBase = 20 + col * colW;
    const yBase = y + row * 16;

    // Small bar
    const barWidth = Math.min(Math.abs(data.total) / 5, colW - 30);
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(xBase, yBase, colW - 10, 12, 2, 2, 'F');
    doc.setFillColor(...CYAN);
    doc.roundedRect(xBase, yBase, Math.max(barWidth, 8), 12, 2, 2, 'F');

    doc.setTextColor(...NAVY);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    doc.text(`${label} (${data.count})`, xBase + 3, yBase + 5);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.total.toFixed(2)} €`, xBase + 3, yBase + 10);
  }

  return y + Math.ceil(entries.length / 2) * 16 + 8;
}

export function generateStatementPDF(
  transactions: Transaction[],
  balance: number,
  startDate: Date,
  endDate: Date
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageH = doc.internal.pageSize.getHeight();

  drawHeader(doc, startDate, endDate);

  let y = 55;
  y = drawAccountInfo(doc, balance, y);
  y = drawSummary(doc, transactions, y + 2);

  y += 4;
  y = drawTableHeader(doc, y);

  for (let i = 0; i < transactions.length; i++) {
    if (y > pageH - 30) {
      drawFooter(doc);
      doc.addPage();
      drawHeader(doc, startDate, endDate);
      y = 52;
      y = drawTableHeader(doc, y);
    }
    y = drawTransactionRow(doc, transactions[i], y, i % 2 === 0);
  }

  // Total row
  const w = doc.internal.pageSize.getWidth();
  const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);
  doc.setFillColor(...NAVY);
  doc.rect(15, y, w - 30, 12, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Total', 20, y + 8);
  doc.text(`${totalAmount.toFixed(2)} €`, w - 20, y + 8, { align: 'right' });

  drawFooter(doc);
  doc.save(`BBVA_Statement_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.pdf`);
}
