import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../data/store';
import { useNavigate } from 'react-router-dom';

import { fetchClients, selectAllClients, getClientsStatus, getClientsError } from '../data/clientsSlice'
import { clientSchema } from '../data/schemas';
import { refreshAuth, getAccessToken, getAuthStatus } from '../data/authSlice';


export default function Clients() {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const prevStatus = useRef("idle");

    let accessToken: string | null = useSelector(getAccessToken);      // unfortunately this does not work - always void in Redux store (reason is under search)
    
    const clients: clientSchema[] = useSelector(selectAllClients);
    const clientsStatus: string = useSelector(getClientsStatus);
    const clientsError: string = useSelector(getClientsError);
    console.log(`clients / status: ${clientsStatus} - error: ${clientsError}`);
    
    const authStatus: string = useSelector(getAuthStatus);
    
    
    // data refresh with Redux - combined with authentication handling:
    // when access token expires try to refresh it and after that request for the data again
    useEffect(() => {

        console.log(`useEffect -- clients / status: ${clientsStatus} - prev.status: ${prevStatus.current} - error: ${clientsError}`);  // check
        console.log(`auth.status: ${authStatus}`)

        accessToken = localStorage.getItem("token");  // re-render seems to interfere with Redux, accessToken state is always void, I should use localStorage instead

        // start a request for a new access token... but only once!
        if (clientsStatus === "failed" && prevStatus.current !== "failed")  dispatch(refreshAuth());

        // data request only if data status is "idle" or if there was a failed data request but we have a new access token (indicated by authStatus)
        if (clientsStatus === "idle" || (clientsStatus === "failed" && authStatus === "fulfilled")) dispatch(fetchClients(accessToken));

        prevStatus.current = clientsStatus;     // save current data request status for the next render in order to avoid infinite re-rendering

    }, [accessToken, clientsStatus, dispatch])



    // -- CREATE CONTENT function --

    function createContent() {
        // table header: skip special DB properties
        const buildTableHeader = () => {
            const thead = Object.keys(clients[0])
                .map((key) => 
                    (key.startsWith("_") ? null : <div key={key}>{key}</div>)
                    );
            return thead;
        }

        // table body - every cell has its own class name (=header): "className={key}"
        const buildTableBody = () => {
            const tbody = clients.map((obj: clientSchema) => (
                <div onDoubleClick={() => { navigate("/clients/client/" + obj.taxnumber) }} className='trow clients-grid' key={obj["taxnumber"]}>
                    {Object.entries(obj).map(([key, value]) =>
                        (key.startsWith("_") ? null : <div className={key} key={key}>{value}</div>))}
                </div>
            ));
            return tbody
        }

        // The complete table...
        return (
            <>
                <div className='theader clients-grid'>
                    {buildTableHeader()}
                </div>
                <div className='tbody'>
                    {buildTableBody()}
                </div>
            </>)
    }
    // -- --


    // Content, depending on Redux fetch async thunk status
    console.log(`clients request status = ${clientsStatus}`);
    let content: JSX.Element = <></>;
    switch (clientsStatus) {
        case "loading": content = <p>"loading clients..."</p>; break;
        case "failed": content = <h2>*** {clientsError} ***</h2>; break;
        case "fulfilled": content = createContent();
    }


    return (
        <>
            <img src="/desert.jpg" alt="landscape" />
            <h1>{">> Our clients <<"}</h1>
            <section className="table">
                {content}
            </section>
        </>
    )
}
