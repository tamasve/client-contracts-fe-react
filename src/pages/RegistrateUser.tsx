import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../data/store';
import { selectAllUsers, getUsersStatus, getUsersError, fetchUsers, addNewUser } from '../data/usersSlice';
import { selectAllRoles, selectRoleByName, fetchRoles } from '../data/rolesSlice';
import { userSchema, roleSchema } from "../data/schemas";
import InputForm from '../components/InputForm';


export default function RegistrateUser() {      // mapping: "users/user/userId" - userId = taxnumber
    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const usersStatus: string = useSelector(getUsersStatus);
    const usersError: string = useSelector( getUsersError );
    
    
    // data refresh with Redux
    useEffect(() => {
        
        if (usersStatus === "idle") dispatch(fetchUsers());
        console.log("users fetched");
        dispatch(fetchRoles());
        console.log("roles fetched");
    }, [usersStatus, dispatch])
    
    const users: userSchema[] = useSelector( selectAllUsers );
    console.log("users data received:")
    console.log(users)
    const roles: roleSchema[] = useSelector( selectAllRoles );
    console.log("roles:")
    console.log(roles)
    const basicRole: roleSchema = useSelector( (state) => selectRoleByName(state, "Read") );
    console.log("basic role:")
    console.log(basicRole)
    // const basicRole = roles.find( role => role.rolename === "Read" ) as roleSchema;


    const [, setAddRequestStatus] = useState<string>("idle")

    
    // query a user for modification
    const user: userSchema = {username: "", password: "", email: ""};
    // else user = useSelector( (state) => selectUserById(state, userId as string) );

    // user >> copy as userObject for the Form
    const {username, password, email} = user;
    const [userObject, setUserObject] = useState<userSchema>({username, password, email});



    // Save: get user data from userObject, _id from user - and save it in MongoDB through Redux store
    const saveUser = () => {
        console.log("save user...")
        const foundUser = users.find( (user) => user.username === userObject.username );  // is it new or modified?
        if (!foundUser) console.log("new user");
            else console.log("existing user");
        try {
            setAddRequestStatus("pending");
            const {username, password, email} = userObject;
            // const { _id } = user;
            if (!foundUser)  dispatch( addNewUser( {username, password, email, roles: [basicRole]} ) ).unwrap();
            // if (!foundUser)  dispatch( addNewUser( {username, password, email, roles: {[basicRole.rolename]: basicRole.description}} ) ).unwrap();
            // else  dispatch( updateUser( {username, password, email, _id} ) ).unwrap();
            navigate("/clients");
        } catch (err) {
            console.error(`Failed to save new user: ${err}`);
        } finally {
            setAddRequestStatus("idle");
        }
    }
    

    // -- return JSX: registration form --

    return (
        <article className="genForm">
 
            <div>

                <InputForm 
                    data={userObject}
                    setData={setUserObject}
                    dataHandler={saveUser}
                    title={"Please, registrate yourself..."} 
                    buttonCaption={"Registrate"}
                    clazz="form"
                    error={usersStatus === "failed" ? usersError : ""}
                />

            </div>
        
        </article>
    )

}