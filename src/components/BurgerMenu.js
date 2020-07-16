import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import Typography from '@material-ui/core/Typography';

const BurgerMenu = ({ handleClose, show }) => {

  let navClasses = 'navbar-burger';
  if (show) {
    navClasses = 'navbar-burger open';
  }
  
  return (
    <div className={navClasses}>
      <div className='closing-menu'>
        <i className='fas fa-times' onClick={handleClose} />
      </div>
      <Typography variant="h6" className='burger-list'>
        <NavLink activeClassName='active' className='burger-item' exact to='/' onClick={handleClose}>Accueil</NavLink>
        <NavLink activeClassName='active' className='burger-item' to='/appartements' onClick={handleClose}>Appartements</NavLink>
        <NavLink activeClassName='active' className='burger-item' to='/contacts' onClick={handleClose}>Contacts</NavLink>
        <NavLink activeClassName='active' className='burger-item' to='/calendrier' onClick={handleClose}>Calendrier</NavLink>
        <NavLink activeClassName='active' className='burger-item' to='/reservations' onClick={handleClose}>Réservations</NavLink>
      </Typography>
    </div>
  )
}

export default BurgerMenu;

