import React from 'react';
import CompanyCard from './CompanyCard'; // Import the company card template
import styles from '../../../app/student/styles_a/Home.module.css';

const companies = [
  { name: 'Morgan Stanley', logoSrc: '/images/section3/morganstanley.png'},
  { name: 'J.P. Morgan & Chase', logoSrc: '/images/section3/jpmc.jpg' },
  { name: 'Nomura', logoSrc: '/images/section3/nomura.png' },
  { name: 'General Mills', logoSrc: '/images/section3/generalmills.png' },
  { name: 'Accenture', logoSrc: '/images/section3/accenture.jpg' },
  { name: 'Capgemini', logoSrc: '/images/section3/capgemini.jpg' },
  { name: 'L&T Info', logoSrc: '/images/section3/lnt.jpg' },
  { name: 'MAQ Software', logoSrc: '/images/section3/maqsoftware.png' }
];

const Section3Companies = () => {
  return (
    <section id="companies" className={styles.sectionCompanies}>
      <h2>Companies Visiting Us</h2>
      <div className={styles.companiesGrid}>
        {companies.map((company, index) => (
          <CompanyCard key={index} logoSrc={company.logoSrc} name={company.name} />
        ))}
      </div>
    </section>
  );
};

export default Section3Companies;
