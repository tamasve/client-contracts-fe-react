// client object structure
export interface clientSchema {
    name: string,
    taxnumber: string,
    segment: string,
    headquarters: string,
    foundation: string,
    _id?: string
}

// client: the interface for the inner data model
export interface clientState {
    clients: clientSchema[],
    status: string,
    error: string
}


// contract object structure
export interface contractSchema {
    contract_id: string,
    client_taxnumber: string,
    asset_num: number,
    asset_type: string,
    gross_asset_value: number,
    financed_amount: number,
    start_date: Date,
    end_date: Date,
    margin: number,
    remaining_debt: number,
    _id?: string
}

// contract: the interface for the inner data model
export interface contractState {
    contracts: contractSchema[],
    status: string,
    error: string
}


// user object structure
export interface userSchema {
    username: string,
    password: string,
    roles: object,
    _id?: string
}

// user: the interface for the inner data model
export interface userState {
    users: userSchema[],
    status: string,
    error: string
}


// role object structure
export interface roleSchema {
    rolename: string,
    description: string,
    _id?: string
}

// role: the interface for the inner data model
export interface roleState {
    roles: roleSchema[],
    status: string,
    error: string
}



// definitive feedback from BE when error occurs
export type actionPayloadWhenError = {
    message: string,
    _id: number
}