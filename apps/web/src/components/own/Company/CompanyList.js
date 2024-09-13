import React from 'react';
import CompanyDescription from './CompanyDescription'; // Import the component
import styles from '../../../app/student/styles_a/Home.module.css';

const companies = [
  {
    name: 'Morgan Stanley',
    logoSrc: '/images/section3/morganstanley.png',
    details: [
      'Global Investment Bank',
      'Headquarters: New York, USA',
      'Established: 1935',
      'Specializes in Wealth Management and Investment Banking'
    ],
    description: `Morgan Stanley is a leading global financial services firm that provides a wide range of investment banking, securities, wealth management, and investment management services. The firm operates in over 40 countries and serves a diverse group of corporations, governments, institutions, and individuals. Known for its financial advice, Morgan Stanley has a rich legacy in delivering unparalleled service to its clients. The firm has been pivotal in some of the most transformative deals and transactions across the globe. Whether advising on mergers and acquisitions or assisting with market strategy, Morgan Stanley continues to be a frontrunner in the global financial industry.`
  },
  {
    name: 'J.P. Morgan & Chase',
    logoSrc: '/images/section3/jpmc.jpg',
    details: [
      'Leading Global Financial Services Firm',
      'Headquarters: New York, USA',
      'Founded: 1799',
      'Services: Investment Banking, Asset Management, Private Equity'
    ],
    description: `J.P. Morgan & Chase is one of the oldest and largest financial institutions in the world. As a global leader in financial services, J.P. Morgan offers solutions in investment banking, financial services for consumers, small businesses, commercial banking, financial transaction processing, and asset management. The company has a strong tradition of leadership in the industry, regularly advising on some of the world’s largest and most complex financial transactions. With a global reach and deep expertise, J.P. Morgan provides strategic guidance and financing options to corporations, institutions, and governments across the world.`
  }
  // Add more companies as needed
];

const CompanyList = () => {
  return (
    <section id="companyDescriptions" className={styles.sectionCompanies}>
      <h2>Company Profiles</h2>
      {companies.map((company, index) => (
        <CompanyDescription
          key={index}
          logoSrc={company.logoSrc}
          name={company.name}
          details={company.details}
          description={company.description}
        />
      ))}
    </section>
  );
};

export default CompanyList;
