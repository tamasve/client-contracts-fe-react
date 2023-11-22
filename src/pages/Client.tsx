import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllClients, getClientsError, selectClientById, addNewClient, updateClient, deleteClient } from '../data/clientsSlice';
import { clientSchema } from "../data/schemas";
import InputForm from '../components/InputForm';
import { getAccessToken } from '../data/authSlice';


export default function Client() {      // mapping: "clients/client/clientId" - clientId = taxnumber

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let accessToken: string = useSelector(getAccessToken);
    console.log("accessToken:")
    console.log(accessToken)

    const [addRequestStatus, setAddRequestStatus] = useState<string>("idle")

    // control the visibility of modifying / new creating form:  display = none / flex
    const [display, setDisplay] = useState<string>("none");
    
    
    // query a client for modification
    const { clientId } = useParams<string>();   // get client id = taxnumber
    const client: clientSchema = useSelector( (state) => selectClientById(state, clientId as string) );

    // client >> copy as clientObject for the Form
    const {name, taxnumber, segment, headquarters, foundation} = client;
    const [clientObject, setClientObject] = useState<clientSchema>({name, taxnumber, segment, headquarters, foundation});

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
        const {name, taxnumber, segment, headquarters, foundation} = client;
        setClientObject( {name, taxnumber, segment, headquarters, foundation} );
        setDisplay("flex");
    }

    // New: make form visible with void fields
    const newClient = () => {
        setClientObject({name: "", taxnumber: "", segment: "", headquarters: "", foundation: ""})
        setDisplay("flex");
    }

    // Save: get client data from clientObject, _id from client - and save it in MongoDB through Redux store
    const saveClient = () => {
        console.log("save client...")
        const foundClient = clients.find( (client) => client.taxnumber === clientObject.taxnumber );  // is it new or modified?
        if (!foundClient) console.log("new client");
            else console.log("existing client");
        try {
            setAddRequestStatus("pending");
            const {name, taxnumber, segment, headquarters, foundation} = clientObject;
            const { _id } = client;
            accessToken = localStorage.getItem("token");
            if (!foundClient)  dispatch( addNewClient( { initialClient: {name, taxnumber, segment, headquarters, foundation}, accessToken } ) ).unwrap();
            else  dispatch( updateClient( { initialClient: {name, taxnumber, segment, headquarters, foundation, _id}, accessToken } ) ).unwrap();
            navigate("/clients");
        } catch (err) {
            console.error(`Failed to save new client: ${err}`);
        } finally {
            setAddRequestStatus("idle");
        }
    }
    

    // -- return JSX: 2 forms (display + modify) --

    return (
        <article className="genForm">

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
 
            <div style={{display: display}}>

                <InputForm data={clientObject}
                            setData={setClientObject}
                            dataHandler={saveClient}
                            title={"Create or Modify a Client..."}
                            buttonCaption={"Create / Modify"}
                            clazz="form" />

                {error && <h3>Error! - {error}</h3>}
                
            </div>
        
        </article>
    )

}