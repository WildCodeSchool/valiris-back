import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import BurgerButton from './BurgerButton';

const Navbar = () => {
    const [openBurger, setOpenBurger] = useState(false);

    const handleOpen = () => {
      setOpenBurger(true);
    };
  
    const handleClose = () => {
      setOpenBurger(false);
    };

  let navClasses = 'nav-menu';
  if (openBurger) {
    navClasses = 'nav-menu open';
  }

  return (
    <>
      <BurgerButton handleClick={handleOpen} />
      <nav className={`mobile-menu ${navClasses}`}>
        <div className='closing-menu'>
          <i className='fas fa-times' onClick={handleClose} />
        </div>
        <ul className='menuItems'>
          <li><NavLink onClick={handleClose} to='/'>Accueil</NavLink></li>
          <li><NavLink onClick={handleClose} to='/appartements'>Appartement</NavLink></li>
          <li><NavLink onClick={handleClose} to='/contacts'>Contacts</NavLink></li>
          <li><NavLink onClick={handleClose} to='/calendrier'>Calendrier</NavLink></li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
