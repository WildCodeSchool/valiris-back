import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import API from '../API';
import '../styles/form.css'
import '../styles/contacts.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const Contact = () => {

  const [contact, setContact] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: ''
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    const emailValidator = /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}/;
    const phoneValidator = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/; /* eslint-disable-line */
    if (!contact.firstname || !contact.lastname || !contact.phone || !contact.email) {
      setMsgAlert('Merci de renseigner tous les champs');
      setErrorForm(true);
      setLoading(false);
      setMessageForm(true);
    } else if (!phoneValidator.test(contact.phone) || !emailValidator.test(contact.email)) {
      setMsgAlert('Un des champs est incorrect');
      setErrorForm(true);
      setLoading(false);
      setMessageForm(true);
    } else {
      API.post(`/contacts/new`, contact)
        .then(res => res.data)
        .then(data => {
          setContact({
            firstname: '',
            lastname: '',
            phone: '',
            email: ''
          })
          setMessageForm(true);
          setLoading(false);
          setMsgAlert(`Le contact ${data.firstname} ${data.lastname} a bien été créé`);
        })
        .catch(err => {
          console.log(err);
          setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
          setErrorForm(true);
          setLoading(false);
          setMessageForm(true);
        })
    }
  }

  return (
    <div >
      <h2>Ajouter un nouveau contact</h2>
      <form className='form-container' autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
        <TextField
          className='input-form'
          label='Prénom'
          variant='outlined'
          required
          value={contact.firstname}
          onChange={(e) => setContact({ ...contact, firstname: e.target.value })}
          name='firstname'
        />
        <TextField
          className='input-form'
          label='Nom'
          variant='outlined'
          required
          value={contact.lastname}
          onChange={(e) => setContact({ ...contact, lastname: e.target.value })}
          name='lastname'
        />
        <TextField
          className='input-form'
          label='Téléphone'
          variant='outlined'
          required
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          name='phone'
        />
        <TextField
          className='input-form'
          label='Email'
          variant='outlined'
          value={contact.email}
          required
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          name='email'
        />
        <div className='submit-back'>
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" color="primary" type='submit'>Valider</Button>}
          <Button className='back-button' variant="contained">
            <Link to={`/contacts`}>RETOUR</Link>
          </Button>
        </div>
      <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
        <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
          {msgAlert}
        </Alert>
      </Snackbar>
      </form>
    </div >
  )
}

export default Contact;
