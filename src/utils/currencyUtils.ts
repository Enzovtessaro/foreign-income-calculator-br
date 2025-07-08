
// Mock currency conversion service
// In a real app, you would use a proper API like ExchangeRate-API, Fixer.io, etc.

const MOCK_EXCHANGE_RATES: Record<string, number> = {
  USD: 5.25,
  EUR: 5.68,
  GBP: 6.45,
  CAD: 3.89,
  AUD: 3.52,
};

export async function convertCurrency(currency: string): Promise<number> {
  console.log(`Fetching exchange rate for ${currency}...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock exchange rate
  const rate = MOCK_EXCHANGE_RATES[currency] || 5.25;
  
  // Add some random variation to simulate real rates
  const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
  const finalRate = rate * (1 + variation);
  
  console.log(`Exchange rate for ${currency}: ${finalRate.toFixed(4)}`);
  
  return parseFloat(finalRate.toFixed(4));
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
    BRL: "R$",
  };
  
  return symbols[currency] || currency;
}
