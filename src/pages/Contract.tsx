import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllContracts, getContractsError, selectContractById, addNewContract, updateContract, deleteContract } from '../data/contractsSlice';
import { contractSchema } from "../data/schemas";
import InputForm from '../components/InputForm';
import { getAccessToken } from '../data/authSlice';


export default function Contract() {      // mapping: "contracts/contract/contractId" - contractId = taxnumber

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let accessToken: string = useSelector(getAccessToken);
    console.log("accessToken:")
    console.log(accessToken)

    const [addRequestStatus, setAddRequestStatus] = useState<string>("idle")

    // control the visibility of modifying / new creating form:  display = none / flex
    const [display, setDisplay] = useState<string>("none");
    
    
    // query a contract for modification
    const { contractId } = useParams<string>();   // get contract id = taxnumber
    const contract: contractSchema = useSelector( (state) => selectContractById(state, contractId as string) );

    // contract >> copy as contractObject for the Form
    const {contract_id,
            client_taxnumber,
            asset_num,
            asset_type,
            gross_asset_value,
            financed_amount,
            start_date,
            end_date,
            margin,
            remaining_debt} = contract;

    const [contractObject, setContractObject] = useState<contractSchema>(
                {contract_id,
                    client_taxnumber,
                    asset_num,
                    asset_type,
                    gross_asset_value,
                    financed_amount,
                    start_date,
                    end_date,
                    margin,
                    remaining_debt});

    const contracts: contractSchema[] = useSelector( selectAllContracts );
    const error: string = useSelector( getContractsError );


    // -- Button callbacks --

    const delContract = () => {
        const { _id } = contract;
        try {
            dispatch( deleteContract({_id}) ).unwrap();
            navigate("/contracts");
        } catch(err) {
            console.error(err);
        }
    }

    // Modify: loads contract data into the form fields then makes it visible
    const modifyContract = () => {
        const {contract_id,
                client_taxnumber,
                asset_num,
                asset_type,
                gross_asset_value,
                financed_amount,
                start_date,
                end_date,
                margin,
                remaining_debt} = contract;
        setContractObject( {contract_id,
                            client_taxnumber,
                            asset_num,
                            asset_type,
                            gross_asset_value,
                            financed_amount,
                            start_date,
                            end_date,
                            margin,
                            remaining_debt} );
        setDisplay("flex");
    }

    // New: make form visible with void fields
    const newContract = () => {
        setContractObject({contract_id: "",
                            client_taxnumber: "",
                            asset_num: 0,
                            asset_type: "",
                            gross_asset_value: 0,
                            financed_amount: 0,
                            start_date: new Date(0),
                            end_date: new Date(0),
                            margin: 0,
                            remaining_debt: 0})
        setDisplay("flex");
    }

    // Save: get contract data from contractObject, _id from contract - and save it in MongoDB through Redux store
    const saveContract = () => {
        console.log("save contract...")
        const foundContract = contracts.find( (contract) => contract.contract_id === contractObject.contract_id );  // is it new or modified?
        if (!foundContract) console.log("new contract");
            else console.log("existing contract");
        try {
            setAddRequestStatus("pending");
            const {contract_id,
                    client_taxnumber,
                    asset_num,
                    asset_type,
                    gross_asset_value,
                    financed_amount,
                    start_date,
                    end_date,
                    margin,
                    remaining_debt} = contractObject;
            const { _id } = contract;
            accessToken = localStorage.getItem("token");
            if (!foundContract)  dispatch( addNewContract( { initialContract:
                {contract_id,
                client_taxnumber,
                asset_num,
                asset_type,
                gross_asset_value,
                financed_amount,
                start_date,
                end_date,
                margin,
                remaining_debt}
                , accessToken } ) ).unwrap();
            else  dispatch( updateContract( { initialContract:
                {contract_id,
                client_taxnumber,
                asset_num,
                asset_type,
                gross_asset_value,
                financed_amount,
                start_date,
                end_date,
                margin,
                remaining_debt,
                _id: _id}, accessToken } ) ).unwrap();
            navigate("/contracts");
        } catch (err) {
            console.error(`Failed to save new contract: ${err}`);
        } finally {
            setAddRequestStatus("idle");
        }
    }
    

    // -- return JSX: 2 forms (display + modify) --

    return (
        <article className="genForm">

            <section>

                <label>contract_id</label><span>{contract.contract_id}</span>
                <label>client_taxnumber</label><span>{contract.client_taxnumber}</span>
                <label>asset_num</label><span>{contract.asset_num}</span>
                <label>asset_type</label><span>{contract.asset_type}</span>
                <label>gross_asset_value</label><span>{contract.gross_asset_value}</span>
                <label>financed_amount</label><span>{contract.financed_amount}</span>
                <label>start_date</label><span>{contract.start_date}</span>
                <label>end_date</label><span>{contract.end_date}</span>
                <label>margin</label><span>{contract.margin}</span>
                <label>remaining_debt</label><span>{contract.remaining_debt}</span>

                <button type="button" onClick={delContract} >Delete contract...</button>
                <button type="button" onClick={modifyContract} >Modify contract...</button>
                <button type="button" onClick={newContract} >New contract...</button>

            </section>
 
            <div style={{display: display}}>

                <InputForm data={contractObject}
                            setData={setContractObject}
                            dataHandler={saveContract}
                            title={"Create or Modify a Contract..."}
                            buttonCaption={"Create / Modify"}
                            clazz="form"
                            error={error}
                />
            </div>
        
        </article>
    )

}