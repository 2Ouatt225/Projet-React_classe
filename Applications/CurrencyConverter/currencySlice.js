import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch exchange rates
export const fetchRates = createAsyncThunk(
  'currency/fetchRates',
  async (baseCode) => {
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCode}`);
    const data = await response.json();
    return data;
  }
);

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    rates: {},
    baseCurrency: 'USD',
    targetCurrency: 'EUR',
    amount: '',
    result: null,
    lastUpdated: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBaseCurrency: (state, action) => {
      state.baseCurrency = action.payload;
    },
    setTargetCurrency: (state, action) => {
      state.targetCurrency = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    convertCurrency: (state) => {
      if (state.rates[state.targetCurrency] && state.amount) {
        const rate = state.rates[state.targetCurrency];
        const result = (parseFloat(state.amount) * rate).toFixed(2);
        state.result = result;
        
        // Add to history
        const newEntry = {
          id: Date.now().toString(),
          base: state.baseCurrency,
          target: state.targetCurrency,
          amount: state.amount,
          result: result,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        };
        state.history.unshift(newEntry); // Add to beginning of list
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.result === "success") {
            state.rates = action.payload.rates;
            state.lastUpdated = action.payload.time_last_update_utc;
        } else {
            state.error = "Failed to fetch rates";
        }
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setBaseCurrency, setTargetCurrency, setAmount, convertCurrency, clearHistory } = currencySlice.actions;

export default currencySlice.reducer;
