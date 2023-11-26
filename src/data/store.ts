import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import clientsReducer from './clientsSlice';
import contractsReducer from './contractsSlice';
import usersReducer from './usersSlice';
import rolesReducer from './rolesSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        clientsReducer: clientsReducer,
        contractsReducer,
        usersReducer,
        rolesReducer,
        authReducer
    }
})

export type AppDispatch = typeof store.dispatch;        // by using this type in the components with Dispatch, it will know about the async thunks...
export type AppSelector = TypedUseSelectorHook<ReturnType<typeof store.getState>>;