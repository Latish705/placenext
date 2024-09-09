import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>PlaceNext</h1>
      <nav>
        <ul>
          <li><a href="#intro">Home</a></li>
          <li><a href="#results">Placement Results</a></li>
          <li><a href="#companies">Companies</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
