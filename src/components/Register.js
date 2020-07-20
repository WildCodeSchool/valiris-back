import React, { useState } from 'react';
import API from '../API';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../images/logo_valiris.png';

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

  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitValidation = (e) => {
    e.preventDefault()
    const { name, email, password } = user;
    const emailValidator = /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}/;
    if (!name || !email || !password) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('L\'un des champs est manquant, merci de bien tous les remplir.')
    } else if (password !== passwordVerif) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('Les mots de passe ne correspondent pas');
    } else if (!emailValidator.test(user.email)) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('Merci de renseigner une adresse e-mail valide.');
    }
    else if (passwordVerif.length < 5) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('Le mot de passe doit contenir au moins 5 caractères');
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
        <img 
          src={logo} 
          alt='logo-valiris' 
          className='logo-header' 
          style={{marginBottom:'40px'}}
        />
        <Typography style={{color: '#329797'}} component="h2" variant="h5">
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
                label="Adresse email"
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
                label="Mot de passe (min: 5 caractères)"
                type="password"
                id="password"
                autoComplete="new-password"
                value={user.password}
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
                value={passwordVerif}
                onChange={(e) => setPasswordVerif(e.target.value)}
              />
            </Grid>
          </Grid>
          {loading ?
            <CircularProgress className='loader' style={{ width: '70px', height: '70px' }} />
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