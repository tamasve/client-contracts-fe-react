import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllClients, getClientsError, selectClientById, addNewClient, updateClient, deleteClient } from '../data/clientsSlice';
import clientSchema from "../data/schemas";


export default function Client() {      // mapping: "clients/client/clientId" - clientId = taxnumber

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [addRequestStatus, setAddRequestStatus] = useState<string>("idle")

    // control the visibility of modifying / new creating form:  display = none / flex
    const [display, setDisplay] = useState<string>("none");

    // client properties as states
    const [name, setName] = useState<string>("");
    const [taxnumber, setTaxnumber] = useState<string>("");
    const [segment, setSegment] = useState<string>("");
    const [headquarters, setHeadquarters] = useState<string>("");
    const [foundation, setFoundation] = useState<string>("");

    // setters for the form input fields
    const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {setName(event.target.value)}
    const changeTaxnumber = (event: React.ChangeEvent<HTMLInputElement>) => {setTaxnumber(event.target.value)}
    const changeSegment = (event: React.ChangeEvent<HTMLInputElement>) => {setSegment(event.target.value)}
    const changeHeadquarters = (event: React.ChangeEvent<HTMLInputElement>) => {setHeadquarters(event.target.value)}
    const changeFoundation = (event: React.ChangeEvent<HTMLInputElement>) => {setFoundation(event.target.value)}


    // query a client for modification
    const { clientId } = useParams<string>();   // get client id = taxnumber
    const client: clientSchema = useSelector( (state) => selectClientById(state, clientId) );
    console.log(client?.name || "client query error");

    const clients: clientSchema[] = useSelector( selectAllClients );
    const error: string = useSelector( getClientsError );


    // -- Button callbacks --

    const delClient = () => {
        const { _id } = client;
        try {
            dispatch( deleteClient({_id}) ).unwrap();
            navigate("/clients");
        } catch(err) {
            console.error(err);
        }
    }

    // Modify: loads client data into the form fields then makes it visible
    const modifyClient = () => {
        setName(client.name)
        setTaxnumber(client.taxnumber)
        setSegment(client.segment)
        setHeadquarters(client.headquarters)
        setFoundation(client.foundation)
        setDisplay("flex");
    }

    // make form visible with void fields
    const newClient = () => {
        setName("")
        setTaxnumber("")
        setSegment("")
        setHeadquarters("")
        setFoundation("")
        setDisplay("flex");
    }

    // for disabling Save button
    const canSave = [name, taxnumber, segment, headquarters, foundation].every(Boolean) && addRequestStatus === "idle";

    const saveNewClient = () => {
        console.log("save client...")
        const foundClient = clients.find( (client) => client.taxnumber === taxnumber );  // is it new or modified?
        if (!foundClient) console.log("new client");
            else console.log("existing client");
        try {
            setAddRequestStatus("pending");
            const { _id } = client;
            if (!foundClient)  dispatch( addNewClient( {name, taxnumber, segment, headquarters, foundation} ) ).unwrap();
            else  dispatch( updateClient( {name, taxnumber, segment, headquarters, foundation, _id} ) ).unwrap();
            navigate("/clients");
        } catch (err) {
            console.error(`Failed to save new client: ${err}`);
        } finally {
            setAddRequestStatus("idle");
        }
    }
    

    // -- return JSX --

    return (
        <article className="client">
            <section>
                <label>Name</label><span>{client.name}</span>
                <label>Taxnumber</label><span>{client.taxnumber}</span>
                <label>Segment</label><span>{client.segment}</span>
                <label>Headquarters</label><span>{client.headquarters}</span>
                <label>Foundation</label><span>{client.foundation}</span>
                <button type="button" onClick={delClient} >Delete client...</button>
                <button type="button" onClick={modifyClient} >Modify client...</button>
                <button type="button" onClick={newClient} >New client...</button>
            </section>
 
            <section style={{display: display}}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={name} onChange={changeName} />
                <label htmlFor="taxnumber">Taxnumber</label>
                <input type="text" id="taxnumber" name="taxnumber" value={taxnumber} onChange={changeTaxnumber} />
                <label htmlFor="segment">Segment</label>
                <input type="text" id="segment" name="segment" value={segment} onChange={changeSegment} />
                <label htmlFor="headquarters">Headquarters</label>
                <input type="text" id="headquarters" name="headquarters" value={headquarters} onChange={changeHeadquarters} />
                <label htmlFor="foundation">Foundation</label>
                <input type="text" id="foundation" name="foundation" value={foundation} onChange={changeFoundation} />
                <button type="button" disabled={!canSave} onClick={saveNewClient} >Save</button>
                {error && <h3>Error! - {error}</h3>}
            </section>
        
        </article>
    )

}