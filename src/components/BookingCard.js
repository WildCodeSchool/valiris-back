import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import API from '../API';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function BookingCard({ bookingDetails : { 
  id_booking, 
  firstname, 
  lastname, 
  starting_date, 
  ending_date, 
  message }, 
  handlePatch}) {
  const classes = useStyles();

  const getFullDate = (date) => {
    let day = date.slice(0, 10).split('').splice(8, 9).join('')
    let month = date.slice(0, 10).split('').slice(5, 7).join('');
    let year = date.slice(0, 10).split('').slice(0, 4).join('');
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Demande de réservation
        </Typography>
        <Typography variant="h5" component="h4">
          {`${firstname} ${lastname}`}
        </Typography>
        <br />
        <Typography variant="body2" component="p">
          Du <strong>{getFullDate(starting_date)}</strong> au <strong>{getFullDate(ending_date)}</strong>.
        </Typography>
        <br />
        <Typography variant="body2" component="p">
          <strong>Message:</strong> 
          <br />
          {message}
        </Typography>
        <br />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handlePatch(id_booking)}>Valider la réservation</Button>
      </CardActions>
    </Card>
  );
}