import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'
import transactionReducer from './slices/transactionSlice'
import orderReducer from './slices/orderSlice'
import faqReducer from './slices/faqSlice'
import subscriberReducer from './slices/subscriberSlice'
import pushNotificationReducer from './slices/pushNotificationSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    users: userReducer,
    ui: uiReducer,
    transactions: transactionReducer,
    orders: orderReducer,
    faqs: faqReducer,
    subscribers: subscriberReducer,
    pushNotifications: pushNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
