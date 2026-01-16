import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import userReducer from './userSlice'
import currencyReducer from '../CurrencyConverter/currencySlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    users: userReducer,
    currency: currencyReducer,
  },
});