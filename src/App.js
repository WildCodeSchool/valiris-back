import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import AuthContext from './authContext';
import jwtDecode from 'jwt-decode';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Contacts from './components/Contacts';
import Contact from './components/Contact.js';
import NewContact from './components/NewContact';
import Home from './components/Home';
import Apartments from './components/Apartments';
import Apartment from './components/Apartment';
import NewApartment from './components/NewApartment';
import Calendar from './components/Calendar';
import BookingsPage from './components/BookingsPage';
import Booking from './components/Booking';
import Account from './components/Account';

function App () {
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [id, setId] = useState(localStorage.getItem('id'))
  const setTokenInLocalStorage = (token) => {
    localStorage.setItem('authToken', token)
    setToken(token)
  }
  const setIdInLocalStorage = (id) => {
    localStorage.setItem('id', id)
    setId(id)
  }
  let userNameFromToken = null
  if (token) {
    userNameFromToken = jwtDecode(token).name || null
  }

  return (
    <AuthContext.Provider value={{token, setToken: setTokenInLocalStorage, id, setId: setIdInLocalStorage}}>
      <Router>
        <div className="App">
        {!!token  && <Navbar />}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/register">
              <Register />
            </PrivateRoute>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
            <PrivateRoute exact path="/contacts">
              <Contacts />
            </PrivateRoute>
            <PrivateRoute path="/contacts/:id" component={(props) => <Contact {...props}/>} />
            <PrivateRoute exact path="/nouveau-contact">
              <NewContact />
            </PrivateRoute>
            <PrivateRoute exact path="/appartements">
              <Apartments />
            </PrivateRoute>
            <PrivateRoute exact path="/appartement/:id" component={(props) => <Apartment {...props}/>} />
            <PrivateRoute exact path="/nouvel-appartement">
              <NewApartment />
            </PrivateRoute>
            <PrivateRoute exact path="/calendrier">
              <Calendar />
            </PrivateRoute>
            <PrivateRoute exact path="/reservations">
              <BookingsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/reservation/:id" component={(props) => <Booking {...props}/>} />
            <PrivateRoute exact path="/mon-compte">
              <Account /> 
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;