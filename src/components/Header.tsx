import {Link} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authenticateUser, clearAuth, getAuthStatus, getAuthError, getUserName, getAccessToken } from '../data/authSlice';
import UserInfo from "../pages/UserInfo";

export default function Header() {

    const userName = useSelector(getUserName);

    useEffect( () => {

        console.log("useEffect does nothing but re-renders");

    }, [userName]);

    return (
        <header className="header">
            <Link to="/">Home</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/contracts">Contracts</Link>
            <Link to="/users-roles">Users-Roles</Link>
            <Link to="/registrate">Registration</Link>
            {userName ? <UserInfo /> : <Link to="/authenticate">Login</Link>}
        </header>
    )

}