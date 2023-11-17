import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userSchema } from "../data/schemas";
import InputForm from '../components/InputForm';
import axios from 'axios';
import * as URLS from '../data/urls';


export default function AuthenticateUser() {      // mapping: "users/user/userId" - userId = taxnumber
    
    const navigate = useNavigate();

    const [userObject, setUserObject] = useState<Partial<userSchema>>({username: "", password: ""});


    const loginUser = async () => {

        console.log("login user...")
        try {
            const response = await axios.post(URLS.REQUEST_URL + URLS.AUTH, {"UserAuth": {...userObject}} );
            console.log("user authentication")
            console.log(response.data);     // as a response we await the access token

            navigate("/home");
        } catch (err) {
            console.error(`Failed to autheticate the user: ${err}`);
        }
    }
    

    // -- return JSX: registration form --

    return (
        <article className="genForm">
 
            <div>

                <InputForm data={userObject}
                            setData={setUserObject}
                            dataHandler={loginUser}
                            title={"Please, login..."}
                            buttonCaption={"Login"}
                            clazz="form" />

            </div>
        
        </article>
    )

}