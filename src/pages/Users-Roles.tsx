import { useState, useEffect, FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllRoles, getRolesStatus, getRolesError, selectRoleById, fetchRoles, addNewRole, updateRole, deleteRole } from '../data/rolesSlice';
import { selectAllUsers, getUsersStatus, getUsersError, selectUserById, fetchUsers, addNewUser, updateUser, deleteUser } from '../data/usersSlice';
import { userSchema, roleSchema } from "../data/schemas";
import InputForm from '../components/InputForm';


export default function UsersRoles() {      // mapping: "roles/role/roleId" - roleId = taxnumber
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const usersStatus = useSelector(getUsersStatus);
    const usersError: string = useSelector( getUsersError );
    
    const rolesStatus = useSelector(getRolesStatus);
    const rolesError: string = useSelector( getRolesError );
    
    
    // data refresh from DB with Redux: users + roles
    useEffect(() => {
        
        if (usersStatus === "idle") dispatch(fetchUsers());
        console.log("roles fetched");
    }, [usersStatus, dispatch])

    useEffect(() => {
    
        if (rolesStatus === "idle") dispatch(fetchRoles());
        console.log("roles fetched");
    }, [rolesStatus, dispatch])
    

    // query data from store: users + roles
    const users: userSchema[] = useSelector( selectAllUsers );
    console.log("users data received:")
    console.log(users)

    const roles: roleSchema[] = useSelector( selectAllRoles );
    console.log("roles data received:")
    console.log(roles)

    // the user object, selected in the drop-down list by name
    const [selectedUser, setSelectedUser] = useState<userSchema>(users[0] || {roles: []});      // void array when status = pending

    const [requestStatus, setRequestStatus] = useState<string>("idle")

    
    // query a role for modification
    const role: roleSchema = {rolename: "", description: ""};
    // else role = useSelector( (state) => selectRoleById(state, roleId as string) );

    // role >> copy as roleObject for the Roles form
    const {rolename, description} = role;
    const [roleObject, setRoleObject] = useState<roleSchema>({rolename, description});


    // -- BUTTON CALLBACKS for Roles form... >>>

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
            setRequestStatus("pending");
            const {rolename, description} = roleObject;
            const { _id } = role;
            if (!foundRole)  dispatch( addNewRole( {rolename, description} ) ).unwrap();
            else  dispatch( updateRole( {rolename, description, _id} ) ).unwrap();
            newRole();
            navigate("/users-roles");
        } catch (err) {
            console.error(`Failed to save new role: ${err}`);
        } finally {
            setRequestStatus("idle");
        }
    }

    // >>> BUTTON CALLBACKS for Roles form end


    // -- A function to handle roles: 1. add a role to a user / 2. delete a role of a user
    // It decides between the two based on the button caption (I could not manage to give callback parameter to createRoleTable...)

    const canModify: boolean = requestStatus === "idle";    // Add role + Del role buttons are active only after DB/store actions have finished

    const handleRole = (caption: string, roleName: string) => {
        if (canModify) {
            console.log(`${caption} - ${roleName} at ${selectedUser.username}`);
            if (!selectedUser) return;      // users data was not loaded yet

            let userRoles = selectedUser.roles as roleSchema[];
            let existingRole: roleSchema;
            switch (caption.split(" ")[0]) {
                case "Add":
                    existingRole = userRoles.find(role => role.rolename === roleName) as roleSchema;
                    if (!existingRole) {
                        userRoles = [...userRoles, roles.find(role => role.rolename === roleName) as roleSchema];
                    }
                    break;
                case "Delete":
                    console.log("delete")
                    if (roleName !== "Read") {
                        userRoles = userRoles.filter(role => role.rolename !== roleName) as roleSchema[];
                        console.log(userRoles)
                    }
            }

            if (selectedUser.roles?.length !== userRoles.length)
                try {
                    setRequestStatus("pending");
                    dispatch( updateUser( {...selectedUser, roles: userRoles} ) );
                    navigate("/users-roles");   // Redirect?
                } catch (err) {
                    console.error("Action failed")
                } finally {
                    setRequestStatus("idle");
                }
        }
    }

    // -- Role table creator function (for 2 forms: all roles / all roles of a user) >>>

    const createRoleTable = ( data: roleSchema[], buttonCaption: string ) => (
        data.length === 0 ? <h3>roles did not load in yet...</h3>
        :
        <table>
            <thead>
                <tr>
                    {Object.keys(data[0]).map(key => (
                        <th key={key}>{key.startsWith("__") ? null : key.startsWith("_") ? "" : key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Object.entries(data).map(([key, entry]) => (
                    <tr key={key}>
                        <td>
                            <button
                                onClick={() => handleRole(buttonCaption, entry.rolename)}
                                disabled={!canModify}>
                                {buttonCaption}
                            </button>
                        </td>
                        <td>{entry.rolename}</td>
                        <td>{entry.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

    // >>> Role table creator function end


    // -- CREATE USERS SECTION...


    console.log(`users request status = ${usersStatus}`);
    let usersRolesTable: JSX.Element = <></>;
    let usersOptions: JSX.Element = <></>;
    switch (usersStatus) {
        case "loading": usersRolesTable = <p>"loading users..."</p>; break;
        case "failed": usersRolesTable = <h2>*** {usersError} ***</h2>; break;
        case "fulfilled": 
            usersOptions = users.map((user: userSchema) => (
                <option key={user._id} value={user.username}>{user.username}</option>
                ));
            usersRolesTable = createRoleTable(selectedUser.roles as roleSchema[], "Delete role...");
    }

    const userSelected = (selectedUserName: string) => {
        console.log(users.find(user => user.username === selectedUserName));
        setSelectedUser( users.find(user => user.username === selectedUserName) as userSchema );
    }
    
    
    // -- CREATE ROLES SECTION...

    console.log(`roles request status = ${rolesStatus}`);
    let rolesTable: JSX.Element = <></>;
    switch (rolesStatus) {
        case "loading": rolesTable = <p>"loading roles..."</p>; break;
        case "failed": rolesTable = <h2>*** {rolesError} ***</h2>; break;
        case "fulfilled": rolesTable = createRoleTable(roles, "Add role...");
    }

    // -- return JSX: 2 forms (display + modify) --

    return (
        <article className="genForm">

            <section>
                <h1>Users</h1>

                <select name="userChooser" id="userChooser" onChange={(event) => userSelected(event.target.value)}>
                    {usersOptions}
                </select>

                {usersRolesTable}

                {usersError && <h3>Error! - {usersError}</h3>}
            </section>


            <section>
                <h1>Roles</h1>
                {rolesTable}

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
                            clazz="form"
                            error={rolesError}
                />
            </div>
        
        </article>
    )

}