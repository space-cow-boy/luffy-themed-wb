import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Telescope } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import './index.css';

const ContentWrapper = ({ children }) => {
  const location = useLocation();
  const isAbout = location.pathname === '/about';

  return (
    <div className={`main-content ${isAbout ? 'bg-about' : 'bg-home'}`}>
      {children}
    </div>
  );
};

function App() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Show navbar shortly after video ends or immediately on skip
    if (!isVideoPlaying) {
      setTimeout(() => setShowNavbar(true), 500);
    }
  }, [isVideoPlaying]);

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const skipVideo = () => {
    setIsVideoPlaying(false);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Video Overlay Section */}
        <AnimatePresence>
          {isVideoPlaying && (
            <motion.div
              className="video-container"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.5 } }}
            >
              <video
                autoPlay
                muted
                className="hero-video"
                onEnded={handleVideoEnd}
              >
                <source src="/assets/Water_7_Arc_One_Piece_Manga_Animation_720P.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button className="skip-btn" onClick={skipVideo}>Skip Intro</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Website Content */}
        <ContentWrapper>

          {/* Navbar */}
          <AnimatePresence>
            {showNavbar && (
              <motion.nav
                className="navbar"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="nav-left">
                  <Link to="/">
                    <img src="/assets/logo.png" alt="Hack-O-Holic Logo" className="logo" />
                  </Link>
                </div>

                {/* Mobile Hamburger Icon */}
                <div
                  className="hamburger-icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                  <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                  <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                </div>

                <div className={`nav-right ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                  <ul className="nav-links">
                    <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
                    <li><a href="/#mission" onClick={() => setIsMobileMenuOpen(false)}>Mission</a></li>
                    <li><a href="/#prizes" onClick={() => setIsMobileMenuOpen(false)}>Prizes</a></li>
                    <li><a href="/#schedule" onClick={() => setIsMobileMenuOpen(false)}>Schedule</a></li>
                  </ul>
                  <button className="register-btn" onClick={() => setIsMobileMenuOpen(false)}>Register</button>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Content visible after video */}
          <AnimatePresence>
            {!isVideoPlaying && (
              <motion.div
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >

                {/* Routes Layer */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                </Routes>

                {/* Footer */}
                <footer className="footer" style={{ width: '100%' }}>
                  {/* Register Button */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <a
                      href="https://github.com/Ixotic27?tab=overview&from=2026-03-01&to=2026-03-03"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', transition: 'transform 0.3s ease', cursor: 'pointer', backgroundColor: '#ffffff', padding: '0.4rem', borderRadius: '8px', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ border: '2px solid #1e40af', padding: '0.2rem', borderRadius: '4px', backgroundColor: '#ffffff' }}>
                        <img src="/assets/register.png" alt="Register Now" style={{ width: '100%', maxWidth: '350px', height: 'auto', display: 'block' }} />
                      </div>
                    </a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <img src="/assets/flag.png" alt="Pirate Flag" style={{ height: '80px', objectFit: 'contain' }} />
                  </div>
                  <div className="footer-links">
                    <a href="#faqs">FAQs</a>
                    <a href="#code-of-conduct">Code of Conduct</a>
                    <a href="#contact">Contact</a>
                  </div>
                  <div className="footer-copy">
                    © 2024 Hack-O-Holic 4.0 | All rights reserved. A One Piece Themed Hackathon.
                  </div>
                </footer>

              </motion.div>
            )}
          </AnimatePresence>

        </ContentWrapper>
      </div>
    </Router>
  );
}

export default App;
