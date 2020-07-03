import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const Contact = () => {

  const [contact, setContact] = useState({
    firstname : '',
    lastname : '',
    phone : '',
    email : ''
  });
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);



  function Alert (props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const handleCloseMui = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    API.post(`/contacts/new`, contact)
    .then(res => res.data)
    .then(data => {
      setMessageForm(true);
      setLoading(false);
      setMsgAlert(`Le contact ${data.firstname} ${data.lastname} à bien été créer`);
    })
    .catch(err => {
      console.log(err);
      setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
      setErrorForm(true);
      setLoading(false);
      setMessageForm(true);
    })
  }


  if(!contact){
    return <p>loading...</p>
  } else {
    return (
      <div >
        <form className='contact-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            className='input-contact'
            label='prénom'
            variant='outlined'
            value={contact.firstname}
            onChange={(e) => setContact({...contact, firstname : e.target.value})}
            name='firstname'
          />
          <TextField
            className='input-contact'
            label='nom'
            variant='outlined'
            value={contact.lastname}
            onChange={(e) => setContact({...contact, lastname : e.target.value})}
            name='lastname'
          />
          <TextField
            className='input-contact'
            label='téléphone'
            variant='outlined'
            value={contact.phone}
            onChange={(e) => setContact({...contact, phone : e.target.value})}
            name='phone'
          />
          <TextField
            className='input-contact'
            label='email'
            variant='outlined'
            value={contact.email}
            onChange={(e) => setContact({...contact, email : e.target.value})}
            name='email'
          />
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <input className='contact-valid-button' type='submit' value='valider' />}
          <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
            <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
              {msgAlert}
            </Alert>
          </Snackbar>
        </form>
      </div>
    )
  }
}

export default Contact;
