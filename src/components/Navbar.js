import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AuthContext from '../authContext';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Account from './Account';

const Navbar = () => {
  const { setToken: setTokenInLocalStorage,  id} = useContext(AuthContext);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className='navbar-list'>
          <Button color="inherit"><NavLink className='navbar-item' to='/'>Accueil</NavLink></Button>
          <Button color="inherit"><NavLink className='navbar-item' to='/appartements'>Appartements</NavLink></Button>
          <Button color="inherit"><NavLink className='navbar-item' to='/contacts'>Contacts</NavLink></Button>
          <Button color="inherit"><NavLink className='navbar-item' to='/calendrier'>Calendrier</NavLink></Button>
          <Button color="inherit"><NavLink className='navbar-item' to='/reservations'>Réservations</NavLink></Button>
        </Typography>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <NavLink to={`mon-compte/${id}`}><MenuItem onClick={handleClose}>Mon compte</MenuItem></NavLink>
            <NavLink to='/register'><MenuItem onClick={handleClose}>Créer un nouvel utilisateur</MenuItem></NavLink>
            <MenuItem onClick={() => setTokenInLocalStorage('')}>Déconnexion</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
};

export default Navbar;

