import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import '../styles/booking-card.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import API from '../API';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function BookingCard(
  { bookingDetails: {
    id_booking,
    apartment_id,
    apartment_name,
    firstname,
    lastname,
    email,
    phone,
    starting_date,
    ending_date,
    message },
    setBookings,
    validation,
    setValidation,
    isValidated,
    setIsValidated,
    msgValidation,
    setMsgValidation
  }) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const getFullDate = (date) => {
    let day = date.slice(0, 10).split('').splice(8, 9).join('')
    let month = date.slice(0, 10).split('').slice(5, 7).join('');
    let year = date.slice(0, 10).split('').slice(0, 4).join('');
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickDelete = (id) => {
    handleClose()
    API.delete(`/bookings/${id}`)
      .then(res => res.data)
    setBookings(bookings => bookings.filter(b => b.id_booking !== id));
  }

  const handlePatch = async () => {
    let impossibleBooking = false;
    const existingBookings = await Promise.resolve(API.get(`/apartments/${apartment_id}/availabilities`).then(res => res.data).then(data => data));
    existingBookings.forEach(b => {
      if ((b.starting_date < ending_date && b.ending_date > starting_date) || (b.ending_date < ending_date && b.ending_date > starting_date)) {
        impossibleBooking = true;
      }
    })

    if (impossibleBooking) {
      setMsgValidation('Une réservation pour cet appartement a déjà été validée à cette période.');
      setValidation(true);
      setIsValidated(false);
    } else {
      API.patch('/bookings', { id_booking })
        .then(() => {
          setBookings(bookings => bookings.filter(b => b.id_booking !== id_booking));
          setValidation(true);
          setIsValidated(true);
          setMsgValidation('La réservation a bien été acceptée et apparaîtra sur votre calendrier de réservation.')
        })
        .catch(err => {
          setValidation(true);
          setIsValidated(false);
          setMsgValidation('Une erreur est survenue, veuillez essayer à nouveau.');
        })
    }
  }

  return (
    <Card className={`${classes.root} card-container`}>
      <CardContent>
        <Typography className={`card-title ${classes.title}`} color="textSecondary" gutterBottom>
          Demande de réservation
        </Typography>
        <Typography variant="h5" component="h4">
          {`${firstname} ${lastname}`}
        </Typography>
        <br />
        <Typography variant="body2" component="p">
          <strong className='card-subtitles'>Appartement :</strong> {apartment_name}
          <br />
          <strong className='card-subtitles'>Adresse e-mail :</strong> {email}
          <br />
          <strong className='card-subtitles'>Numéro de téléphone :</strong> {phone}
        </Typography>
        <br />
        <Typography variant="body2" component="p">
          Du <strong className='card-subtitles'>{starting_date && getFullDate(starting_date)}</strong> au <strong className='card-subtitles'>{ending_date && getFullDate(ending_date)}</strong>
        </Typography>
        <br />
        <Typography variant="body2" component="p">
          <strong className='card-subtitles'>Message :</strong>
          <br />
          {message}
        </Typography>
        <br />
      </CardContent>
      <CardActions className='actions-booking'>
        <Button size="small" className='validation-booking' onClick={() => handlePatch()}>Valider la réservation</Button>
        <Link to={`/reservation/${id_booking}`}><Button size="small" className='update-booking'>Modifier la réservation</Button></Link>
        <Button size="small" className='delete-booking' onClick={handleClickOpen}>Supprimer la réservation</Button>
      </CardActions>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Êtes-vous sur de vouloir supprimer la réservation ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Toute suppression sera irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
            </Button>
          <Button onClick={() => handleClickDelete(id_booking)} color="primary">
            Supprimer
            </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}