import React, { useState, useEffect } from 'react';
import BookingCard from './BookingCard';
import API from '../API';
import CircularProgress from '@material-ui/core/CircularProgress';

const Home = () => {
    const [bookings, setBookings] = useState();

    useEffect(() => {
        API.get('/bookings')
          .then(res => res.data)
          .then(data => setBookings(data.map(b => {
              return { 
                firstname: b.firstname,
                lastname: b.lastname,
                starting_date: b.starting_date,
                ending_date: b.ending_date,
                message: b.content
            }
          })))
      }, []);

    if (!bookings) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress style={{ width: '50px', height: '50px', margin: '0 auto' }}/></div>;
    } else {
    return (
        <div>
            <h2>Vos dernières demandes de réservations</h2>
            {bookings.map((b, i) => <BookingCard key={i} bookingDetails={b} />)}
        </div>
    );
  }      
};

export default Home;