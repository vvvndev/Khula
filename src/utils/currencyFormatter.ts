export const formatCurrency = (amount: number, currency: string): string => {
  // Define currency code to symbol mapping
  const currencySymbols: Record<string, string> = {
    USD: '$',
    ZWL: 'ZWL$',
    ZAR: 'R',
    EUR: '€',
    GBP: '£',
  };

  // Get symbol or default to currency code
  const symbol = currencySymbols[currency] || currency;

  // Format the number
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Return formatted string
  return `${symbol}${formattedAmount}`;
};