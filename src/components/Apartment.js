import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

const Apartment = (props) => {
  const id = props.match.params.id;
  const [apartment, setApartment] = useState();
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/apartments/${id}/back`)
      .then(res => res.data)
      .then(data => setApartment({
        id: data.id,
        name: data.name,
        details_fr: data.details_fr,
        details_en: data.details_en,
        title_fr: data.title_fr,
        title_en: data.title_en,
        weekPrice: data.week_price,
        monthPrice: data.month_price,
        mainPictureUrl: data.mainPictureUrl,
        url: data.tabUrl
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
    API.patch(`/apartments/${id}`, apartment)
    .then(res => res.data)
    .then(data => {
      setMessageForm(true);
      setLoading(false);
      setMsgAlert(`L'appartement ${data.name} a bien été mis à jour.`);
    })
    .catch(err =>{
      console.log(err);
      setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau !');
      setErrorForm(true);
      setLoading(false);
      setMessageForm(true);
    })
  }


  if(!apartment){
    return <p>loading...</p>
  } else {
    return (
      <div >
        <form className='contact-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            className='input-contact'
            label='Nom'
            variant='outlined'
            value={apartment.name}
            onChange={(e) => setApartment({...apartment, name : e.target.value})}
            name='name'
          />
          <TextField
            className='input-contact'
            label='Prix à la semaine'
            variant='outlined'
            value={apartment.weekPrice}
            onChange={(e) => setApartment({...apartment, weekPrice : e.target.value})}
            name='weekPrice'
          />
          <TextField
            className='input-contact'
            label='Prix au mois'
            variant='outlined'
            value={apartment.monthPrice}
            onChange={(e) => setApartment({...apartment, monthPrice : e.target.value})}
            name='monthPrice'
          />
          <TextField
            className='input-contact'
            label='Intitulé (français)'
            variant='outlined'
            multiline
            rows={4}
            value={apartment.title_fr}
            onChange={(e) => setApartment({...apartment, title_fr : e.target.value})}
            name='title_fr'
          />
          <TextField
            className='input-contact'
            label='Intitulé (anglais)'
            variant='outlined'
            multiline
            rows={4}
            value={apartment.title_en}
            onChange={(e) => setApartment({...apartment, title_en : e.target.value})}
            name='title_en'
          />
          <TextField
            className='input-contact'
            label='Détails (français)'
            variant='outlined'
            multiline
            rows={12}
            value={apartment.details_fr}
            onChange={(e) => setApartment({...apartment, details_fr : e.target.value})}
            name='details_fr'
          />
          <TextField
            className='input-contact'
            label='Détails (anglais)'
            variant='outlined'
            multiline
            rows={12}
            value={apartment.details_en}
            onChange={(e) => setApartment({...apartment, details_en : e.target.value})}
            name='details_en'
          />
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <input className='contact-valid-button' type='submit' value='valider' />}
          <Link to={`/appartements`}>Retour</Link>
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

export default Apartment;
