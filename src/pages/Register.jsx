import React from 'react';

const Register = () => {
    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            padding: '20px'
        }}>
            {/* Full-page dark blur base from App background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(3px)',
                zIndex: 0
            }}></div>

            <div style={{
                position: 'relative',
                zIndex: 2,
                background: 'rgba(15, 15, 20, 0.75)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '40px',
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.7)',
                marginTop: '100px' // Avoid navbar
            }}>
                <h1 className="ap-title" style={{ color: '#ffb300', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', marginBottom: '20px' }}>
                    REGISTRATION
                </h1>

                <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '30px'
                }}>
                    <p style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.6', margin: 0 }}>
                        The registration will be done under the <span style={{ color: '#ffb300', fontWeight: 'bold' }}>Tech Fest Events 2026</span>.
                    </p>
                    <p style={{ color: '#d1d5db', fontSize: '1.1rem', marginTop: '15px' }}>
                        All the registrations will be done using the <strong style={{ color: 'white' }}>Quick Roll</strong> app.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;
