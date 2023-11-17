import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import * as URLS from './urls';
import { authState, userSchema, actionPayloadWhenError } from "./schemas";



// the inner data model
const initialState: authState = {
    username: "",
    accessToken: "",
    status: 'idle',
    error: ''
}


// -- the Async Thunks for authentication ops --

export const authenticateUser = createAsyncThunk('auth/authenticateUser',
    async (userAuth: Partial<userSchema>) => {
        const response = await axios.post(URLS.REQUEST_URL + URLS.AUTH, userAuth);
        console.log("authenticate user - async thunk");
        console.log({...response.data});
        return {...response.data};      // shallow array copy
    }
)

export const refreshAuth = createAsyncThunk('auth/refreshAuth',
    async () => {
        const response = await axios.get(URLS.REQUEST_URL + URLS.REFRESH);
        console.log("refresh access token - async thunk");
        return response.data;
    }
)

export const clearAuth = createAsyncThunk('auth/clearAuth',
    async (initialAuth: authSchema) => {
        const { _id } = initialAuth;
        const response = await axios.get(URLS.REQUEST_URL + URLS.UPDATE_CLIENT + _id, initialAuth)
        console.log(`update auth - async thunk: ID ${_id} / ${initialAuth.name}`);
        return response.data;
    }
)

// export const deleteAuth = createAsyncThunk('auths/deleteAuth',
//     async (initialAuth: authSchema) => {
//         const { _id } = initialAuth;
//         const response = await axios.delete(URLS.REQUEST_URL + URLS.DELETE_CLIENT + _id);
//         console.log(`delete auth - async thunk: ${_id}`);
//         if (response?.status === 200) return response.data  // ? id ?
//         return `${response?.status}: ${response?.statusText}`;
//     }
// )

// type authsSliceType = {
//     name: string,
//     initialState: authState,
//     reducers: object,
// }

// -- CREATE SLICE --

const authSlice = createSlice({

    name: 'auth',
    initialState,
    reducers: {},

    extraReducers(builder) {
        builder

            // auth. user cases

            .addCase(authenticateUser.pending, (state, action) => {
                console.log("authenticate user - case: pending");
                state.status = "authenticating";
            })

            .addCase(authenticateUser.fulfilled, (state, action) => {
                console.log("authenticate user - case: fulfilled");
                state.status = "fulfilled";
                state.error = "";
                state.accessToken = action.payload.accessToken;
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

            // refresh auth cases

            .addCase(refreshAuth.fulfilled, (state, action) => {
                console.log("refresh access token - case: fulfilled");
                console.log(action);
                state.status = "fulfilled";
                state.error = "";
                state.accessToken = action.payload.accessToken;
                // const {name, taxnumber, segment, headquarters, foundation} = action.payload;    // extract auth props...
                // state.auths.push( {name, taxnumber, segment, headquarters, foundation} );     // ... then save the object into slice state
            })
            
            .addCase(refreshAuth.rejected, (state, action) => {
                console.log("refresh access token - case: rejected");
                state.status = "failed";
                console.log(action);
                state.error = action.error.message as string;
            })

            // clear auth cases

            .addCase(clearAuth.fulfilled, (state, action) => {
                console.log("update auth - case: fulfilled");
                state.error = "";
                // const { _id } = action.payload;
                // const auths = state.auths.filter( (auth) => auth._id !== _id );
                // state.auths = [...auths, action.payload];
            })

            .addCase(clearAuth.rejected, (state, action) => {
                console.log("update auth - case: rejected");
                state.status = "failed";
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during updating ${data._id}`;
            })

            // // delete auth cases

            // .addCase(deleteAuth.fulfilled, (state, action) => {
            //     console.log("delete auth - case: fulfilled");
            //     const { _id } = action.payload;
            //     const auths = state.auths.filter( (auth) => auth._id !== _id );
            //     state.auths = auths;
            // })

            // .addCase(deleteAuth.rejected, (state, action) => {
            //     console.log("delete auth - case: rejected");
            //     const data = action.payload as actionPayloadWhenError
            //     console.log(data)     // error message and _id
            //     state.error = data.message || `error during deleting ${data._id}`;
            // })
    }
});

// -- EXPORT STATE AND THE ENTIRE SLICE --

export const getUserName = (state) => state.authReducer.username;
export const getAccessToken = (state) => state.authReducer.accessToken;
export const getAuthStatus = (state) => state.authReducer.status;
export const getAuthError = (state) => state.authReducer.error;

export default authSlice.reducer;