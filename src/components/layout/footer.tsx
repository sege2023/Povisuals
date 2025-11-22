import React from 'react';
import styles from './Footer.module.css';
import FadeUp from '../animation/FadeUp';

const socialIcons = [
  { name: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { name: 'Twitter', path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
  { name: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM18 2h-4a8 8 0 0 0-8 8v4a8 8 0 0 0 8 8h4a8 8 0 0 0 8-8v-4a8 8 0 0 0-8-8zm-8 11h6' },
  { name: 'Pinterest', path: 'M12 20c1.1 0 2.1-.9 2.1-2.1 0-.5-.2-1.2-.4-1.8l4-1.6c.6.9 1 1.9 1 3.1 0 2.8-2.6 5-5.6 5-3.1 0-5.6-2.3-5.6-5 0-1.5.6-2.9 1.6-4l-1-3.8c-.2.2-.6.4-.8.6-1.3.9-2.1 2.5-2.1 4.2C4.9 17.1 8 20 12 20z' }
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Academy', href: '/academy' },
  { name: 'About', href: '/about' },
  { name: 'Contact Us', href: '/contact' }
];

const Footer: React.FC = () => {
  return (
    <FadeUp className={styles.sectionContainer} duration={1.2}>
      <div className={styles.sectionContent}>
        {/* Quote Section */}
        <div className={styles.quoteContainer}>
          <p className={styles.quote}>
            "My mind is a centre of divine operation" - Bob Proctor
          </p>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navContainer}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className={styles.navLink}>{link.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social + Copyright */}
        <div className={styles.socialContainer}>
          <div className={styles.socialIcons}>
            {socialIcons.map((icon) => (
              <a 
                key={icon.name}
                href={`/${icon.name.toLowerCase()}`}
                className={styles.socialLink}
                aria-label={icon.name}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24"
                  className={styles.socialIcon}
                >
                  <path d={icon.path} fill="currentColor" />
                </svg>
              </a>
            ))}
          </div>
          
          <div className={styles.infoRow}>
            <p className={styles.copyright}>© 2025 FELIX CROWN FOTOGRAFI</p>
            <p className={styles.instagram}>@FELIXCROWN</p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
};

export default Footer;
