import React, { useState, useEffect } from 'react';

const Events = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            position: 'relative',
            paddingBottom: '4rem',
            paddingTop: 0
        }}>
            {/* Full-page dark overlay */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', zIndex: 0 }}></div>

            {/* Content — padded so text clears the fixed navbar */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '140px 2rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div className="about-content-container" style={{ width: '100%' }}>
                    <div className="ap-section text-center">
                        <h1 className="ap-title" style={{ color: '#ffb300', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
                            <span className="op-font">E</span>VENTS
                        </h1>
                        <p style={{ color: '#fff', fontSize: '1.2rem', fontFamily: "'Inter', sans-serif", textAlign: 'center', textShadow: '1px 1px 2px #000', marginTop: '1rem', marginBottom: '3rem' }}>
                            Join our exciting events throughout the hackathon
                        </p>
                    </div>

                    <div className="ap-diff-grid" style={{ paddingBottom: '4rem', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)' }}>
                        <div className="ap-diff-card" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', padding: 0, backdropFilter: 'blur(10px)' }}>
                            <img src="/assets/prompt%20engineering.webp" alt="Prompt Engineering" style={{ width: '100%', height: '200px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                            <div style={{ padding: '2rem' }}>
                                <h4 style={{ color: '#ffb300', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>Prompt Engineering Workshop</h4>
                                <p style={{ color: '#e2e8f0' }}>Master the art of communicating with AI. Learn advanced prompting techniques to unlock the full potential of large language models.</p>
                            </div>
                        </div>
                        <div className="ap-diff-card" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', padding: 0, backdropFilter: 'blur(10px)' }}>
                            <img src="/assets/squid%20game.webp" alt="Squid game" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'top' }} loading="lazy" decoding="async" />
                            <div style={{ padding: '2rem' }}>
                                <h4 style={{ color: '#ffb300', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>Squid Game</h4>
                                <p style={{ color: '#e2e8f0' }}>Enter the ultimate survival tournament! Compete against other players in high-stakes, nerve-wracking mini-games inspired by the hit show. Outlast everyone else to claim the grand prize.</p>
                            </div>
                        </div>
                        <div className="ap-diff-card" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', padding: 0, backdropFilter: 'blur(10px)' }}>
                            <img src="/assets/treasure%20hunt.webp" alt="Technical treasure hunt" style={{ width: '100%', height: '200px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                            <div style={{ padding: '2rem' }}>
                                <h4 style={{ color: '#ffb300', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>Technical treasure hunt</h4>
                                <p style={{ color: '#e2e8f0' }}>Follow the digital clues. Solve cryptography puzzles, reverse engineer code, and crack passwords to find the hidden treasure.</p>
                            </div>
                        </div>
                        <div className="ap-diff-card" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', padding: 0, backdropFilter: 'blur(10px)' }}>
                            <img src="/assets/smash%20karts.webp" alt="Smash carts" style={{ width: '100%', height: '200px', objectFit: 'cover' }} loading="lazy" decoding="async" />
                            <div style={{ padding: '2rem' }}>
                                <h4 style={{ color: '#ffb300', fontSize: '1.5rem', marginBottom: '1rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>Smash Karts</h4>
                                <p style={{ color: '#e2e8f0' }}>Jump into the chaotic arena! Smash Karts is a fast-paced 3D multiplayer kart battle game where you grab crazy weapons, blow up opponents, and fight for survival.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;
