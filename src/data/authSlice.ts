import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import * as URLS from './urls';
import { authState, userSchema } from "./schemas";



// the inner data model
const initialState: authState = {
    username: "",
    accessToken: "",
    status: 'idle',
    error: ''
}


// -- the Async Thunks for authentication ops --

export const authenticateUser = createAsyncThunk('auth/authenticateUser',
    async (user: Partial<userSchema>) => {
        const response = await axios.post(URLS.REQUEST_URL + URLS.AUTH, {"UserAuth": user}, { withCredentials: true });   // withCredentials = true - to aut.ly send + receive cookies (jwt)
        console.log("authenticate user - async thunk");
        console.log(response)
        console.log({...response.data});
        return {...response.data};      // shallow array copy
    }
)

export const refreshAuth = createAsyncThunk('auth/refreshAuth',
    async () => {
        const response = await axios.get(URLS.REQUEST_URL + URLS.REFRESH, { withCredentials: true });
        console.log("refresh access token - async thunk");
        return response.data;
    }
)

export const clearAuth = createAsyncThunk('auth/clearAuth',
    async () => {
        const response = await axios.get(URLS.REQUEST_URL + URLS.LOGOUT, { withCredentials: true })
        console.log("logout - async thunk");
        return response.data;
    }
)


// -- CREATE SLICE --

const authSlice = createSlice({

    name: 'auth',
    initialState,
    reducers: {},

    extraReducers(builder) {
        builder

            // "auth. user" cases

            .addCase(authenticateUser.pending, (state, action) => {
                console.log("authenticate user - case: pending");
                state.status = "authenticating";
            })

            .addCase(authenticateUser.fulfilled, (state, action) => {
                console.log("authenticate user - case: fulfilled");
                state.status = "fulfilled";
                state.error = "";
                state.accessToken = action.payload.accessToken;
                state.username = action.payload.username;   // BE sends back the username
                localStorage.setItem("token", action.payload.accessToken);  // re-render seems to interfere with Redux, I should use localStorage instead
                localStorage.setItem("user", action.payload.username);
                console.log(action);        // to check the complete action object
            })
            
            .addCase(authenticateUser.rejected, (state, action) => {
                console.log("authenticate user - case: rejected");
                state.status = "failed";
                console.log(action);        // to check the complete action object
                state.error = action.error.message as string;
                const status: string = state.error.slice(-3);
                switch(status) {
                    case "400": state.error = "Username and password required"; break;
                    case "401": state.error = "No such username or password"; break;
                }
            })

            // "refresh auth" cases

            .addCase(refreshAuth.fulfilled, (state, action) => {
                console.log("refresh access token - case: fulfilled");
                console.log(action);
                state.status = "fulfilled";
                state.error = "";
                state.accessToken = action.payload.accessToken;
                localStorage.setItem("token", action.payload.accessToken);
            })
            
            .addCase(refreshAuth.rejected, (state, action) => {
                console.log("refresh access token - case: rejected");
                state.status = "failed";
                console.log(action);
                state.error = action.error.message as string;
            })
            
            // "clear auth" cases
            
            .addCase(clearAuth.fulfilled, (state, action) => {
                console.log("logout - case: fulfilled");
                console.log(action);
                state.status = "fulfilled";
                state.username = "";
                state.error = "";
                state.accessToken = "";
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })

            .addCase(clearAuth.rejected, (state, action) => {
                console.log("logout - case: rejected");
                state.status = "failed";
                console.log(action)
                state.error = action.error.message as string;
            })
    }
});

// -- EXPORT STATE AND THE ENTIRE SLICE --

export const getUserName = (state) => state.authReducer.username;
export const getAccessToken = (state) => state.authReducer.accessToken;
export const getAuthStatus = (state) => state.authReducer.status;
export const getAuthError = (state) => state.authReducer.error;

export default authSlice.reducer;