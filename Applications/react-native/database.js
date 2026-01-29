import * as SQLite from 'expo-sqlite';

// Open or create the database
const db = SQLite.openDatabaseSync('easychange.db');

export const initDB = () => {
    try {
        // Transactions Table
        db.execSync(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                time TEXT,
                fromAmount TEXT,
                fromCurrency TEXT,
                toAmount TEXT,
                toCurrency TEXT
            );
        `);
        
        // Cached Rates Table
        db.execSync(`
            CREATE TABLE IF NOT EXISTS cached_rates (
                base_code TEXT,
                target_code TEXT,
                rate REAL,
                timestamp INTEGER,
                PRIMARY KEY (base_code, target_code)
            );
        `);

        // Cached Codes Table
        db.execSync(`
            CREATE TABLE IF NOT EXISTS cached_codes (
                code TEXT PRIMARY KEY,
                name TEXT
            );
        `);

        console.log("Database initialized with offline support");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

export const addTransaction = (fromAmount, fromCurrency, toAmount, toCurrency) => {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR'); // e.g., 29/01/2026
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); // e.g., 18:30

    try {
        db.runSync(
            'INSERT INTO transactions (date, time, fromAmount, fromCurrency, toAmount, toCurrency) VALUES (?, ?, ?, ?, ?, ?)',
            [date, time, fromAmount, fromCurrency, toAmount, toCurrency]
        );
        console.log("Transaction added");
    } catch (error) {
        console.error("Error adding transaction:", error);
    }
};

export const getTransactions = () => {
    try {
        const result = db.getAllSync('SELECT * FROM transactions ORDER BY id DESC');
        return result;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
};

// --- Offline Caching Methods ---

export const cacheRate = (base, target, rate) => {
    try {
        const timestamp = Date.now();
        db.runSync(
            `INSERT OR REPLACE INTO cached_rates (base_code, target_code, rate, timestamp) VALUES (?, ?, ?, ?)`,
            [base, target, rate, timestamp]
        );
    } catch (error) {
        console.error("Error caching rate:", error);
    }
};

export const getCachedRate = (base, target) => {
    try {
        const result = db.getAllSync(
            `SELECT rate FROM cached_rates WHERE base_code = ? AND target_code = ?`,
            [base, target]
        );
        if (result.length > 0) {
            return result[0].rate;
        }
        return null;
    } catch (error) {
        console.error("Error fetching cached rate:", error);
        return null;
    }
};

export const cacheSupportedCodes = (codes) => {
    try {
        db.runSync('DELETE FROM cached_codes'); // Clear old codes
        // Insert in batch would be better but explicit loop is safer for simple SQLite wrapper
        for (const c of codes) {
            db.runSync(
                `INSERT INTO cached_codes (code, name) VALUES (?, ?)`,
                [c.code, c.name]
            );
        }
    } catch (error) {
        console.error("Error caching codes:", error);
    }
};

export const getCachedSupportedCodes = () => {
    try {
        const result = db.getAllSync('SELECT * FROM cached_codes');
        return result; // returns array of objects {code, name}
    } catch (error) {
        console.error("Error fetching cached codes:", error);
        return [];
    }
};
