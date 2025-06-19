
export const formatCurrency = (amount: number, currency: 'USD' | 'INR'): string => {
  // Ensure we have a valid currency, default to USD if not provided
  const validCurrency = currency && (currency === 'USD' || currency === 'INR') ? currency : 'USD';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: validCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

export const calculateProgress = (saved: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min((saved / target) * 100, 100);
};

export const convertCurrency = (
  amount: number, 
  fromCurrency: 'USD' | 'INR', 
  toCurrency: 'USD' | 'INR',
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  } else if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  
  return amount;
};

export const calculateTotalSaved = (
  contributions: Array<{ amount: number; currency: 'USD' | 'INR' }>,
  goalCurrency: 'USD' | 'INR',
  exchangeRate: number
): number => {
  return contributions.reduce((total, contribution) => {
    const convertedAmount = convertCurrency(
      contribution.amount,
      contribution.currency,
      goalCurrency,
      exchangeRate
    );
    return total + convertedAmount;
  }, 0);
};
