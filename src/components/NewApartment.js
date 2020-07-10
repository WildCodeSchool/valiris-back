import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const NewApartment = (props) => {

  const [apartment, setApartment] = useState({
    name: '',
    details_fr: '',
    details_en: '',
    title_fr: '',
    title_en: '',
    weekPrice: '',
    monthPrice: ''
  });
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainPicture, setMainPicture] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    const formData = new FormData();
    formData.append('name', apartment.name);
    formData.append('details_fr', apartment.details_fr);
    formData.append('details_en', apartment.details_en);
    formData.append('title_fr', apartment.title_fr);
    formData.append('title_en', apartment.title_en);
    formData.append('week_price', apartment.weekPrice);
    formData.append('month_price', apartment.monthPrice);
    formData.append('main_picture_url', mainPicture);
    API.post('/apartments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    })
      .then(res => res.data)
      .then(data => {
        setMessageForm(true);
        setLoading(false);
        setMsgAlert(`L'appartement ${data.name} a bien été créé`);
      })
      .catch(err => {
        console.log(err);
        setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
        setErrorForm(true);
        setLoading(false);
        setMessageForm(true);
      })
  }

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
    <div >
      <form className='contact-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
        <TextField
          className='input-contact'
          label='Nom'
          variant='outlined'
          value={apartment.name}
          onChange={(e) => setApartment({ ...apartment, name: e.target.value })}
          name='name'
        />
        <TextField
          className='input-contact'
          label='Prix à la semaine'
          variant='outlined'
          value={apartment.weekPrice}
          onChange={(e) => setApartment({ ...apartment, weekPrice: e.target.value })}
          name='weekPrice'
        />
        <TextField
          className='input-contact'
          label='Prix au mois'
          variant='outlined'
          value={apartment.monthPrice}
          onChange={(e) => setApartment({ ...apartment, monthPrice: e.target.value })}
          name='monthPrice'
        />
        <TextField
          className='input-contact'
          label='Intitulé (français)'
          variant='outlined'
          multiline
          rows={4}
          value={apartment.title_fr}
          onChange={(e) => setApartment({ ...apartment, title_fr: e.target.value })}
          name='title_fr'
        />
        <TextField
          className='input-contact'
          label='Intitulé (anglais)'
          variant='outlined'
          multiline
          rows={4}
          value={apartment.title_en}
          onChange={(e) => setApartment({ ...apartment, title_en: e.target.value })}
          name='title_en'
        />
        <TextField
          className='input-contact'
          label='Détails (français)'
          variant='outlined'
          multiline
          rows={12}
          value={apartment.details_fr}
          onChange={(e) => setApartment({ ...apartment, details_fr: e.target.value })}
          name='details_fr'
        />
        <TextField
          className='input-contact'
          label='Détails (anglais)'
          variant='outlined'
          multiline
          rows={12}
          value={apartment.details_en}
          onChange={(e) => setApartment({ ...apartment, details_en: e.target.value })}
          name='details_en'
        />
        <input type="file" onChange={e => setMainPicture(e.target.files[0])} />
        {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <input className='contact-valid-button' type='submit' value='valider' />}
      </form>
      <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
        <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
          {msgAlert}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default NewApartment;
