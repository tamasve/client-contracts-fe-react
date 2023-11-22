import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import * as URLS from './urls';
import { userSchema, userState, actionPayloadWhenError } from "./schemas";



// the inner data model
const initialState: userState = {
    users: [],
    status: 'idle',
    error: ''
}


// -- the Async Thunks for CRUD ops --

export const fetchUsers = createAsyncThunk('users/fetchUsers',
    async () => {
        const response = await axios.get(URLS.REQUEST_URL + URLS.GET_USERS);
        console.log("fetch users - async thunk");
        console.log([...response.data])
        return [...response.data];      // shallow array copy
    }
)

export const addNewUser = createAsyncThunk('users/addNewUser',
    async (initialUser: userSchema) => {
        const response = await axios.post(URLS.REQUEST_URL + URLS.NEW_USER, initialUser);
        console.log("new user - async thunk");
        return response.data;
    }
)

export const updateUser = createAsyncThunk('users/updateUser',
    async (initialUser: userSchema) => {
        const { _id } = initialUser;
        const response = await axios.put(URLS.REQUEST_URL + URLS.UPDATE_USER + _id, initialUser)
        console.log(`update user - async thunk: ID ${_id} / ${initialUser.username}`);
        return response.data;
    }
)

export const deleteUser = createAsyncThunk('users/deleteUser',
    async (initialUser: userSchema) => {
        const { _id } = initialUser;
        const response = await axios.delete(URLS.REQUEST_URL + URLS.DELETE_USER + _id);
        console.log(`delete user - async thunk: ${_id}`);
        if (response?.status === 200) return response.data  // ? id ?
        return `${response?.status}: ${response?.statusText}`;
    }
)

// type usersSliceType = {
//     name: string,
//     initialState: userState,
//     reducers: object,
// }

// -- CREATE SLICE --

const usersSlice = createSlice({

    name: 'users',
    initialState,
    reducers: {},

    extraReducers(builder) {
        builder

            // get users cases

            .addCase(fetchUsers.pending, (state, action) => {
                console.log("fetch users - case: pending");
                state.status = "loading";
            })

            .addCase(fetchUsers.fulfilled, (state, action) => {
                console.log("fetch users - case: fulfilled");
                state.status = "fulfilled";
                state.users = action.payload;
                console.log(action);        // to check the complete action object
            })
            
            .addCase(fetchUsers.rejected, (state, action) => {
                console.log("fetch users - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
                console.log(action);        // to check the complete action object
            })

            // new user cases

            .addCase(addNewUser.fulfilled, (state, action) => {
                console.log("add new user - case: fulfilled");
                state.status = "fulfilled";
                console.log(action);
                const {username, password, roles} = action.payload;    // extract user props...
                state.users.push( {username, password, roles} );     // ... then save the object into slice state
            })

            .addCase(addNewUser.rejected, (state, action) => {
                console.log("add new user - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
            })

            // update user cases

            .addCase(updateUser.fulfilled, (state, action) => {
                console.log("update user - case: fulfilled");
                state.status = "fulfilled";
                const { _id } = action.payload;
                const users = state.users.filter( (user) => user._id !== _id );
                state.users = [...users, action.payload];
            })

            .addCase(updateUser.rejected, (state, action) => {
                console.log("update user - case: rejected");
                state.status = "failed";
                console.log(action)     // error message and _id (sent by controller method on server)
                const data = action.payload as actionPayloadWhenError
                state.error = data.message || action.error.message as string;   // controller method message / Axios error message
            })

            // delete user cases

            .addCase(deleteUser.fulfilled, (state, action) => {
                console.log("delete user - case: fulfilled");
                state.status = "fulfilled";
                const { _id } = action.payload;
                const users = state.users.filter( (user) => user._id !== _id );
                state.users = users;
            })

            .addCase(deleteUser.rejected, (state, action) => {
                console.log("delete user - case: rejected");
                state.status = "failed";
                console.log(action)     // error message and _id (sent by controller method on server)
                const data = action.payload as actionPayloadWhenError
                state.error = data.message || action.error.message as string;   // controller method message / Axios error message
            })
    }
});

// -- EXPORT STATE AND THE ENTIRE SLICE --

export const selectAllUsers = (state) => state.usersReducer.users;
export const getUsersStatus = (state) => state.usersReducer.status;
export const getUsersError = (state) => state.usersReducer.error;

export const selectUserById = (state, userId: string) => state.usersReducer.users.find( (user: userSchema) => user._id === userId );

export default usersSlice.reducer;