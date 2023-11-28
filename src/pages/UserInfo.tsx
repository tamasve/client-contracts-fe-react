import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../data/store';
import { authenticateUser, clearAuth, getAuthStatus, getAuthError, getUserName, getAccessToken } from '../data/authSlice';
import { userSchema } from "../data/schemas";
import InputForm from '../components/InputForm';


export default function UserInfo() {      // mapping: "users/user/userId" - userId = taxnumber
    
    // const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    // const [userObject, setUserObject] = useState<Partial<userSchema>>({username: "", password: ""});

    const authStatus = useSelector(getAuthStatus);
    const authError = useSelector(getAuthError);
    let userName: string = useSelector(getUserName);
    // const accessToken = useSelector(getAccessToken);
    console.log(userName);
    // console.log(accessToken);

    
    useEffect( () => {

        console.log("useEffect does nothing but re-renders");

    }, [authError, authStatus, userName]);

    const logout = async () => {
        dispatch( clearAuth() ).unwrap();
    }

    // const loginUser = async () => {

    //     console.log("login user...")
    //     try {
    //         dispatch( authenticateUser({...userObject}) ).unwrap();
    //         console.log("user authentication")
    //         // console.log(response.data);     // as a response we await the access token

    //         // navigate("/home");
    //     } catch (err) {
    //         console.error(`Failed to autheticate the user: ${err}`);
    //     }
    // }
    

    // -- return JSX: a label with the username and a logout button --

    return (
        < >
 
            {/* <div> */}

                {/* <InputForm 
                    data={userObject}
                    setData={setUserObject}
                    dataHandler={loginUser}
                    title={"Please, login..."}
                    buttonCaption={"Login"}
                    clazz="form"
                    error={authStatus === "failed" ? authError : ""}
                /> */}

                <label htmlFor="name">{userName}</label>

                <button onClick={logout}>Logout</button>

            {/* </div> */}

        
        </>
    )

}