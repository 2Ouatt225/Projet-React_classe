import { API_KEY, BASE_URL } from './config';
import { cacheRate, getCachedRate, cacheSupportedCodes, getCachedSupportedCodes } from './database';

export const fetchSupportedCodes = async () => {
    try {
        // Try Network
        const response = await fetch(`${BASE_URL}/${API_KEY}/codes`);
        const data = await response.json();
        
        if (data.result === 'success') {
            const formattedCodes = data.supported_codes.map(code => ({
                code: code[0],
                name: code[1]
            }));
            // Update Cache
            cacheSupportedCodes(formattedCodes);
            return formattedCodes;
        }
    } catch (error) {
        console.log("Network request failed, checking cache for codes...", error.message);
    }

    // Fallback Code (Cache)
    const cached = getCachedSupportedCodes();
    if (cached && cached.length > 0) {
        return cached; 
    }

    console.log("No cache available, returning empty list.");
    return [];
};

export const fetchExchangeRate = async (base, target) => {
    try {
        // Try Network
        const response = await fetch(`${BASE_URL}/${API_KEY}/pair/${base}/${target}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            const rate = data.conversion_rate;
            // Update Cache
            cacheRate(base, target, rate);
            return rate;
        }
    } catch (error) {
        console.log(`Network request failed for ${base}/${target}, checking cache...`);
    }

    // Fallback Code (Cache)
    const cachedRate = getCachedRate(base, target);
    if (cachedRate !== null) {
        return cachedRate;
    }

    console.log("No cache available for this pair.");
    return null;
};
