import React, { useState, useEffect, useContext } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/account.css'
import '../styles/form.css'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthContext from '../authContext';
import Button from '@material-ui/core/Button';

const Account = () => {

  const { id, setName } = useContext(AuthContext);
  const [user, setUser] = useState();
  const [password, setPassword] = useState('');
  const [passwordVerif, setPasswordVerif] = useState('');
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(res => res.data)
      .then(data => {
        setUser({
          email: data.email,
          name: data.name
        })
      });
  }, [id]);

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
    API.patch(`/users/${id}`, user)
      .then(res => res.data)
      .then(data => {
        setMessageForm(true);
        setLoading(false);
        setName(data.name)
        setMsgAlert(`L'utilisateur a bien été mis à jour`);
      })
      .catch(err => {
        console.log(err);
        setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
        setErrorForm(true);
        setLoading(false);
        setMessageForm(true);
      })
  }

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    if (password === passwordVerif) {
      API.patch(`/users/${id}/password`, { password })
        .then(res => res.data)
        .then(data => {
          setMessageForm(true);
          setLoading(false);
          setMsgAlert(`L'utilisateur a bien été mis à jour`);
          setPassword('')
          setPasswordVerif('')
        })
        .catch(err => {
          console.log(err);
          setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
          setErrorForm(true);
          setLoading(false);
          setMessageForm(true);
        })
    } else {
      setMsgAlert('Les mots de passe ne correspondent pas');
      setLoading(false);
      setMessageForm(true);
      setErrorForm(true);
    }
  }

  if (!user) {
    return <div className='loader'><CircularProgress style={{ width: '70px', height: '70px' }} /></div>
  } else {
    return (
      <div className='account-container'>
        <form className='form-container' noValidate onSubmit={(e) => handleSubmit(e)}>
          <h2>Modifier mes Informations</h2>
          <TextField
            className='input-form'
            label='Nom'
            variant='outlined'
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            name='name'
          />
          <TextField
            className='input-form'
            label='E-mail'
            variant='outlined'
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            name='email'
          />
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" color="primary" type='submit'>valider</Button>}
        </form>
        <form className='form-container' id='form-password' onSubmit={(e) => handleSubmitPassword(e)}>
          <h2>Changer mon mot de passe</h2>
          <TextField
            variant="outlined"
            required
            className='input-form'
            name="password"
            label="Nouveau mot de passe"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            required
            className='input-form'
            name="passwordVerif"
            label="Confirmer mot de passe"
            type="password"
            id="passwordVerif"
            autoComplete="new-password"
            value={passwordVerif}
            onChange={(e) => setPasswordVerif(e.target.value)}
          />
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" color="primary" type='submit'>valider</Button>}
        </form>
        <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
          <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
            {msgAlert}
          </Alert>
        </Snackbar>
      </div>
    )
  }
}

export default Account;