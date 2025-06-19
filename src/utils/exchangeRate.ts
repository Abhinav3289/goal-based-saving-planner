
import { ExchangeRate } from '@/types';

const API_KEY = 'YOUR_API_KEY'; // Users should replace this with their actual API key
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  try {
    // For demo purposes, we'll use a mock response if no API key is provided
    if (API_KEY === 'YOUR_API_KEY') {
      console.log('Using mock exchange rate data. Please set your API key for live data.');
      return {
        rate: 83.25, // Mock INR to USD rate
        lastUpdated: new Date().toISOString(),
      };
    }

    const response = await fetch(`${BASE_URL}/${API_KEY}/pair/USD/INR`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result !== 'success') {
      throw new Error(data['error-type'] || 'Failed to fetch exchange rate');
    }

    return {
      rate: data.conversion_rate,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};
