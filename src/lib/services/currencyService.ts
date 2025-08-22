import axios from 'axios';

const API_KEY = '259ec802b7018a07ad14949d'; // You'll need to get this from exchangerate-api.com
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export interface CurrencyResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

export const getExchangeRates = async (baseCurrency: string = 'USD'): Promise<CurrencyResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }
};

export const convertCurrency = async (
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<number> => {
  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates.conversion_rates[toCurrency];
    if (!rate) {
      throw new Error(`Currency ${toCurrency} not found`);
    }
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}; 