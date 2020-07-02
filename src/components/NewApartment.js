import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';

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
  const [mainPictureUrl, setMainPictureUrl] = useState();
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState()

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    API.post('/apartments/', { ...apartment, mainPictureUrl })
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

  // const handleSubmit = (e) => {
  // e.preventDefault();
  // setLoading(true);
  // setErrorForm(false);
  // API.patch(`/apartments/${id}`, apartment)
  // .then(res => res.data)
  // .then(data => {
  //   setMessageForm(true);
  //   setLoading(false);
  //   setMsgAlert(`L'appartement ${data.name} a bien été mis à jour.`);
  // })
  // .catch(err =>{
  //   console.log(err);
  //   setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau !');
  //   setErrorForm(true);
  //   setLoading(false);
  //   setMessageForm(true);
  // })
  // }



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
            value={apartment.title_fr}
            onChange={(e) => setApartment({ ...apartment, title_fr: e.target.value })}
            name='title_fr'
          />
          <TextField
            className='input-contact'
            label='Intitulé (anglais)'
            variant='outlined'
            value={apartment.title_en}
            onChange={(e) => setApartment({ ...apartment, title_en: e.target.value })}
            name='title_en'
          />
          <TextField
            className='input-contact'
            label='Détails (français)'
            variant='outlined'
            value={apartment.details_fr}
            onChange={(e) => setApartment({ ...apartment, details_fr: e.target.value })}
            name='details_fr'
          />
          <TextField
            className='input-contact'
            label='Détails (anglais)'
            variant='outlined'
            value={apartment.details_en}
            onChange={(e) => setApartment({ ...apartment, details_en: e.target.value })}
            name='details_en'
          />
          <Button onClick={() => setOpenDialog(true)}>
            Add Image
          </Button>
          <DropzoneDialog
            open={openDialog}
            onSave={() => handleSave()}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews={true}
            maxFileSize={5000000}
            onClose={() => setOpenDialog(false)}
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

export default NewApartment;
