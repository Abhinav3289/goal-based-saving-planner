
import { TrendingUp, Target, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';

interface DashboardStatsProps {
  totalTarget: number;
  totalSaved: number;
  overallProgress: number;
  dashboardCurrency: 'USD' | 'INR';
  equivalentTarget: { amount: number; currency: 'USD' | 'INR' } | null;
  equivalentSaved: { amount: number; currency: 'USD' | 'INR' } | null;
}

const DashboardStats = ({
  totalTarget,
  totalSaved,
  overallProgress,
  dashboardCurrency,
  equivalentTarget,
  equivalentSaved,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Total Target ({dashboardCurrency})</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTarget, dashboardCurrency)}</p>
        {equivalentTarget && (
          <p className="text-sm text-gray-500 mt-1">
            ≈ {formatCurrency(equivalentTarget.amount, equivalentTarget.currency)}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Total Saved ({dashboardCurrency})</h3>
        </div>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSaved, dashboardCurrency)}</p>
        {equivalentSaved && (
          <p className="text-sm text-gray-500 mt-1">
            ≈ {formatCurrency(equivalentSaved.amount, equivalentSaved.currency)}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Overall Progress</h3>
        </div>
        <p className="text-2xl font-bold text-purple-600">{overallProgress.toFixed(1)}%</p>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
