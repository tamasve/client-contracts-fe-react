import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../data/store';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';

import { selectAllClients } from '../data/clientsSlice'
import { fetchContracts, selectAllContracts, getContractsStatus, getContractsError } from '../data/contractsSlice'
import { clientSchema, contractSchema } from '../data/schemas';
import { refreshAuth, getAuthStatus } from '../data/authSlice';


export default function Contracts() {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const prevStatus = useRef("idle");

    // const [contracts, setContracts] = useState([{ Name: "" }]);

    const contracts: contractSchema[] = useSelector(selectAllContracts);
    const clients: clientSchema[] = useSelector(selectAllClients);

    const contractsStatus: string = useSelector(getContractsStatus);
    const contractsError: string = useSelector(getContractsError);

    const authStatus: string = useSelector(getAuthStatus);

    // data refresh with Redux - combined with authentication handling:
    // when access token expires try to refresh it and after that request for the data again
    useEffect(() => {

        console.log(`useEffect -- contracts / status: ${contractsStatus} - prev.status: ${prevStatus.current} - error: ${contractsError}`);  // check
        console.log(`auth.status: ${authStatus}`)

        const accessToken: string = localStorage.getItem("token") || "";

        // start a request for a new access token... but only once!
        if (contractsStatus === "failed" && prevStatus.current !== "failed")  dispatch(refreshAuth());

        // data request only if data status is "idle" or if there was a failed data request but we have a new access token (indicated by authStatus)
        if (contractsStatus === "idle" || (contractsStatus === "failed" && authStatus === "fulfilled"))  dispatch(fetchContracts(accessToken));

        prevStatus.current = contractsStatus;     // save current data request status for the next render in order to avoid infinite re-rendering

    }, [contractsStatus, dispatch])



    // -- CREATE CONTENT function --
    // props beginning with "_" are skipped...

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


    // Content, depending on Redux fetch async thunk status
    console.log(`clients request status = ${contractsStatus}`);
    let content: JSX.Element = <></>;
    switch (contractsStatus) {
        case "loading": content = <p>"loading clients..."</p>; break;
        case "failed": return <Navigate to="/authenticate" state={{prevUrl: location}} />;
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
