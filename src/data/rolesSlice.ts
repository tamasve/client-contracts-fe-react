import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import * as URLS from './urls';
import { roleSchema, roleState, actionPayloadWhenError } from "./schemas";



// the inner data model
const initialState: roleState = {
    roles: [],
    status: 'idle',
    error: ''
}


// -- the Async Thunks for CRUD ops --

export const fetchRoles = createAsyncThunk('roles/fetchRoles',
    async () => {
        const response = await axios.get(URLS.REQUEST_URL + URLS.GET_ROLES);
        console.log("fetch roles - async thunk");
        console.log([...response.data])
        return [...response.data];      // shallow array copy
    }
)

export const addNewRole = createAsyncThunk('roles/addNewRole',
    async (initialRole: roleSchema) => {
        const response = await axios.post(URLS.REQUEST_URL + URLS.NEW_ROLE, initialRole);
        console.log("new role - async thunk");
        return response.data;
    }
)

export const updateRole = createAsyncThunk('roles/updateRole',
    async (initialRole: roleSchema) => {
        const { _id } = initialRole;
        const response = await axios.put(URLS.REQUEST_URL + URLS.UPDATE_ROLE + _id, initialRole)
        console.log(`update role - async thunk: ID ${_id} / ${initialRole.rolename}`);
        return response.data;
    }
)

export const deleteRole = createAsyncThunk('roles/deleteRole',
    async (initialRole: roleSchema) => {
        const { _id } = initialRole;
        const response = await axios.delete(URLS.REQUEST_URL + URLS.DELETE_ROLE + _id);
        console.log(`delete role - async thunk: ${_id}`);
        if (response?.status === 200) return response.data  // ? id ?
        return `${response?.status}: ${response?.statusText}`;
    }
)

// type rolesSliceType = {
//     name: string,
//     initialState: roleState,
//     reducers: object,
// }

// -- CREATE SLICE --

const rolesSlice = createSlice({

    name: 'roles',
    initialState,
    reducers: {},

    extraReducers(builder) {
        builder

            // get roles cases

            .addCase(fetchRoles.pending, (state, action) => {
                console.log("fetch roles - case: pending");
                state.status = "loading";
            })

            .addCase(fetchRoles.fulfilled, (state, action) => {
                console.log("fetch roles - case: fulfilled");
                state.status = "fulfilled";
                state.roles = action.payload;
                console.log(action);        // to check the complete action object
            })
            
            .addCase(fetchRoles.rejected, (state, action) => {
                console.log("fetch roles - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
                console.log(action);        // to check the complete action object
            })

            // new role cases

            .addCase(addNewRole.fulfilled, (state, action) => {
                console.log("add new role - case: fulfilled");
                console.log(action);
                const {rolename, description} = action.payload;    // extract role props...
                state.roles.push( {rolename, description} );     // ... then save the object into slice state
            })

            .addCase(addNewRole.rejected, (state, action) => {
                console.log("add new role - case: rejected");
                state.error = action.error.message as string;
            })

            // update role cases

            .addCase(updateRole.fulfilled, (state, action) => {
                console.log("update role - case: fulfilled");
                const { _id } = action.payload;
                const roles = state.roles.filter( (role) => role._id !== _id );
                state.roles = [...roles, action.payload];
            })

            .addCase(updateRole.rejected, (state, action) => {
                console.log("update role - case: rejected");
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during updating ${data._id}`;
            })

            // delete role cases

            .addCase(deleteRole.fulfilled, (state, action) => {
                console.log("delete role - case: fulfilled");
                const { _id } = action.payload;
                const roles = state.roles.filter( (role) => role._id !== _id );
                state.roles = roles;
            })

            .addCase(deleteRole.rejected, (state, action) => {
                console.log("delete role - case: rejected");
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during deleting ${data._id}`;
            })
    }
});

// -- EXPORT STATE AND THE ENTIRE SLICE --

export const selectAllRoles = (state) => state.rolesReducer.roles;
export const getRolesStatus = (state) => state.rolesReducer.status;
export const getRolesError = (state) => state.rolesReducer.error;

export const selectRoleByName = (state, roleName: string) => state.rolesReducer.roles.find( (role: roleSchema) => role.rolename === roleName );

export default rolesSlice.reducer;