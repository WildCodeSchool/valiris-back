import React, { useState, useEffect } from 'react';
import BookingCard from './BookingCard';
import API from '../API';

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
    return <p>loading...</p>;
    } else {
    return (
        <div>
            {bookings.map(b => <BookingCard />)}
        </div>
    );
  }      
};

export default Home;