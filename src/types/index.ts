
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currency: 'USD' | 'INR';
  contributions: Contribution[];
  createdAt: string;
}

export interface Contribution {
  id: string;
  amount: number;
  currency: 'USD' | 'INR';
  date: string;
}

export interface ExchangeRate {
  rate: number;
  lastUpdated: string;
}
