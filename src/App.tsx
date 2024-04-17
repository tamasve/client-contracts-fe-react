/**
 * THE FRONT-END PART OF MY 1st main JS full-stack project
 * Nov 2023
 * Last mod.: 26 Nov 2023
 * 
 * Special solution: JWT authentication FE part with a(n auth.) slice of Redux (not by using i.g. unique useToken and useUser hooks in the components)
 * 
 */

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './data/store'
// import { fetchClients } from './clientsSlice'

import Clients from './pages/Clients'
import Contracts from './pages/Contracts'
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import Client from './pages/Client'
import UsersRoles from './pages/Users-Roles'
import RegistrateUser from './pages/RegistrateUser'
import AuthenticateUser from './pages/AuthenticateUser'
import Contract from './pages/Contract'
import UserInfo from './pages/UserInfo'


function App() {

    // store.dispatch(fetchClients());   // load clients at the very start of the app

    return (
        <>
            <Provider store={store}>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="clients" >
                            <Route index element={<Clients />} />
                            <Route path="client/:clientId" element={<Client />} />
                        </Route>
                        <Route path="contracts" >
                            <Route index element={<Contracts />} />
                            <Route path="contract/:contractId" element={<Contract />} />
                        </Route>
                        <Route path="users-roles" element={<UsersRoles />} />
                        <Route path="registrate" element={<RegistrateUser />} />
                        <Route path="authenticate" element={<AuthenticateUser />} />
                        <Route path="userinfo" element={<UserInfo />} />
                    </Routes>
                    <Footer />
                </Router>
            </Provider>
        </>
    )
}

export default App
