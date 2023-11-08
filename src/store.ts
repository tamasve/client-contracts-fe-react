import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './clientsSlice';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export const store: ToolkitStore = configureStore({
    reducer: {
        clientsReducer: clientsReducer
    }
})