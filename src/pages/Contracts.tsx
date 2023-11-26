import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../data/store';
import { useNavigate } from 'react-router-dom';

import { fetchClients, selectAllClients, getClientsStatus, getClientsError } from '../data/clientsSlice'
import { fetchContracts, selectAllContracts, getContractsStatus, getContractsError } from '../data/contractsSlice'
import { clientSchema, contractSchema } from '../data/schemas';
import { refreshAuth, getAccessToken, getAuthStatus } from '../data/authSlice';


export default function Contracts() {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // const [contracts, setContracts] = useState([{ Name: "" }]);

    const contracts: contractSchema[] = useSelector(selectAllContracts);
    const clients: clientSchema[] = useSelector(selectAllClients);

    const contractsStatus: string = useSelector(getContractsStatus);
    const contractsError: string = useSelector(getContractsError);

    // data refresh
    useEffect(() => {

        if (contractsStatus === "idle")  dispatch(fetchContracts());

    }, [contractsStatus, dispatch])



    // -- CREATE CONTENT function --

    function createContent() {
        // table header
        const buildTableHeader = () => {
            const thead = Object.keys(contracts[0])
                .map((key) => 
                    (key.startsWith("_") ? null : <div className="smaller-font" key={key}>{key.replace(/_/g," ").replace((" taxnumber"),"")}</div>)
                    );
            return thead;
        }

        // table body - here happens a kind of relational data connection:
        // change taxnumber to client name - JS version for Excel vlookup :) - clients.find(client => client.taxnumber === value)?.name
        const buildTableBody = () => {
            const tbody = contracts.map((obj) => (
                <div onDoubleClick={() => { navigate("/contracts/contract/" + obj.contract_id) }} className='trow contracts-grid' key={obj["contract_id"]}>
                    {Object.entries(obj).map(([key, value]) =>
                        (key.startsWith("_") ? null : 
                            <div className={key} key={key}>
                                { key.slice(-4) === "date" ? value.substring(0,10) :
                                        key.includes("tax") ? clients.find(client => client.taxnumber === value)?.name : value}
                            </div>)
                    )}
                </div>
            ));
            return tbody
        }

        return (
            <>
                <div className='theader contracts-grid'>
                    {buildTableHeader()}
                </div>
                <div className='tbody'>
                    {buildTableBody()}
                </div>
            </>
        )
    }
   // -- --

    // select row to modify
    const click = (text) => {
        console.log(text)
    }

    // Content, depending on Redux fetch async thunk status
    console.log(`clients request status = ${contractsStatus}`);
    let content: JSX.Element = <></>;
    switch (contractsStatus) {
        case "loading": content = <p>"loading clients..."</p>; break;
        case "failed": content = <h2>*** {contractsError} ***</h2>; break;
        case "fulfilled": content = createContent();
    }

    return (
        <>
            <img src="/desert.jpg" alt="landscape" />
            <h1>{">> Our leasing contracts <<"}</h1>
            <section className="table">
                {content}
            </section>
        </>
    )
}
