import styles from '../styles/Home.module.css';
import Auth from './auth';
import Nav from './nav';

type headerProps = {
  activePage: number;
};

const Header = (props: headerProps) => {
  return (
    <>
      <header className={styles.header}>
        <img
          className={styles.logo}
          src="../../v1.1/SyncLabLogo_Square.png"
          alt="A kitchen sink next to an round bottom lab flask"
        />
        <div className={styles.headerLinks}>
          <Auth />
          <Nav activePage={props.activePage} />
        </div>
      </header>
    </>
  );
};

export default Header;
