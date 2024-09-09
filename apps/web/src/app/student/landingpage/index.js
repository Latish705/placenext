import Header from '../../../components/own/landingpage/header';
// C:\Users\DELL\OneDrive\Desktop\placenext\apps\web\src\components\own\landingpage\Header.js
import Section1Intro from '../components/Section1Intro';
import Section2Results from '../components/Section2Results';
import Section3Companies from '../components/Section3Companies';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Section1Intro />
        <Section2Results />
        <Section3Companies />
      </main>
      <Footer />
    </div>
  );
}
