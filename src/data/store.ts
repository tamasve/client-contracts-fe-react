import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import clientsReducer from './clientsSlice';
import contractsReducer from './contractsSlice';
import usersReducer from './usersSlice';
import rolesReducer from './rolesSlice';
import authReducer from './authSlice';

export const store: ToolkitStore = configureStore({
    reducer: {
        clientsReducer: clientsReducer,
        contractsReducer,
        usersReducer,
        rolesReducer,
        authReducer
    }
})