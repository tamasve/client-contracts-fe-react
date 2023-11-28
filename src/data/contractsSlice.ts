import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import * as URLS from './urls';
import { contractSchema, contractState, actionPayloadWhenError } from "./schemas";



// the inner data model
const initialState: contractState = {
    contracts: [],
    status: 'idle',
    error: ''
}


// -- the Async Thunks for CRUD ops --

export const fetchContracts = createAsyncThunk('contracts/fetchContracts',
    async (accessToken) => {
        const response = await axios.get(URLS.REQUEST_URL + URLS.GET_CONTRACTS, {headers: {Authorization: `Bearer ${accessToken}`}});
        console.log("fetch contracts - async thunk");
        console.log([...response.data])
        return [...response.data];      // shallow array copy
    }
)

export const addNewContract = createAsyncThunk('contracts/addNewContract',
    async ({initialContract, accessToken}: {initialContract: contractSchema, accessToken: string}) => {
        const response = await axios.post(URLS.REQUEST_URL + URLS.NEW_CONTRACT, initialContract, {headers: {Authorization: `Bearer ${accessToken}`}});
        console.log("new contract - async thunk");
        return response.data;
    }
)

export const updateContract = createAsyncThunk('contracts/updateContract',
    async ({initialContract, accessToken}: {initialContract: contractSchema, accessToken: string}) => {
        const { _id } = initialContract;
        const response = await axios.put(URLS.REQUEST_URL + URLS.UPDATE_CONTRACT + _id, initialContract, {headers: {Authorization: `Bearer ${accessToken}`}})
        console.log(`update contract - async thunk: ID ${_id} / ${initialContract.contract_id}`);
        return response.data;
    }
)

export const deleteContract = createAsyncThunk('contracts/deleteContract',
    async (initialContract: Partial<contractSchema>) => {
        const { _id } = initialContract;
        const response = await axios.delete(URLS.REQUEST_URL + URLS.DELETE_CONTRACT + _id, {headers: {Authorization: `Bearer ${accessToken}`}});
        console.log(`delete contract - async thunk: ${_id}`);
        if (response?.status === 200) return response.data  // ? id ?
        return `${response?.status}: ${response?.statusText}`;
    }
)

// type contractsSliceType = {
//     name: string,
//     initialState: contractState,
//     reducers: object,
// }

// -- CREATE SLICE --

const contractsSlice = createSlice({

    name: 'contracts',
    initialState,
    reducers: {},

    extraReducers(builder) {
        builder

            // get contracts cases

            .addCase(fetchContracts.pending, (state, action) => {
                console.log("fetch contracts - case: pending");
                state.status = "loading";
            })

            .addCase(fetchContracts.fulfilled, (state, action) => {
                console.log("fetch contracts - case: fulfilled");
                state.status = "fulfilled";
                state.contracts = action.payload;
                console.log(action);        // to check the complete action object
            })
            
            .addCase(fetchContracts.rejected, (state, action) => {
                console.log("fetch contracts - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
                console.log(action);        // to check the complete action object
            })

            // new contract cases

            .addCase(addNewContract.fulfilled, (state, action) => {
                console.log("add new contract - case: fulfilled");
                state.status = "fulfilled";
                console.log(action);
                const {contract_id, client_taxnumber, asset_num, asset_type, gross_asset_value, financed_amount, start_date, end_date, margin, remaining_debt} = action.payload;    // extract contract props...
                state.contracts.push( {contract_id, client_taxnumber, asset_num, asset_type, gross_asset_value, financed_amount, start_date, end_date, margin, remaining_debt} );     // ... then save the object into slice state
            })

            .addCase(addNewContract.rejected, (state, action) => {
                console.log("add new contract - case: rejected");
                state.status = "failed";
                state.error = action.error.message as string;
            })

            // update contract cases

            .addCase(updateContract.fulfilled, (state, action) => {
                console.log("update contract - case: fulfilled");
                state.status = "fulfilled";
                const { _id } = action.payload;
                const contracts = state.contracts.filter( (contract) => contract._id !== _id );
                state.contracts = [...contracts, action.payload];
            })

            .addCase(updateContract.rejected, (state, action) => {
                console.log("update contract - case: rejected");
                state.status = "failed";
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during updating ${data._id}`;
            })

            // delete contract cases

            .addCase(deleteContract.fulfilled, (state, action) => {
                console.log("delete contract - case: fulfilled");
                state.status = "fulfilled";
                const { _id } = action.payload;
                const contracts = state.contracts.filter( (contract) => contract._id !== _id );
                state.contracts = contracts;
            })

            .addCase(deleteContract.rejected, (state, action) => {
                console.log("delete contract - case: rejected");
                state.status = "failed";
                const data = action.payload as actionPayloadWhenError
                console.log(data)     // error message and _id
                state.error = data.message || `error during deleting ${data._id}`;
            })
    }
});

// -- EXPORT STATE AND THE ENTIRE SLICE --

export const selectAllContracts = (state) => state.contractsReducer.contracts;
export const getContractsStatus = (state) => state.contractsReducer.status;
export const getContractsError = (state) => state.contractsReducer.error;

export const selectContractById = (state, contractId: string) => state.contractsReducer.contracts.find( (contract: contractSchema) => contract.contract_id === contractId );

export default contractsSlice.reducer;