import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Goal, ExchangeRate } from '@/types';
import { formatCurrency, calculateProgress, calculateTotalSaved } from '@/utils/calculations';

interface GoalCardProps {
  goal: Goal;
  exchangeRate: ExchangeRate | null;
  onAddContribution: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalCard = ({
  goal,
  exchangeRate,
  onAddContribution,
  onDeleteGoal,
}: GoalCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalSaved = exchangeRate
    ? calculateTotalSaved(goal.contributions, goal.currency, exchangeRate.rate)
    : goal.contributions
        .filter(c => c.currency === goal.currency)
        .reduce((sum, contrib) => sum + contrib.amount, 0);

  const progress = calculateProgress(totalSaved, goal.targetAmount);

  const convertedTarget = exchangeRate
    ? goal.currency === 'USD'
      ? goal.targetAmount * exchangeRate.rate
      : goal.targetAmount / exchangeRate.rate
    : null;

  const convertedCurrency = goal.currency === 'USD' ? 'INR' : 'USD';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.name}</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Target: {formatCurrency(goal.targetAmount, goal.currency)}
            </p>
            {convertedTarget && (
              <p className="text-xs text-gray-500">
                ≈ {formatCurrency(convertedTarget, convertedCurrency)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-1 rounded-full transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-900">{progress.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-600 font-medium">
            {formatCurrency(totalSaved, goal.currency)} saved
          </span>
          <span className="text-gray-500">
            {formatCurrency(goal.targetAmount - totalSaved, goal.currency)} remaining
          </span>
        </div>
      </div>

      {/* Recent Contributions */}
      {goal.contributions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Recent</span>
          </div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {goal.contributions
              .slice(-3)
              .reverse()
              .map((contrib) => (
                <div key={contrib.id} className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {new Date(contrib.date).toLocaleDateString()}
                  </span>
                  <span className="text-green-600 font-medium">
                    +{formatCurrency(contrib.amount, contrib.currency || goal.currency)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2">
        {showDeleteConfirm ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Delete this goal?</p>
            <div className="flex gap-2">
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="flex-1 px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onAddContribution(goal.id)}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md"
          >
            <Plus className="h-4 w-4" />
            Add Contribution
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
