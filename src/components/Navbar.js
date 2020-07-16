import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AuthContext from '../authContext';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import BurgerMenu from './BurgerMenu';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
    display: 'none'
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const { setToken: setTokenInLocalStorage, setId: setIdInLocalStorage } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Burger menu
  const [openBurger, setOpenBurger] = useState(false);

  const openBurgerMenu = () => {
    setOpenBurger(true);
  };

  const closeBurgerMenu = () => {
    setOpenBurger(false);
  };

  return (
    <AppBar position="static">
      <Toolbar className='navbar'>
        <IconButton edge="start" className={classes.menuButton} id='icon-button' color="inherit" aria-label="menu" onClick={openBurgerMenu}>
          <MenuIcon />
        </IconButton>
        <BurgerMenu handleClose={closeBurgerMenu} show={openBurger}/>
        <Typography variant="h6" className='navbar-list'>
          <NavLink activeClassName='active' className='navbar-item' exact to='/'>Accueil</NavLink>
          <NavLink activeClassName='active' className='navbar-item' to='/appartements'>Appartements</NavLink>
          <NavLink activeClassName='active' className='navbar-item' to='/contacts'>Contacts</NavLink>
          <NavLink activeClassName='active' className='navbar-item' to='/calendrier'>Calendrier</NavLink>
          <NavLink activeClassName='active' className='navbar-item' to='/reservations'>Réservations</NavLink>
        </Typography>
        <div className='right-menu'>
          <span className='btn-dropdown-menu' onClick={handleMenu}>
            <p>{localStorage.getItem('name')}</p>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </span>
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
            <NavLink to={`/mon-compte`}><MenuItem onClick={handleClose}>Mon compte</MenuItem></NavLink>
            <NavLink to='/register'><MenuItem onClick={handleClose}>Créer un nouvel utilisateur</MenuItem></NavLink>
            <MenuItem onClick={() => {
              setTokenInLocalStorage('');
              setIdInLocalStorage('');
            }}>
              Déconnexion</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
};

export default Navbar;

