import { useState } from 'react';
import { Goal } from '@/types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'contributions' | 'createdAt'>) => void;
}

const AddGoalModal = ({ isOpen, onClose, onAddGoal }: AddGoalModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currency: 'USD' as 'USD' | 'INR',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else {
      const amount = parseFloat(formData.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.targetAmount = 'Please enter a valid positive amount';
      } else if (amount > 10000000) {
        newErrors.targetAmount = 'Amount seems too large';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddGoal({
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      currency: formData.currency,
    });

    setFormData({ name: '', targetAmount: '', currency: 'USD' });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', targetAmount: '', currency: 'USD' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name */}
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium">
              Goal Name
            </label>
            <input
              id="goalName"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Target Amount */}
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium">
              Target Amount
            </label>
            <input
              id="targetAmount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.targetAmount ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.targetAmount && <p className="text-sm text-red-500 mt-1">{errors.targetAmount}</p>}
          </div>

          {/* Currency Select */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as 'USD' | 'INR' }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
