import { useState, useEffect } from 'react'
import axios from 'axios'
import * as URLS from '../data/urls';


export default function Contracts() {

    const [contracts, setContracts] = useState([{ Name: "" }]);

    // data refresh
    useEffect(() => {

        const getContracts = async () => {
            try {
                const response = await axios.get(URLS.REQUEST_URL + URLS.GET_CONTRACTS);
                setContracts(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        getContracts();
    }, [])


    // table header
    const buildTableHeader = () => {
        const thead = Object.keys(contracts[0])
            .map((key) =>
                (<div>{key}</div>));
        return thead;
    }

    // table body
    const buildTableBody = () => {
        const tbody = contracts.map((obj) => (
            <div onDoubleClick={() => { click(obj["contract_id"]) }} className='trow contracts-grid'>
                {Object.entries(obj).map(([key, value]) =>
                    (<div className={key}>{value}</div>))}
            </div>
        ));
        return tbody
    }
    // select row to modify
    const click = (text) => {
        console.log(text)
    }


    return (
        <>
            <img src="/desert.jpg" alt="landscape" />
            <h1>{">> Our leasing contracts <<"}</h1>
            <section className="table">
                <div className='theader contracts-grid'>
                    {buildTableHeader()}
                </div>
                <div className='tbody'>
                    {buildTableBody()}
                </div>
            </section>
        </>
    )
}
