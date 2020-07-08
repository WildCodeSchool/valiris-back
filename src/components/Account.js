import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const Account = (props) => {
  const id = props.match.params.id;
  const [user, setUser] = useState();
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(res => res.data)
      .then(data => setContact({
        name : data.name,
        email : data.email,
        password : data.password,
      }));
  }, [id]);

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
    API.patch(`/users/${id}`, user)
    .then(res => res.data)
    .then(data => {
      setMessageForm(true);
      setLoading(false);
      setMsgAlert(`Le contact ${data.firstname} ${data.lastname} à bien été mise à jour`);
    })
    .catch(err =>{
      console.log(err);
      setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
      setErrorForm(true);
      setLoading(false);
      setMessageForm(true);
    })
  }


  if(!contact){
    return <div className='loader'><CircularProgress style={{ width: '70px', height: '70px' }} /></div>
  } else {
    return (
      <div >
        <form className='contact-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            className='input-contact'
            label='Nom'
            variant='outlined'
            value={contact.name}
            onChange={(e) => setUser({...user, name : e.target.value})}
            name='name'
          />
          <TextField
            className='input-contact'
            label='E-mail'
            variant='outlined'
            value={contact.email}
            onChange={(e) => setContact({...user, email : e.target.value})}
            name='email'
          />
          <TextField
            className='input-contact'
            label='Mot de passe'
            type="password"
            variant='outlined'
            value={contact.phone}
            onChange={(e) => setContact({...user, password : e.target.value})}
            name='password'
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