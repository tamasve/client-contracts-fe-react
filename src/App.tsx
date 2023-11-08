/**
 * THE FRONT-END PART OF MY 1st main JS full-stack project
 * 26-27, 29 Oct, 2, 6-8 Nov 2023
 * Last mod.: 8 Nov 2023
 */

import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
// import { fetchClients } from './clientsSlice'

import Clients from './Clients'
import Contracts from './Contracts'
import Header from './Header'
import Home from './Home'
import Footer from './Footer'
import Client from './Client'


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
          </Routes>
          <Footer />
        </Router>
      </Provider>
    </>
  )
}

export default App
