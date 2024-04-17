import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserName } from '../data/authSlice';
import UserInfo from "../pages/UserInfo";

export default function Header() {

    let userName: string = useSelector(getUserName);
    
    useEffect( () => {
        
        userName = localStorage.getItem("user") || "";
        console.log("useEffect does nothing but re-renders");

    }, [userName]);

    return (
        <header className="header">
            <Link to="/">Home</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/contracts">Contracts</Link>
            <Link to="/users-roles">Users-Roles</Link>
            <Link to="/registrate">Registration</Link>
            {userName !== "" ? <UserInfo /> : <Link to="/authenticate">Login</Link>}
        </header>
    )

}