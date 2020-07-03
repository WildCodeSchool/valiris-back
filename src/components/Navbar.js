import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Navbar = () => {

return (
<AppBar position="static">
  <Toolbar>
    <Typography variant="h6" className='navbar-list'>
        <Button color="inherit"><NavLink className='navbar-item' to='/'>Accueil</NavLink></Button>
        <Button color="inherit"><NavLink className='navbar-item' to='/appartements'>Appartements</NavLink></Button>
        <Button color="inherit"><NavLink className='navbar-item' to='/contacts'>Contacts</NavLink></Button>
        <Button color="inherit"><NavLink className='navbar-item' to='/calendrier'>Calendrier</NavLink></Button>
    </Typography>
    <Button color="inherit">Deconnexion</Button>
  </Toolbar>
</AppBar>
)
};

export default Navbar;

