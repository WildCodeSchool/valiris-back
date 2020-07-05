import React, { useState, useEffect } from 'react';
import API from '../API';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import '../styles/Calendar.css';
import NewBooking from './NewBooking';
import UserInfoContext from '../userInfoContext'
import CalendarComponent from './CalendarComponent'


const Calendar = () => {

  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const handleCloseMui = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageForm(false);
  };

  return (
    <UserInfoContext.Provider value={{ messageForm, setMessageForm, msgAlert, setMsgAlert, errorForm, setErrorForm, loading, setLoading }}>
      <NewBooking />
      <CalendarComponent />
      <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
        <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
          {msgAlert}
        </Alert>
      </Snackbar>
    </UserInfoContext.Provider>
  )
}

export default Calendar
