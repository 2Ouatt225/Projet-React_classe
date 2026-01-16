export const countryMapping = {
  "USD": { name: "United States Dollar", countries: "United States, USA, America", flagCode: "us" },
  "EUR": { name: "Euro", countries: "European Union, France, Germany, Italy, Spain", flagCode: "eu" },
  "GBP": { name: "British Pound Sterling", countries: "United Kingdom, UK, England", flagCode: "gb" },
  "JPY": { name: "Japanese Yen", countries: "Japan", flagCode: "jp" },
  "AUD": { name: "Australian Dollar", countries: "Australia", flagCode: "au" },
  "CAD": { name: "Canadian Dollar", countries: "Canada", flagCode: "ca" },
  "CHF": { name: "Swiss Franc", countries: "Switzerland", flagCode: "ch" },
  "CNY": { name: "Chinese Yuan", countries: "China", flagCode: "cn" },
  "SEK": { name: "Swedish Krona", countries: "Sweden", flagCode: "se" },
  "NZD": { name: "New Zealand Dollar", countries: "New Zealand", flagCode: "nz" },
  "MXN": { name: "Mexican Peso", countries: "Mexico", flagCode: "mx" },
  "SGD": { name: "Singapore Dollar", countries: "Singapore", flagCode: "sg" },
  "HKD": { name: "Hong Kong Dollar", countries: "Hong Kong", flagCode: "hk" },
  "NOK": { name: "Norwegian Krone", countries: "Norway", flagCode: "no" },
  "KRW": { name: "South Korean Won", countries: "South Korea", flagCode: "kr" },
  "TRY": { name: "Turkish Lira", countries: "Turkey", flagCode: "tr" },
  "RUB": { name: "Russian Ruble", countries: "Russia", flagCode: "ru" },
  "INR": { name: "Indian Rupee", countries: "India", flagCode: "in" },
  "BRL": { name: "Brazilian Real", countries: "Brazil", flagCode: "br" },
  "ZAR": { name: "South African Rand", countries: "South Africa", flagCode: "za" },
  "XOF": { name: "Franc CFA (UEMOA)", countries: "Côte d'Ivoire, Senegal, Mali, Togo, Benin, Burkina Faso, Niger, Guinea-Bissau", flagCode: "sn" }, // Sénégal comme représentant
  "XAF": { name: "Franc CFA (CEMAC)", countries: "Cameroon, Gabon, Chad, Congo, Equatorial Guinea, CAR", flagCode: "CM" }, // Cameroun comme représentant
  "MAD": { name: "Moroccan Dirham", countries: "Morocco", flagCode: "ma" },
  "DZD": { name: "Algerian Dinar", countries: "Algeria", flagCode: "dz" },
  "TND": { name: "Tunisian Dinar", countries: "Tunisia", flagCode: "tn" },
  "EGP": { name: "Egyptian Pound", countries: "Egypt", flagCode: "eg" },
  "NGN": { name: "Nigerian Naira", countries: "Nigeria", flagCode: "ng" },
  "GHS": { name: "Ghanaian Cedi", countries: "Ghana", flagCode: "gh" },
  "KES": { name: "Kenyan Shilling", countries: "Kenya", flagCode: "ke" },
  "AED": { name: "United Arab Emirates Dirham", countries: "UAE, United Arab Emirates, Dubai", flagCode: "ae" },
  "SAR": { name: "Saudi Riyal", countries: "Saudi Arabia", flagCode: "sa" },
  "ILS": { name: "Israeli New Shekel", countries: "Israel", flagCode: "il" },
  "PHP": { name: "Philippine Peso", countries: "Philippines", flagCode: "ph" },
  "IDR": { name: "Indonesian Rupiah", countries: "Indonesia", flagCode: "id" },
  "VND": { name: "Vietnamese Dong", countries: "Vietnam", flagCode: "vn" },
  "THB": { name: "Thai Baht", countries: "Thailand", flagCode: "th" },
  "MYR": { name: "Malaysian Ringgit", countries: "Malaysia", flagCode: "my" },
};

// Fonction utilitaire pour récupérer les infos (avec fallback)
export const getCurrencyInfo = (code) => {
    return countryMapping[code] || { name: code, countries: "", flagCode: "un" }; // 'un' = United Nations (générique) ou inconnu
};

// Nouvelle fonction pour l'URL du drapeau
export const getFlagUrl = (flagCode) => {
    return `https://flagcdn.com/w80/${flagCode.toLowerCase()}.png`;
};
