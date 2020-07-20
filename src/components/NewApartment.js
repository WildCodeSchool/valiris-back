import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../API';
import '../styles/form.css';
import '../styles/apartments.css';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: 40
  },
  media: {
    height: 100,
  },
  input: {
    display: 'none',
  }
}));


const NewApartment = (props) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL + '/';
  const classes = useStyles();

  const [apartment, setApartment] = useState({
    name: '',
    details_fr: '',
    details_en: '',
    title_fr: '',
    title_en: '',
    weekPrice: '',
    monthPrice: ''
  });

  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainPicture, setMainPicture] = useState('');
  const [secondaryPictures, setSecondaryPictures] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    API.post('/apartments', { ...apartment, mainPicture, secondaryPictures })
      .then(res => res.data)
      .then(data => {
        console.log('test');
        setMessageForm(true);
        setLoading(false);
        setMsgAlert(`L'appartement ${data.name} a bien été créé.`);
        setApartment({
          name: '',
          details_fr: '',
          details_en: '',
          title_fr: '',
          title_en: '',
          weekPrice: '',
          monthPrice: ''
        });
        setMainPicture('');
        setSecondaryPictures([])
      })
      .catch(err => {
        console.log(err);
        setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau.');
        setErrorForm(true);
        setLoading(false);
        setMessageForm(true);
      })
  }

  const uploadCurrentImage = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    const currentPicture = e.target.id
    setLoading(true);
    setErrorForm(false);
    const formData = new FormData();
    formData.append('currentPicture', image);
    if (e.target.name === 'main-picture') {
      API.post('/apartments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => res.data)
        .then(data => {
          setMainPicture(data);
          setLoading(false);
        })
    } else if (e.target.name === 'secondary-picture') {
      API.post('/apartments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => res.data)
        .then(data => {
          setSecondaryPictures([...secondaryPictures, data]);
          setLoading(false);
        })
    } else if (e.target.name === 'update-secondary-picture') {
      API.post('/apartments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => res.data)
        .then(data => {
          console.log(currentPicture)
          const oldPictureIndex = secondaryPictures.findIndex((e) => e === currentPicture);
          const secondaryPicturesCopy = secondaryPictures.slice();
          secondaryPicturesCopy[oldPictureIndex] = data;
          setSecondaryPictures(secondaryPicturesCopy)
          setLoading(false);
        })
    }
  }

  const handleDelete = (picture) => {
    setSecondaryPictures(secondaryPictures.filter(image => image !== picture))
  }

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
    <div >
      <h2 className='apartment-title'>Ajouter un nouvel appartement</h2>
      <form className='form-container' autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
        <TextField
          className='input-form'
          label='Nom'
          variant='outlined'
          value={apartment.name}
          onChange={(e) => setApartment({ ...apartment, name: e.target.value })}
          name='name'
          inputProps={{
            minLength: 1,
            maxLength: 40
          }}
          required
        />
        <TextField
          className='input-form'
          label='Prix à la semaine'
          variant='outlined'
          value={apartment.weekPrice}
          onChange={(e) => setApartment({ ...apartment, weekPrice: e.target.value })}
          name='weekPrice'
          type='number'
          inputProps={{
            min: 0
          }}
          required
        />
        <TextField
          className='input-form'
          label='Prix au mois'
          variant='outlined'
          value={apartment.monthPrice}
          onChange={(e) => setApartment({ ...apartment, monthPrice: e.target.value })}
          name='monthPrice'
          type='number'
          inputProps={{
            min: 0
          }}
          required
        />
        <TextField
          className='input-form'
          label='Intitulé (français)'
          variant='outlined'
          multiline
          rows={4}
          value={apartment.title_fr}
          onChange={(e) => setApartment({ ...apartment, title_fr: e.target.value })}
          name='title_fr'
          inputProps={{
            minLength: 1
          }}
          required
        />
        <TextField
          className='input-form'
          label='Intitulé (anglais)'
          variant='outlined'
          multiline
          rows={4}
          value={apartment.title_en}
          onChange={(e) => setApartment({ ...apartment, title_en: e.target.value })}
          name='title_en'
          inputProps={{
            minLength: 1
          }}
          required
        />
        <TextField
          className='input-form'
          label='Détails (français)'
          variant='outlined'
          multiline
          rows={12}
          value={apartment.details_fr}
          onChange={(e) => setApartment({ ...apartment, details_fr: e.target.value })}
          name='details_fr'
          inputProps={{
            minLength: 1
          }}
          required
        />
        <TextField
          className='input-form'
          label='Détails (anglais)'
          variant='outlined'
          multiline
          rows={12}
          value={apartment.details_en}
          onChange={(e) => setApartment({ ...apartment, details_en: e.target.value })}
          name='details_en'
          inputProps={{
            minLength: 1
          }}
          required
        />

        <div className='main-picture'>
          <div className='input-button'>
            <input
              name='main-picture'
              accept="image/*"
              className={classes.input}
              id="main-picture-button"
              type="file"
              onChange={e => uploadCurrentImage(e)}
            />
            <p>Photo principale :</p>
            <label htmlFor="main-picture-button">
              {!mainPicture &&
                <Button variant="contained" color="primary" component="span">
                  Ajouter
              </Button>
              }
            </label>
          </div>
          {mainPicture &&
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={baseUrl + mainPicture}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h5">
                    Photo principale
                </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <input
                  name='main-picture'
                  accept="image/*"
                  className={classes.input}
                  id="main-picture-button"
                  type="file"
                  onChange={e => uploadCurrentImage(e)}
                />
                <label htmlFor="main-picture-button">
                  <Button variant="contained" color="primary" component="span">
                    Modifier
                </Button>
                </label>
              </CardActions>
            </Card>
          }
        </div>

        <div className='secondary-picture'>
          <div className='input-button'>
            <input
              name='secondary-picture'
              accept="image/*"
              className={classes.input}
              id="secondary-picture-button"
              type="file"
              onChange={e => {
                uploadCurrentImage(e)
              }}
            />
            <p>Photo secondaire :</p>
            <label htmlFor="secondary-picture-button">
              <Button variant="contained" color="primary" component="span">
                Ajouter
          </Button>
            </label>
          </div>
          <div className='picture-card'>
            {secondaryPictures.map((picture) => {
              return (
                <Card key={picture} className={classes.root}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={baseUrl + picture}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h5">
                        Photo secondaire
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <input
                      name='update-secondary-picture'
                      accept="image/*"
                      className={classes.input}
                      id={picture}
                      type="file"
                      onChange={(e) => uploadCurrentImage(e)}
                    />
                    <label htmlFor={picture}>
                      <Button variant="contained" color="primary" component="span">
                        Modifier
                  </Button>
                    </label>
                    <Button size="small" color="primary" onClick={() => handleDelete(picture)}>
                      Supprimer
                </Button>
                  </CardActions>
                </Card>
              )
            })}
          </div>
        </div>

        <div className='submit-back'>
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" className='contact-valid-button' type='submit'>Valider</Button>}
          <Button className='back-button' variant="contained">
            <Link to={`/appartements`}>Retour</Link>
          </Button>
        </div>

        <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
          <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
            {msgAlert}
          </Alert>
        </Snackbar>
      </form>
    </div>
  )
}

export default NewApartment;
