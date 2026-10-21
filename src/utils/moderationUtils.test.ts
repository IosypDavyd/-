import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterHarmfulContent,
  isUserBlocked,
  createModerationReport,
  filterVisibleMessages,
} from './moderationUtils.ts';

test('filterHarmfulContent allows benign messages', () => {
  const result = filterHarmfulContent('Hello, how do I stake SOL on Jito?');
  assert.equal(result.isHarmful, false);
  assert.equal(result.sanitizedText, 'Hello, how do I stake SOL on Jito?');
});

test('filterHarmfulContent flags seed phrase leaks', () => {
  const result = filterHarmfulContent('Here is my seed phrase: apple banana cherry dog elephant fox grape horse iris jaguar kiwi lemon');
  assert.equal(result.isHarmful, true);
  assert.ok(result.reason?.includes('Seed/Private Key Leak'));
});

test('filterHarmfulContent flags phishing airdrop sites', () => {
  const result = filterHarmfulContent('Click here to claim free solana: claim-airdrop.xyz bonus now!');
  assert.equal(result.isHarmful, true);
  assert.ok(result.reason?.includes('Malicious Drainer Link'));
});

test('isUserBlocked returns true for blocked address regardless of case', () => {
  const blockedList = ['8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'];
  assert.equal(isUserBlocked('8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', blockedList), true);
  assert.equal(isUserBlocked('8xkxtg2cw87d97txjsdpbd5jbkhetqa83tzrujosgasu', blockedList), true);
  assert.equal(isUserBlocked('someOtherAddress1111111111111111111111111111', blockedList), false);
});

test('filterVisibleMessages filters out blocked senders', () => {
  const messages = [
    { senderAddress: 'userA', text: 'Good morning' },
    { senderAddress: 'scamBot', text: 'Spam link' },
    { senderAddress: 'userB', text: 'Nice avatar' },
  ];
  const filtered = filterVisibleMessages(messages, ['scamBot']);
  assert.equal(filtered.length, 2);
  assert.equal(filtered[0].senderAddress, 'userA');
  assert.equal(filtered[1].senderAddress, 'userB');
});

test('createModerationReport initializes a proper pending report', () => {
  const rep = createModerationReport({
    messageId: 'm-123',
    reportedSenderName: 'MaliciousSpammer',
    reportedSenderAddress: 'addr-bad-1',
    reportedMessageText: 'claim 50 sol free',
    reporterAddress: 'addr-me-1',
    reason: 'spam',
  });
  assert.ok(rep.id.startsWith('rep-'));
  assert.equal(rep.messageId, 'm-123');
  assert.equal(rep.reason, 'spam');
  assert.equal(rep.status, 'pending');
});
