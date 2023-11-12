import {Link} from "react-router-dom"

export default function Header() {

    return (
        <header className="header">
            <Link to="/">Home</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/contracts">Contracts</Link>
            <Link to="/role">Role</Link>
            <Link to="/registrate">Registration</Link>
        </header>
    )

}