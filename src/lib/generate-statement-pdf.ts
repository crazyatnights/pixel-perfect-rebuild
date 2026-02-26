import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { Transaction } from './transactions';

// BBVA brand colors (RGB)
const NAVY = [18, 32, 63] as const;
const CYAN = [0, 191, 219] as const;
const WHITE = [255, 255, 255] as const;
const LIGHT_GRAY = [240, 240, 240] as const;
const GRAY = [120, 130, 145] as const;
const DARK = [40, 40, 40] as const;
const BLACK = [0, 0, 0] as const;
const TABLE_BORDER = [200, 200, 200] as const;

function drawHeader(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();

  // Top navy bar
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, w, 8, 'F');

  // Cyan accent line
  doc.setFillColor(...CYAN);
  doc.rect(0, 8, w, 1.5, 'F');

  // Account holder info (left)
  doc.setTextColor(...DARK);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('BBVA ACCOUNT HOLDER', 15, 16);
  doc.text('CUSTOMER@EMAIL.COM', 15, 20);
  doc.text('MADRID - SPAIN', 15, 24);

  // BBVA logo (right)
  doc.setTextColor(...NAVY);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BBVA', w - 15, 20, { align: 'right' });

  doc.setTextColor(...CYAN);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.text('Creando Oportunidades', w - 15, 25, { align: 'right' });
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  const w = doc.internal.pageSize.getWidth();

  // Cyan background bar for section title
  doc.setFillColor(...NAVY);
  doc.rect(15, y, w - 30, 8, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 18, y + 5.5);

  return y + 12;
}

function drawInfoRow(doc: jsPDF, label: string, value: string, x: number, y: number, labelWidth = 45) {
  doc.setTextColor(...GRAY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(label, x, y);

  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(value, x + labelWidth, y);
}

function drawOfficeAndAccountInfo(doc: jsPDF, balance: number, startDate: Date, endDate: Date, y: number): number {
  const w = doc.internal.pageSize.getWidth();

  // Extracto de Cuenta main title
  doc.setTextColor(...NAVY);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Extracto de Cuenta', 15, y);
  y += 8;

  // Office info section
  y = drawSectionTitle(doc, 'Información de la oficina', y);
  drawInfoRow(doc, 'DIRECCIÓN:', 'C/ Gran Vía 1, Madrid', 18, y);
  y += 5;
  drawInfoRow(doc, 'TELÉFONO:', '00 34 912 345 678', 18, y);
  y += 9;

  // Account info section
  y = drawSectionTitle(doc, 'Información de la cuenta', y);
  const halfW = (w - 30) / 2;
  drawInfoRow(doc, 'Número de cuenta:', 'ES12 0182 **** **** 0067', 18, y, 35);
  drawInfoRow(doc, 'Fecha de corte:', format(endDate, 'dd-MM-yyyy'), 18 + halfW, y, 30);
  y += 5;
  drawInfoRow(doc, 'Saldo disponible:', `${balance.toFixed(2)} €`, 18, y, 35);
  drawInfoRow(doc, 'Período:', `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`, 18 + halfW, y, 30);
  y += 9;

  return y;
}

function drawMovementSummary(doc: jsPDF, transactions: Transaction[], balance: number, y: number): number {
  const w = doc.internal.pageSize.getWidth();

  y = drawSectionTitle(doc, 'Resumen de movimientos', y);

  const credits = transactions.filter(t => t.amount > 0);
  const debits = transactions.filter(t => t.amount < 0);
  const totalCredits = credits.reduce((s, t) => s + t.amount, 0);
  const totalDebits = debits.reduce((s, t) => s + Math.abs(t.amount), 0);
  const prevBalance = balance - transactions.reduce((s, t) => s + t.amount, 0);

  // Summary table
  const tableX = 15;
  const tableW = w - 30;
  const colWidths = [tableW * 0.35, tableW * 0.08, tableW * 0.22, tableW * 0.13, tableW * 0.22];
  const rowH = 7;

  // Table header
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(tableX, y, tableW, rowH, 'F');
  doc.setDrawColor(...TABLE_BORDER);
  doc.setLineWidth(0.3);
  doc.rect(tableX, y, tableW, rowH, 'S');

  doc.setTextColor(...NAVY);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('', tableX + 2, y + 5);
  doc.text('No.', tableX + colWidths[0] + 2, y + 5);
  doc.text('Valor', tableX + colWidths[0] + colWidths[1] + 2, y + 5);
  doc.text('', tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 5);
  doc.text('Valor', tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, y + 5);
  y += rowH;

  // Rows
  const summaryRows = [
    ['SALDO CIERRE MES ANTERIOR', '', prevBalance.toFixed(2), '', ''],
    ['+ ABONOS', String(credits.length), totalCredits.toFixed(2), '', ''],
    ['- CARGOS', String(debits.length), totalDebits.toFixed(2), '', ''],
    ['', '', '', 'SALDO FINAL', balance.toFixed(2)],
  ];

  for (let i = 0; i < summaryRows.length; i++) {
    const row = summaryRows[i];
    const ry = y;

    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(tableX, ry, tableW, rowH, 'F');
    }
    doc.setDrawColor(...TABLE_BORDER);
    doc.rect(tableX, ry, tableW, rowH, 'S');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', row[0].startsWith('+') || row[0].startsWith('-') ? 'normal' : 'bold');
    doc.setTextColor(...DARK);
    doc.text(row[0], tableX + 2, ry + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(row[1], tableX + colWidths[0] + 2, ry + 5);
    doc.text(row[2], tableX + colWidths[0] + colWidths[1] + 2, ry + 5);

    if (row[3]) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NAVY);
      doc.text(row[3], tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2, ry + 5);
      doc.setFontSize(7);
      doc.text(row[4], tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2, ry + 5);
    }

    y += rowH;
  }

  return y + 6;
}

function drawTransactionTableHeader(doc: jsPDF, y: number): number {
  const w = doc.internal.pageSize.getWidth();
  const tableX = 15;
  const tableW = w - 30;
  const rowH = 8;

  doc.setFillColor(...NAVY);
  doc.rect(tableX, y, tableW, rowH, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');

  doc.text('Movi-', tableX + 2, y + 5.5);
  doc.text('Fecha', tableX + 18, y + 5.5);
  doc.text('Concepto', tableX + 42, y + 5.5);
  doc.text('Cargos', tableX + tableW - 55, y + 5.5);
  doc.text('Abonos', tableX + tableW - 30, y + 5.5);
  doc.text('Saldo', tableX + tableW - 8, y + 5.5, { align: 'right' });

  return y + rowH;
}

function drawTransactionRow(doc: jsPDF, txn: Transaction, index: number, y: number, runningBalance: number): number {
  const w = doc.internal.pageSize.getWidth();
  const tableX = 15;
  const tableW = w - 30;
  const rowH = 6.5;

  // Alternating background
  if (index % 2 === 0) {
    doc.setFillColor(248, 249, 252);
    doc.rect(tableX, y, tableW, rowH, 'F');
  }

  // Row border
  doc.setDrawColor(...TABLE_BORDER);
  doc.setLineWidth(0.15);
  doc.line(tableX, y + rowH, tableX + tableW, y + rowH);

  doc.setTextColor(...DARK);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');

  // Movement number
  doc.text(String(10000 + index), tableX + 2, y + 4.5);

  // Date
  doc.text(format(txn.date, 'dd-MM-yyyy'), tableX + 18, y + 4.5);

  // Description (truncated)
  const desc = txn.description.length > 40 ? txn.description.substring(0, 38) + '...' : txn.description;
  doc.text(desc, tableX + 42, y + 4.5);

  // Cargos (debits) or Abonos (credits)
  doc.setFont('helvetica', 'bold');
  if (txn.amount < 0) {
    doc.setTextColor(180, 40, 40);
    doc.text(Math.abs(txn.amount).toFixed(2), tableX + tableW - 42, y + 4.5, { align: 'right' });
  } else {
    doc.setTextColor(0, 120, 60);
    doc.text(txn.amount.toFixed(2), tableX + tableW - 18, y + 4.5, { align: 'right' });
  }

  // Running balance
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'normal');
  doc.text(runningBalance.toFixed(2), tableX + tableW - 2, y + 4.5, { align: 'right' });

  return y + rowH;
}

function drawFooter(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Bottom navy bar
  doc.setFillColor(...NAVY);
  doc.rect(0, h - 14, w, 14, 'F');

  // Cyan accent
  doc.setFillColor(...CYAN);
  doc.rect(0, h - 14, w, 1, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'En cumplimiento de lo dispuesto en la Ley de Protección de Datos. Este documento es informativo.',
    w / 2, h - 8, { align: 'center' }
  );
  doc.text(
    `BBVA, S.A. — Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
    w / 2, h - 4, { align: 'center' }
  );
}

function drawPageNumber(doc: jsPDF, page: number, total: number) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setTextColor(...GRAY);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(`Página ${page} de ${total}`, w - 15, h - 17, { align: 'right' });
}

export function generateStatementPDF(
  transactions: Transaction[],
  balance: number,
  startDate: Date,
  endDate: Date
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageH = doc.internal.pageSize.getHeight();

  // Sort transactions by date ascending for the statement
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate running balances
  const totalChange = sorted.reduce((s, t) => s + t.amount, 0);
  let runningBalance = balance - totalChange;

  // Page 1
  drawHeader(doc);
  let y = 30;
  y = drawOfficeAndAccountInfo(doc, balance, startDate, endDate, y);
  y = drawMovementSummary(doc, sorted, balance, y);

  // Transaction details section
  y = drawSectionTitle(doc, 'Detalles de transacciones', y);
  y = drawTransactionTableHeader(doc, y);

  const pages: number[][] = [];
  let currentPage: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (y > pageH - 25) {
      pages.push([...currentPage]);
      currentPage = [];
      drawFooter(doc);
      doc.addPage();
      drawHeader(doc);
      y = 30;
      y = drawTransactionTableHeader(doc, y);
    }
    currentPage.push(i);
    runningBalance += sorted[i].amount;
    y = drawTransactionRow(doc, sorted[i], i, y, runningBalance);
  }
  pages.push(currentPage);

  // Draw footer on last page
  drawFooter(doc);

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageNumber(doc, p, totalPages);
  }

  doc.save(`BBVA_Extracto_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.pdf`);
}
