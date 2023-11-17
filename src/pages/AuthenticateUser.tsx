import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authenticateUser, clearAuth, getAuthStatus, getAuthError, getUserName, getAccessToken } from '../data/authSlice';
import { userSchema } from "../data/schemas";
import InputForm from '../components/InputForm';
import axios from 'axios';
import * as URLS from '../data/urls';


export default function AuthenticateUser() {      // mapping: "users/user/userId" - userId = taxnumber
    
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [userObject, setUserObject] = useState<Partial<userSchema>>({username: "", password: ""});

    const authStatus = useSelector(getAuthStatus);
    const authError = useSelector(getAuthError);
    const userName = useSelector(getUserName);
    const accessToken = useSelector(getAccessToken);
    console.log(userName);
    console.log(accessToken);

    
    useEffect( () => {

        console.log("useEffect does nothing but re-renders");

    }, [authError, authStatus, userName]);

    const logout = async () => {
        dispatch( clearAuth() ).unwrap();
    }

    const loginUser = async () => {

        console.log("login user...")
        try {
            dispatch( authenticateUser({"UserAuth": {...userObject}}) ).unwrap();
            console.log("user authentication")
            // console.log(response.data);     // as a response we await the access token

            // navigate("/home");
        } catch (err) {
            console.error(`Failed to autheticate the user: ${err}`);
        }
    }
    

    // -- return JSX: registration form --

    return (
        <article className="genForm">
 
            <div>

                <InputForm 
                    data={userObject}
                    setData={setUserObject}
                    dataHandler={loginUser}
                    title={"Please, login..."}
                    buttonCaption={"Login"}
                    clazz="form"
                    error={authStatus === "failed" ? authError : ""}
                />

                <button onClick={logout}>Logout</button>

            </div>

        
        </article>
    )

}