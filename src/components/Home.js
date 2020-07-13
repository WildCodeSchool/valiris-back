import React, { useState, useEffect } from 'react';
import BookingCard from './BookingCard';
import API from '../API';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import '../styles/home.css';

const Home = () => {
    const [bookings, setBookings] = useState();
    const [validation, setValidation] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [msgValidation, setMsgValidation] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        API.get('/bookings')
          .then(res => res.data)
          .then(data => setBookings(data.map(b => {
              return { 
                id_booking: b.id,
                firstname: b.firstname,
                lastname: b.lastname,
                email: b.email,
                phone: b.phone,
                starting_date: b.starting_date,
                ending_date: b.ending_date,
                message: b.content,
                validation: b.validation
            }
          })))
      }, []);

    const handlePatch = (id) => {
      console.log(id);
      API.patch('/bookings', { id })
        .then(response => response.data)
      setBookings(bookings.filter(b => b.id_booking !== id));
      setValidation(true);
      setIsValidated(true);
      setMsgValidation('Votre demande de réservation a bien été accepté et apparaîtra sur votre calendrier de réservation.');
    }

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    

    const handleClickDelete = (id) => {
      handleClose();
      console.log('Ready to delete')
      API.delete(`/bookings/${id}`)
        .then(res => res.data)
      setBookings(bookings.filter(b => b.id_booking !== id));
    }

    const handleCloseMui = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setValidation(false);
    };

    function Alert (props) {
      return <MuiAlert elevation={6} variant='filled' {...props} />;
    }

    if (!bookings) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress style={{ width: '50px', height: '50px', margin: '0 auto' }}/></div>;
    } else {
    return (
        <div className='home-container'>
            <h2 className='home-title'>Vos dernières demandes de réservation</h2>
            {bookings.map(b => {
                return (
                  <BookingCard 
                    key={b.id_booking} 
                    bookingDetails={b} 
                    handlePatch={handlePatch}
                    handleClickDelete={handleClickDelete}
                    handleClickOpen={handleClickOpen}
                    handleClose={handleClose}
                    open={open} />
                )}
            )}
            {bookings.length === 0 && <p className='no-booking'>Vous n'avez aucune nouvelle demande de réservation</p>}
            <Snackbar open={validation} autoHideDuration={6000} onClose={handleCloseMui}>
              <Alert onClose={handleCloseMui} severity={isValidated ? 'success' : 'error'}>
                {msgValidation}
              </Alert>
            </Snackbar>
        </div>
    );
  }      
};

export default Home;