import React, { useState } from 'react';
import API from '../API';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [passwordVerif, setPasswordVerif] = useState('')
  // const [errorInput, setErrorInput] = useState('')

  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitValidation = (e) => {
    e.preventDefault()
    const { name, email, password } = user;
    let msgAlertCopy = msgAlert;
    if (!name || !email || !password) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('L\'un des champs est manquant, merci de bien tous les remplir.')
    } else if (password !== passwordVerif) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('Les mots de passe ne correspondent pas');
    } else {
      handleSubmit()
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (!errorForm) {
      API.post('/users', user)
        .then(() => {
          setMessageForm(true)
          setErrorForm(false)
          setMsgAlert('L\'ajout de l\'utilisateur a réussi')
          setLoading(false)
          setUser({
            name: '',
            email: '',
            password: ''
          })
          setPasswordVerif('')
        })
        .catch(err => {
          console.log(err);
          setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau');
          setErrorForm(true);
          setLoading(false);
          setMessageForm(true);
        })
    }
  }

  const handleChangeForm = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const handleCloseMui = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageForm(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Créer un nouvel utilisateur
        </Typography>
        <form onSubmit={(e) => submitValidation(e)} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Nom"
                name="name"
                autoComplete="name"
                value={user.name}
                onChange={(e) => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Addresse email"
                name="email"
                autoComplete="email"
                value={user.email}
                onChange={(e) => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => handleChangeForm(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordVerif"
                label="Confirmer mot de passe"
                type="password"
                id="passwordVerif"
                autoComplete="new-password"
                onChange={(e) => setPasswordVerif(e.target.value)}
              />
            </Grid>
          </Grid>
          {loading ?
            <CircularProgress style={{ width: '70px', height: '70px' }} />
            :
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Créer le compte
            </Button>
          }
          <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
            <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
              {msgAlert}
            </Alert>
          </Snackbar>
        </form>
      </div>
    </Container>
  );
}