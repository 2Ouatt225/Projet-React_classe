import { API_KEY, BASE_URL } from './config';

// Mock data for offline/fallback mode
const MOCK_CURRENCIES = [
    { code: 'XOF', name: 'West African CFA Franc' },
    { code: 'EUR', name: 'Euro' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
];

const MOCK_RATES = {
    'XOF-EUR': 0.0015,
    'EUR-XOF': 655.96,
    'XOF-USD': 0.0018,
    'USD-XOF': 555.50,
    'EUR-USD': 1.18,
    'USD-EUR': 0.85,
};

export const fetchSupportedCodes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${API_KEY}/codes`);
        const data = await response.json();

        if (data.result === 'success') {
            // Transform [[code, name], ...] to [{code, name}, ...]
            return data.supported_codes.map(item => ({
                code: item[0],
                name: item[1]
            }));
        } else {
            console.error('API Error fetching codes:', data['error-type']);
            return MOCK_CURRENCIES;
        }
    } catch (error) {
        console.warn('Network Error fetching codes, using mock data:', error.message);
        return MOCK_CURRENCIES;
    }
};

export const fetchExchangeRate = async (base, target) => {
    try {
        const response = await fetch(`${BASE_URL}/${API_KEY}/pair/${base}/${target}`);
        const data = await response.json();

        if (data.result === 'success') {
            return data.conversion_rate;
        } else {
            console.error('API Error fetching rate:', data['error-type']);
            const mockKey = `${base}-${target}`;
            return MOCK_RATES[mockKey] || 1.0;
        }
    } catch (error) {
        console.warn('Network Error fetching rate, using mock data:', error.message);
        const mockKey = `${base}-${target}`;
        return MOCK_RATES[mockKey] || 1.0;
    }
};
