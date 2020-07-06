import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

const Booking = (props) => {
  const id = props.match.params.id;
  const [booking, setBooking] = useState();
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    API.get(`/bookings/${id}`)
      .then(res => res.data)
      .then(data => setBooking({
        id_apartment: data.id_apartment,
        starting_date: data.starting_date,
        ending_date: data.ending_date
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
    API.patch(`/bookings/${id}`, booking)
    .then(res => res.data)
    .then(data => {
      setMessageForm(true);
      setLoading(false);
      setMsgAlert(`La réservation ${data.id} a bien été mis à jour.`);
    })
    .catch(err =>{
      console.log(err);
      setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau !');
      setErrorForm(true);
      setLoading(false);
      setMessageForm(true);
    })
  }

  const getFullDate = (date) => {
    let day = date.slice(0, 10).split('').splice(8, 9).join('')
    let month = date.slice(0, 10).split('').slice(5, 7).join('');
    let year = date.slice(0, 10).split('').slice(0, 4).join('');
    const fullDate = `${year}-${month}-${day}`;
    return fullDate;
  };


  if(!booking){
    return <p>loading...</p>
  } else {
    return (
      <div >
        <form className='contact-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            className='input-contact'
            label='Appartement'
            variant='outlined'
            value={booking.id_apartment}
            onChange={(e) => setBooking({...booking, id_apartment : e.target.value})}
            name='id'
          />
          <TextField
            label="Date de début"
            type="date"
            value={getFullDate(booking.starting_date)}
            onChange={(e) => setBooking({...booking, starting_date : e.target.value})}
            className={classes.textField}
            InputLabelProps={{
            shrink: true,
            }}
            name='starting_date'
          />
          <TextField
            label="Date de fin"
            type="date"
            value={getFullDate(booking.ending_date)}
            onChange={(e) => setBooking({...booking, ending_date : e.target.value})}
            className={classes.textField}
            InputLabelProps={{
            shrink: true,
            }}
            name='ending_date'
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

export default Booking;