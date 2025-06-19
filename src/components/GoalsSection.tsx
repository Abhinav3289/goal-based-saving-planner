import { PlusCircle, Target } from 'lucide-react';
import GoalCard from '@/components/GoalCard';
import { Goal, ExchangeRate } from '@/types';

interface GoalsSectionProps {
  goals: Goal[];
  exchangeRate: ExchangeRate | null;
  onAddGoal: () => void;
  onAddContribution: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalsSection = ({
  goals,
  exchangeRate,
  onAddGoal,
  onAddContribution,
  onDeleteGoal,
}: GoalsSectionProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Create your first savings goal to get started</p>
          <button
            onClick={onAddGoal}
            className="inline-flex items-center px-4 py-2 text-white rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              exchangeRate={exchangeRate}
              onAddContribution={onAddContribution}
              onDeleteGoal={onDeleteGoal}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GoalsSection;
