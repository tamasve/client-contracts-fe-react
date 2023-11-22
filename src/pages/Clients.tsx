import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchClients, selectAllClients, getClientsStatus, getClientsError } from '../data/clientsSlice'
import { clientSchema } from '../data/schemas';
import { getAccessToken } from '../data/authSlice';


export default function Clients() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let accessToken = useSelector(getAccessToken);
    console.log("accessToken:")
    console.log(accessToken)
    
    const clients: clientSchema[] = useSelector(selectAllClients);
    console.log("clients data received:")
    console.log(clients)
    const clientsStatus = useSelector(getClientsStatus);
    const clientsError = useSelector(getClientsError);



    // data refresh with Redux
    useEffect(() => {
        accessToken = localStorage.getItem("token");
        if (clientsStatus === "idle") dispatch(fetchClients(accessToken));
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


    // Content, depending on fetch status
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
