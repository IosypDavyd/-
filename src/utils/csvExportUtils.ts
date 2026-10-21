import type { TransactionRecord } from '../types/wallet.ts';

/**
 * Escapes CSV field according to RFC 4180 rules
 */
export function escapeCsvField(value: string | number | undefined | null): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  // If field contains comma, quote, or newline, escape internal quotes by doubling them and enclose in quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates RFC 4180 standard compliant CSV content for tax and accounting reports
 */
export function generateTransactionHistoryCsv(
  transactions: TransactionRecord[],
  walletAddress?: string
): string {
  const headers = [
    'Timestamp (ISO)',
    'Date (UTC)',
    'Time (UTC)',
    'Transaction ID',
    'Type',
    'Asset / Pair',
    'Amount',
    'Amount (USD)',
    'Fee (SOL)',
    'Status',
    'From Address',
    'To Address',
    'Solana Signature',
    'Explorer Link',
    'Notes / Classification'
  ];

  const rows = transactions.map((tx) => {
    const d = new Date(tx.timestamp);
    const isoDate = d.toISOString();
    const dateUtc = isoDate.split('T')[0];
    const timeUtc = isoDate.split('T')[1].replace('Z', ' UTC');
    const explorerUrl = `https://solscan.io/tx/${tx.signature}`;

    // Tax classification label
    let classification = 'Standard Transfer';
    if (tx.type === 'swap') classification = 'Taxable Event (Crypto-to-Crypto Swap)';
    else if (tx.type === 'receive') classification = 'Incoming / Income or Transfer';
    else if (tx.type === 'send') classification = 'Outgoing / Disposal or Payment';
    else if (tx.type === 'stake') classification = 'Staking Deposit';
    else if (tx.type === 'mint') classification = 'NFT Minting Purchase';

    return [
      escapeCsvField(isoDate),
      escapeCsvField(dateUtc),
      escapeCsvField(timeUtc),
      escapeCsvField(tx.id),
      escapeCsvField(tx.type.toUpperCase()),
      escapeCsvField(tx.symbol),
      escapeCsvField(tx.amount),
      escapeCsvField(tx.amountUsd.toFixed(2)),
      escapeCsvField(tx.feeSol || 0.000005),
      escapeCsvField(tx.status.toUpperCase()),
      escapeCsvField(tx.fromAddress),
      escapeCsvField(tx.toAddress),
      escapeCsvField(tx.signature),
      escapeCsvField(explorerUrl),
      escapeCsvField(classification),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers client-side download of generated CSV file
 */
export function downloadTransactionHistoryCsv(
  transactions: TransactionRecord[],
  walletAddress?: string
): string {
  const csvContent = generateTransactionHistoryCsv(transactions, walletAddress);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = `ecosystem_wallet_tax_accounting_${dateStr}.csv`;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return filename;
}
