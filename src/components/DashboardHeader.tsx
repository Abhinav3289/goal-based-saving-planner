import { Target, RefreshCw } from 'lucide-react';
import CurrencyToggle from '@/components/CurrencyToggle';
import { ExchangeRate } from '@/types';

interface DashboardHeaderProps {
  dashboardCurrency: 'USD' | 'INR';
  onCurrencyChange: (currency: 'USD' | 'INR') => void;
  exchangeRate: ExchangeRate | null;
  onRefreshRate: () => void;
  isLoadingRate: boolean;
}

const DashboardHeader = ({
  dashboardCurrency,
  onCurrencyChange,
  exchangeRate,
  onRefreshRate,
  isLoadingRate,
}: DashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Left Section */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Target className="text-blue-600" />
              Goal-Based Saving Planner
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track your savings goals and watch your progress grow
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <CurrencyToggle
              currency={dashboardCurrency}
              onCurrencyChange={onCurrencyChange}
            />

            {exchangeRate && (
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                1 USD = ₹{exchangeRate.rate.toFixed(2)} • Updated:{' '}
                {new Date(exchangeRate.lastUpdated).toLocaleTimeString()}
              </div>
            )}

            <button
              onClick={onRefreshRate}
              disabled={isLoadingRate}
              className={`flex items-center gap-2 text-sm border border-gray-300 rounded-md px-3 py-1.5 transition 
                hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
              Refresh Rate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
