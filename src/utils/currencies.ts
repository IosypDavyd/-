export interface FiatCurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number; // 1 USD = rateToUsd in target currency
}

export const FIAT_CURRENCIES: FiatCurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.92 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', rateToUsd: 41.5 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.79 },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', rateToUsd: 4.02 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUsd: 0.88 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToUsd: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.52 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUsd: 154.5 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rateToUsd: 34.2 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', rateToUsd: 485.0 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUsd: 5.65 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rateToUsd: 3.67 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rateToUsd: 23.4 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rateToUsd: 10.6 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rateToUsd: 10.8 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rateToUsd: 6.87 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rateToUsd: 368.0 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', rateToUsd: 4.58 },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', rateToUsd: 2.72 },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', rateToUsd: 17.8 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToUsd: 7.23 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 84.1 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rateToUsd: 1380.0 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToUsd: 1.33 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rateToUsd: 7.78 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rateToUsd: 19.8 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUsd: 17.9 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', rateToUsd: 3.75 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rateToUsd: 3.75 },
];

export function formatFiat(amountUsd: number, currencyCode: string = 'USD'): string {
  const curr = FIAT_CURRENCIES.find((c) => c.code === currencyCode) || FIAT_CURRENCIES[0];
  const converted = amountUsd * curr.rateToUsd;
  if (converted === 0) return `${curr.symbol}0.00`;
  if (converted < 0.01) {
    return `${curr.symbol}${converted.toFixed(6)}`;
  }
  return `${curr.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
