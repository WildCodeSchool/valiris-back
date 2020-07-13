import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import API from '../API';
import '../styles/Contact.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import '../styles/booking.css';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Booking = (props) => {

  const id = props.match.params.id;
  const [booking, setBooking] = useState()
  const [contacts, setContacts] = useState();
  const [apartments, setApartments] = useState()
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/apartments')
      .then(res => res.data)
      .then(data => setApartments(data.map(apartment => {
        return { name: apartment.name, id: apartment.id };
      })));
    API.get('/contacts')
      .then(res => res.data)
      .then(data => setContacts(data.map(contact => {
        return { name: `${contact.firstname} ${contact.lastname}`, id: contact.id };
      })));
    API.get(`/bookings/${id}`)
      .then(res => res.data)
      .then(data => setBooking(data));
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
    API.patch(`/bookings/${id}`, booking)
      .then(() => {
        setMessageForm(true);
        setLoading(false);
        setMsgAlert(`La réservation a bien été mise à jour`);
      })
      .catch(err => {
        console.error(err);
        setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
        setErrorForm(true);
        setLoading(false);
        setMessageForm(true);
      })
  }

  const getFullDate = () => {
    const day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const year = new Date().getFullYear();
    const fullDate = `${year}-${month}-${day}`;
    return fullDate;
  };


  if (!contacts || !apartments || !booking) {
    return <p>loading...</p>
  } else {
    return (
      <div >
        <form className='Updatebooking-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            className='date-input'
            label='début'
            type='date'
            variant='outlined'
            name='starting_date'
            value={booking.starting_date}
            onChange={(e) => setBooking({ ...booking, starting_date: e.target.value })}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              inputProps: { min: getFullDate() }
            }}
          />
          <TextField
            className='date-input'
            label='fin'
            type='date'
            variant='outlined'
            name='ending_date'
            value={booking.ending_date}
            onChange={(e) => setBooking({ ...booking, ending_date: e.target.value })}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              inputProps: booking.starting_date
                ? { min: booking.starting_date }
                : { min: getFullDate() }
            }}
          />
          <FormControl variant='outlined' className={`input-booking`}>
            <InputLabel htmlFor='outlined-age-native-simple'>Appartement</InputLabel>
            <Select
              native
              value={booking.id_apartment}
              onChange={(e) => setBooking({ ...booking, id_apartment: e.target.value })}
              name='apartment'
              label='appartement'
              inputProps={{
                id: 'outlined-age-native-simple'
              }}
            >
              <option value='' />
              {apartments.map((apartment, index) => {
                return <option key={index} value={apartment.id}>{apartment.name}</option>;
              })}
            </Select>
          </FormControl>
          <FormControl variant='outlined' className={`input-booking`}>
            <InputLabel htmlFor='outlined-age-native-simple'>Contact</InputLabel>
            <Select
              native
              value={booking.id_contact}
              onChange={(e) => setBooking({ ...booking, id_contact: e.target.value })}
              name='contact'
              label='Contact'
              inputProps={{
                id: 'outlined-age-native-simple'
              }}
            >
              <option value='' />
              {contacts.map((contact, index) => {
                return <option key={index} value={contact.id}>{contact.name}</option>;
              })}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={booking.validation}
                onChange={(e) => setBooking({ ...booking, validation: e.target.checked ? 1 : 0 })}
                name="checkedB"
                color="primary"
              />
            }
            label="Validée"
          />
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" color="primary" type='submit'>valider</Button>}
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
