import React from 'react';
import { FaInstagram, FaTwitter,FaUser, FaLinkedin } from 'react-icons/fa';
import './_Footer.css'; // Import a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer" style={{marginTop:'auto'}}>
      <div className="footer-content">
        <div className="footer-social-media">
          <a href="https://www.instagram.com/avinashsuthar83065/?igsh=MWJjYTJuM3l0Y3kxcg%3D%3D" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://x.com/21087784sbi?t=P3Aj23h4x8x48Oe6a8QvfQ&s=09" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://avinashsuthar-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
            <FaUser />
          </a>
          <a href="https://www.linkedin.com/in/avinash-suthar-970a56230/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Avinash Suthar. All rights reserved.</p>
        {/* <p>Developed by </p> */}
        <p>Developed by <a className='mailme' href="mailto:avinashsuthar19hmh@gmail.com">Avinash Suthar</a> with <span role="img" aria-label="Made with Love">❤️</span> and  <span role="img" aria-label="Coffee">☕</span></p>

      </div>
    </footer>
  );
};

export default Footer;
