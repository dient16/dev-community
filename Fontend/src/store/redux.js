import { configureStore } from '@reduxjs/toolkit';

import authSlice from './auth/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
const commonConfig = {
    key: 'dev-community/user',
    storage,
};
const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'currentUser'],
};
export const store = configureStore({
    reducer: {
        auth: persistReducer(userConfig, authSlice),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
