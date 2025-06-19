import { useState } from 'react';
import { Contribution, ExchangeRate } from '@/types';
import { formatCurrency, convertCurrency } from '@/utils/calculations';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContribution: (contribution: Omit<Contribution, 'id'>) => void;
  goalName: string;
  goalCurrency: 'USD' | 'INR';
  exchangeRate: ExchangeRate | null;
}

const AddContributionModal = ({
  isOpen,
  onClose,
  onAddContribution,
  goalName,
  goalCurrency,
  exchangeRate,
}: AddContributionModalProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: goalCurrency,
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid positive amount';
      } else if (amount > 1000000) {
        newErrors.amount = 'Amount seems too large';
      }
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddContribution({
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: formData.date,
    });

    setFormData({
      amount: '',
      currency: goalCurrency,
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      currency: goalCurrency,
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  const getConversionPreview = () => {
    if (!formData.amount || !exchangeRate || formData.currency === goalCurrency) return null;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return null;

    const convertedAmount = convertCurrency(amount, formData.currency, goalCurrency, exchangeRate.rate);
    return formatCurrency(convertedAmount, goalCurrency);
  };

  const conversionPreview = getConversionPreview();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Add Contribution to {goalName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={formData.currency === 'USD'}
                  onChange={() => setFormData(prev => ({ ...prev, currency: 'USD' }))}
                />
                <span>USD ($)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="currency"
                  value="INR"
                  checked={formData.currency === 'INR'}
                  onChange={() => setFormData(prev => ({ ...prev, currency: 'INR' }))}
                />
                <span>INR (₹)</span>
              </label>
            </div>
            {exchangeRate && (
              <p className="text-xs text-gray-500 mt-1">
                Rate: 1 USD = ₹{exchangeRate.rate.toFixed(2)}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount ({formData.currency === 'USD' ? '$' : '₹'})
            </label>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.amount ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {conversionPreview && (
              <p className="text-sm text-blue-600 mt-1">
                ≈ {conversionPreview} (converted to goal currency)
              </p>
            )}
            {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.date ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
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
              className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-md"
            >
              Add Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;
