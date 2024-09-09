import Header from '../../../components/own/landingpage/header';
// C:\Users\DELL\OneDrive\Desktop\placenext\apps\web\src\components\own\landingpage\Header.js
import Section1Intro from '../../../components/own/landingpage/Section1Intro';
import Section2Results from '../../../components/own/landingpage/Section2Results';
import Section3Companies from '../../../components/own/landingpage/Section3Companies';
import SectionReviews from '../../../components/own/landingpage/SectionReviews'
import Footer from '../../../components/own/landingpage/Footer';
import styles from '../../../app/student/styles_a/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Section1Intro />
        <Section2Results />
        <Section3Companies />
        <SectionReviews />
      </main>
      <Footer />
    </div>
  );
}
