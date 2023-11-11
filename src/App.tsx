/**
 * THE FRONT-END PART OF MY 1st main JS full-stack project
 * 26-27, 29 Oct, 2, 6-10 Nov 2023
 * Last mod.: 10 Nov 2023
 */

import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './data/store'
// import { fetchClients } from './clientsSlice'

import Clients from './pages/Clients'
import Contracts from './pages/Contracts'
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import Client from './pages/Client'
import Role from './pages/Role'


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
            <Route path="contracts" element={<Contracts />} />
            <Route path="role" element={<Role />} />
          </Routes>
          <Footer />
        </Router>
      </Provider>
    </>
  )
}

export default App
