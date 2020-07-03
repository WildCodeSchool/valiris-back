import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import API from '../API';
import '../styles/booking-card.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

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

export default function BookingCard({ bookingDetails : { 
  id_booking, 
  firstname, 
  lastname, 
  starting_date, 
  ending_date, 
  message }, 
  handlePatch,
  handleClickOpen,
  handleClickDelete,
  handleClose,
  open}) {
  const classes = useStyles();

  const getFullDate = (date) => {
    let day = date.slice(0, 10).split('').splice(8, 9).join('')
    let month = date.slice(0, 10).split('').slice(5, 7).join('');
    let year = date.slice(0, 10).split('').slice(0, 4).join('');
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Card className={`${classes.root} card-container`}>
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
      <CardActions className='actions-booking'>
        <Button size="small" className='validation-booking' onClick={() => handlePatch(id_booking)}>Valider la réservation</Button>
        <Button size="small" className='update-booking'>Modifier la réservation</Button>
        <Button size="small" className='delete-booking' onClick={handleClickOpen}>Supprimer la réservation</Button>
      </CardActions>
      <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Êtes-vous sur de vouloir supprimer l'appartement ?"}</DialogTitle>
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