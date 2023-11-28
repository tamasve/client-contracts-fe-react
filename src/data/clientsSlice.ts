import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import * as URLS from './urls';
import { clientSchema, clientState, actionPayloadWhenError } from "./schemas";



// the inner data model
const initialState: clientState = {
    clients: [],
    status: 'idle',
    error: ''
}


// -- the Async Thunks for CRUD ops --

export const fetchClients = createAsyncThunk('clients/fetchClients',
    async (accessToken) => {
        console.log("async - accessToken:")
        const response = await axios.get(URLS.REQUEST_URL + URLS.GET_CLIENTS, {headers: {Authorization: `Bearer ${accessToken}`}});
        console.log("fetch clients - async thunk");
        console.log([...response.data])
        return [...response.data];      // shallow array copy
    }
)

export const addNewClient = createAsyncThunk('clients/addNewClient',
    async ({initialClient, accessToken}: {initialClient: clientSchema, accessToken: string}) => {
        const response = await axios.post(URLS.REQUEST_URL + URLS.NEW_CLIENT, initialClient, {headers: {Authorization: `Bearer ${accessToken}`}});
        console.log("new client - async thunk");
        return response.data;
    }
)

export const updateClient = createAsyncThunk('clients/updateClient',
    async ({initialClient, accessToken}: {initialClient: clientSchema, accessToken: string}) => {
        console.log("update client")
        const { _id } = initialClient;
        const response = await axios.put(URLS.REQUEST_URL + URLS.UPDATE_CLIENT + _id, initialClient, {headers: {Authorization: `Bearer ${accessToken}`}})
        console.log(`update client - async thunk: ID ${_id} / ${initialClient.name}`);
        return response.data;
    }
)

export const deleteClient = createAsyncThunk('clients/deleteClient',
    async (initialClient: Partial<clientSchema>) => {
        const { _id } = initialClient;
        const response = await axios.delete(URLS.REQUEST_URL + URLS.DELETE_CLIENT + _id);
        console.log(`delete client - async thunk: ${_id}`);
        if (response?.status === 200) return response.data  // ? id ?
        return `${response?.status}: ${response?.statusText}`;
    }
)

// type clientsSliceType = {
//     name: string,
//     initialState: clientState,
//     reducers: object,
// }

// -- CREATE SLICE --

const clientsSlice = createSlice({

    name: 'clients',
    initialState,
    reducers: {},

    extraReducers(builder) {
        builder

            // get clients cases

            .addCase(fetchClients.pending, (state, action) => {
                console.log("fetch clients - case: pending");
                state.status = "loading";
            })

            .addCase(fetchClients.fulfilled, (state, action) => {
                console.log("fetch clients - case: fulfilled");
                state.status = "fulfilled";
                state.clients = action.payload;
                console.log(action);        // to check the complete action object
            })
            
            .addCase(fetchClients.rejected, (state, action) => {
                console.log("fetch clients - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
                console.log(action);        // to check the complete action object
            })

            // new client cases

            .addCase(addNewClient.fulfilled, (state, action) => {
                console.log("add new client - case: fulfilled");
                state.status = "fulfilled";
                console.log(action);
                const {name, taxnumber, segment, headquarters, foundation} = action.payload;    // extract client props...
                state.clients.push( {name, taxnumber, segment, headquarters, foundation} );     // ... then save the object into slice state
            })

            .addCase(addNewClient.rejected, (state, action) => {
                console.log("add new client - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
            })

            // update client cases

            .addCase(updateClient.fulfilled, (state, action) => {
                console.log("update client - case: fulfilled");
                state.status = "fulfilled";
                const { _id } = action.payload;
                const clients = state.clients.filter( (client) => client._id !== _id );
                state.clients = [...clients, action.payload];
            })

            .addCase(updateClient.rejected, (state, action) => {
                console.log("update client - case: rejected");
                state.status = "failed";
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during updating ${data._id}`;
            })

            // delete client cases

            .addCase(deleteClient.fulfilled, (state, action) => {
                console.log("delete client - case: fulfilled");
                state.status = "fulfilled";
                const { _id } = action.payload;
                const clients = state.clients.filter( (client) => client._id !== _id );
                state.clients = clients;
            })

            .addCase(deleteClient.rejected, (state, action) => {
                console.log("delete client - case: rejected");
                state.status = "failed";
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during deleting ${data._id}`;
            })
    }
});

// -- EXPORT STATE AND THE ENTIRE SLICE --

export const selectAllClients = (state) => state.clientsReducer.clients;
export const getClientsStatus = (state) => state.clientsReducer.status;
export const getClientsError = (state) => state.clientsReducer.error;

export const selectClientById = (state, clientId: string) => state.clientsReducer.clients.find( (client: clientSchema) => client.taxnumber === clientId );

export default clientsSlice.reducer;