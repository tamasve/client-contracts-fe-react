import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../data/store';
import { authenticateUser, clearAuth, getAuthStatus, getAuthError, getUserName, getAccessToken } from '../data/authSlice';
import { userSchema } from "../data/schemas";
import InputForm from '../components/InputForm';


export default function AuthenticateUser() {      // mapping: "users/user/userId" - userId = taxnumber
    
    const navigate = useNavigate();
    const location = useLocation();     // it brings the previous URL in its 'state' prop (see the invoking components)

    const dispatch = useDispatch<AppDispatch>();

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


    const loginUser = () => {
        (async () => {

        console.log("login user...")
        try {
            dispatch( authenticateUser({...userObject}) ).unwrap();
            console.log("user authentication")
            if (location.state?.prevUrl) navigate(location.state.prevUrl);
        } catch (err) {
            console.error(`Failed to autheticate the user: ${err}`);
        }
        })();
        
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
                    error={authStatus === "failed" ? "Authentication failed" : ""}
                />

            </div>

        
        </article>
    )

}