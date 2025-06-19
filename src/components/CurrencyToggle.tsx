import { DollarSign, IndianRupee } from 'lucide-react';

interface CurrencyToggleProps {
  currency: 'USD' | 'INR';
  onCurrencyChange: (currency: 'USD' | 'INR') => void;
}

const CurrencyToggle = ({ currency, onCurrencyChange }: CurrencyToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Display:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onCurrencyChange('USD')}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition 
            ${currency === 'USD' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <DollarSign className="h-3 w-3" />
          USD
        </button>
        <button
          onClick={() => onCurrencyChange('INR')}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition 
            ${currency === 'INR' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <IndianRupee className="h-3 w-3" />
          INR
        </button>
      </div>
    </div>
  );
};

export default CurrencyToggle;
