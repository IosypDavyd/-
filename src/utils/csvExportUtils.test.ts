import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeCsvField,
  generateTransactionHistoryCsv,
} from './csvExportUtils.ts';
import type { TransactionRecord } from '../types/wallet.ts';

test('escapeCsvField properly escapes strings with quotes, commas, and regular values', () => {
  assert.strictEqual(escapeCsvField('simple'), '"simple"');
  assert.strictEqual(escapeCsvField('with,comma'), '"with,comma"');
  assert.strictEqual(escapeCsvField('with "quotes"'), '"with ""quotes"""');
  assert.strictEqual(escapeCsvField(123.45), '"123.45"');
  assert.strictEqual(escapeCsvField(null), '""');
  assert.strictEqual(escapeCsvField(undefined), '""');
});

test('generateTransactionHistoryCsv outputs correct RFC 4180 headers and rows', () => {
  const mockTxs: TransactionRecord[] = [
    {
      id: 'tx-test-1',
      type: 'swap',
      symbol: 'SOL → USDC',
      amount: 1.5,
      amountUsd: 276.3,
      fromAddress: 'SenderAddr11111111111111111111111111111111',
      toAddress: 'ReceiverAddr22222222222222222222222222222222',
      timestamp: 1729000000000,
      status: 'confirmed',
      signature: 'Sig1234567890abcdef',
      feeSol: 0.000005,
    },
    {
      id: 'tx-test-2',
      type: 'receive',
      symbol: 'BONK',
      amount: 500000,
      amountUsd: 12.5,
      fromAddress: 'SenderAddr22222222222222222222222222222222',
      toAddress: 'ReceiverAddr11111111111111111111111111111111',
      timestamp: 1729003600000,
      status: 'confirmed',
      signature: 'Sig0987654321fedcba',
      feeSol: 0.000005,
    },
  ];

  const csv = generateTransactionHistoryCsv(mockTxs);
  const lines = csv.split('\r\n');

  // Verify Header Line
  assert.strictEqual(lines.length, 3);
  assert.ok(lines[0].includes('Timestamp (ISO)'));
  assert.ok(lines[0].includes('Asset / Pair'));
  assert.ok(lines[0].includes('Notes / Classification'));

  // Verify first row
  assert.ok(lines[1].includes('"SWAP"'));
  assert.ok(lines[1].includes('"SOL → USDC"'));
  assert.ok(lines[1].includes('"1.5"'));
  assert.ok(lines[1].includes('"276.30"'));
  assert.ok(lines[1].includes('Taxable Event (Crypto-to-Crypto Swap)'));

  // Verify second row
  assert.ok(lines[2].includes('"RECEIVE"'));
  assert.ok(lines[2].includes('"BONK"'));
  assert.ok(lines[2].includes('"500000"'));
  assert.ok(lines[2].includes('"12.50"'));
  assert.ok(lines[2].includes('Incoming / Income or Transfer'));
});
