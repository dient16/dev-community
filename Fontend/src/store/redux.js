import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
//import userSlice from './user/userSlice';
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
        app: appSlice,
        user: persistReducer(userConfig, appSlice),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
