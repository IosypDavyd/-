import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_CRYPTO_NEWS,
  filterCryptoNews,
  fetchCryptoNewsAggregator,
} from './cryptoNewsService.ts';

test('filterCryptoNews filters by category correctly', () => {
  const solanaNews = filterCryptoNews(MOCK_CRYPTO_NEWS, { category: 'solana' });
  assert(solanaNews.length > 0);
  assert(solanaNews.every((a) => a.category === 'solana'));
});

test('filterCryptoNews filters by token symbol accurately', () => {
  const jupNews = filterCryptoNews(MOCK_CRYPTO_NEWS, { tokenSymbol: 'JUP' });
  assert(jupNews.length > 0);
  assert(jupNews.every((a) => a.relatedTokens.includes('JUP')));
});

test('filterCryptoNews filters by search query', () => {
  const searchResults = filterCryptoNews(MOCK_CRYPTO_NEWS, { searchQuery: 'Firedancer' });
  assert.strictEqual(searchResults.length, 1);
  assert(searchResults[0].title.includes('Firedancer'));
});

test('fetchCryptoNewsAggregator returns list asynchronously', async () => {
  const news = await fetchCryptoNewsAggregator('all');
  assert.strictEqual(news.length, MOCK_CRYPTO_NEWS.length);
});
