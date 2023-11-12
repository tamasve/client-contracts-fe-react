import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllRoles, getRolesStatus, getRolesError, selectRoleById, fetchRoles, addNewRole, updateRole, deleteRole } from '../data/rolesSlice';
import { roleSchema } from "../data/schemas";
import InputForm from '../components/InputForm';


export default function Role() {      // mapping: "roles/role/roleId" - roleId = taxnumber
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const rolesStatus = useSelector(getRolesStatus);
    const rolesError: string = useSelector( getRolesError );
    
    
    // data refresh with Redux
    useEffect(() => {
        
        if (rolesStatus === "idle") dispatch(fetchRoles());
        console.log("roles fetched");
    }, [rolesStatus, dispatch])
    
    const roles: roleSchema[] = useSelector( selectAllRoles );
    console.log("roles data received:")
    console.log(roles)


    const [addRequestStatus, setAddRequestStatus] = useState<string>("idle")

    
    
    // query a role for modification
    const role: roleSchema = {rolename: "", description: ""};
    // else role = useSelector( (state) => selectRoleById(state, roleId as string) );

    // role >> copy as roleObject for the Form
    const {rolename, description} = role;
    const [roleObject, setRoleObject] = useState<roleSchema>({rolename, description});




    // -- Button callbacks --

    const delRole = () => {
        const { _id } = role;
        try {
            dispatch( deleteRole({_id}) ).unwrap();
            navigate("/role");
        } catch(err) {
            console.error(err);
        }
    }

    // Modify: loads role data into the form fields then makes it visible
    const modifyRole = () => {
        const {rolename, description} = role;
        setRoleObject( {rolename, description} );
        // setDisplay("flex");
    }

    // New: make form visible with void fields
    const newRole = () => {
        setRoleObject({rolename: "", description: ""})
        // setDisplay("flex");
    }

    // Save: get role data from roleObject, _id from role - and save it in MongoDB through Redux store
    const saveRole = () => {
        console.log("save role...")
        const foundRole = roles.find( (role) => role.rolename === roleObject.rolename );  // is it new or modified?
        if (!foundRole) console.log("new role");
            else console.log("existing role");
        try {
            setAddRequestStatus("pending");
            const {rolename, description} = roleObject;
            const { _id } = role;
            if (!foundRole)  dispatch( addNewRole( {rolename, description} ) ).unwrap();
            else  dispatch( updateRole( {rolename, description, _id} ) ).unwrap();
            newRole();
            navigate("/role");
        } catch (err) {
            console.error(`Failed to save new role: ${err}`);
        } finally {
            setAddRequestStatus("idle");
        }
    }
    
    const createTable = () => {
        return <table>
            <thead>
            <tr>
                {Object.keys(roles[0]).map(key => (
                    <th key={key}>{key.startsWith("__") ? null : key.startsWith("_") ? "" : key}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {Object.entries(roles).map(([key, entry]) => (
                <tr key={key}>
                    <td><button>Add role...</button></td>
                    <td>{entry.rolename}</td>
                    <td>{entry.description}</td>
                </tr>
            ))}
            </tbody>
        </table>
    }

    console.log(`clients request status = ${rolesStatus}`);
    let content: JSX.Element = <></>;
    switch (rolesStatus) {
        case "loading": content = <p>"loading roles..."</p>; break;
        case "failed": content = <h2>*** {rolesError} ***</h2>; break;
        case "fulfilled": content = createTable();
    }

    // -- return JSX: 2 forms (display + modify) --

    return (
        <article className="client">


            <section>

                <h1>Roles</h1>
                {content}

                {/* <label>Name</label><span>{role.rolename}</span>
                <label>Taxnumber</label><span>{role.description}</span> */}

                <button type="button" onClick={delRole} >Delete role...</button>
                <button type="button" onClick={modifyRole} >Modify role...</button>
                <button type="button" onClick={newRole} >New role...</button>

            </section>
 
            <div>

            <InputForm data={roleObject}
                        setData={setRoleObject}
                        dataHandler={saveRole}
                        title={"Create or Modify a Role..."}
                        buttonCaption={"Create / Modify"}
                        clazz="form" />

                {rolesError && <h3>Error! - {rolesError}</h3>}

            </div>
        
        </article>
    )

}