import React, { useEffect, useState, useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import '../styles/Calendar.css';
import API from '../API';
import UserInfoContext from '../userInfoContext'

const NewBooking = () => {

  const [booking, setBooking] = useState({
    starting_date: '',
    ending_date: '',
    id_apartment: '',
    id_contact: ''
  });
  const [apartments, setApartments] = useState()
  const [contacts, setContacts] = useState()
  const { messageForm, setMessageForm, msgAlert, setMsgAlert, errorForm, setErrorForm, loading, setLoading } = useContext(UserInfoContext)

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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    API.post(`/bookings`, booking)
      .then(res => res.data)
      .then(() => {
        setMessageForm(true);
        setLoading(false);
        setMsgAlert(`La résèrvation à bien été créer`);
        setBooking({
          starting_date: '',
          ending_date: '',
          id_apartment: '',
          id_contact: ''
        })
      })
      .catch(err => {
        console.log(err);
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

  if(!apartments || !contacts){
    return <CircularProgress style={{ width: '50px', height: '50px' }} />
  }
  return (
    <>
      <h2>Nouvelle réservation</h2>
      <form className='booking-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
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
        <FormControl variant='outlined' className={`input-contact`}>
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
        <FormControl variant='outlined' className={`input-contact`}>
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
        {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" color="primary" type='submit'>valider</Button>}
      </form>
    </>
  )
}

export default NewBooking