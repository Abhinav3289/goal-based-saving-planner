
import { Goal, ExchangeRate } from '@/types';
import { calculateTotalSaved, convertCurrency } from '@/utils/calculations';

export const useDashboardCalculations = (
  goals: Goal[],
  dashboardCurrency: 'USD' | 'INR',
  exchangeRate: ExchangeRate | null
) => {
  // Calculate dashboard totals in the selected currency
  const totalTarget = goals.reduce((sum, goal) => {
    if (!exchangeRate) {
      // If no exchange rate, only include goals in the same currency as dashboard
      return goal.currency === dashboardCurrency ? sum + goal.targetAmount : sum;
    }
    
    const targetInDashboardCurrency = convertCurrency(
      goal.targetAmount,
      goal.currency,
      dashboardCurrency,
      exchangeRate.rate
    );
    return sum + targetInDashboardCurrency;
  }, 0);

  const totalSaved = goals.reduce((sum, goal) => {
    if (!exchangeRate) {
      // If no exchange rate, only include contributions in the same currency as dashboard
      const saved = goal.contributions
        .filter(c => (c.currency || goal.currency) === dashboardCurrency)
        .reduce((goalSum, contrib) => goalSum + contrib.amount, 0);
      return sum + saved;
    }
    
    const savedInGoalCurrency = calculateTotalSaved(goal.contributions, goal.currency, exchangeRate.rate);
    const savedInDashboardCurrency = convertCurrency(
      savedInGoalCurrency,
      goal.currency,
      dashboardCurrency,
      exchangeRate.rate
    );
    return sum + savedInDashboardCurrency;
  }, 0);

  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Calculate equivalent amounts in the other currency for display
  const getEquivalentAmount = (amount: number, currency: 'USD' | 'INR') => {
    if (!exchangeRate) return null;
    const otherCurrency = currency === 'USD' ? 'INR' : 'USD';
    const converted = convertCurrency(amount, currency, otherCurrency, exchangeRate.rate);
    return { amount: converted, currency: otherCurrency };
  };

  const equivalentTarget = getEquivalentAmount(totalTarget, dashboardCurrency);
  const equivalentSaved = getEquivalentAmount(totalSaved, dashboardCurrency);

  return {
    totalTarget,
    totalSaved,
    overallProgress,
    equivalentTarget,
    equivalentSaved,
  };
};
