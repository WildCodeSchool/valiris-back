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
    

    useEffect(() => {
        API.get('/bookings')
          .then(res => res.data)
          .then(data => setBookings(data.map(b => {
              return { 
                id_booking: b.id,
                apartment_name: b.name,
                apartment_id: b.id_apartment,
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
            <h2>Bienvenue {localStorage.getItem('name')}</h2>
            {!bookings.length === 0 && <h3 className='home-title'>Vos dernières demandes de réservation</h3>}
            {bookings.map(b => {
                return (
                  <BookingCard 
                    key={b.id_booking} 
                    bookingDetails={b} 
                    setBookings={setBookings}
                    validation={validation}
                    setValidation={setValidation}
                    isValidated={isValidated}
                    setIsValidated={setIsValidated}
                    msgValidation={msgValidation}
                    setMsgValidation={setMsgValidation}
                    />
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