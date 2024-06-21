import '../app/globals.css';
import React, { useState } from 'react';
import Image from 'next/image';
import backgroundImg from '../public/account-bg.jpg'; // Adjust the path to your image
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';
import { auth } from '../app/utils/firebase'; // Adjust this path as necessary
import { sendPasswordResetEmail  } from 'firebase/auth';


export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    const handleResetPassword = async (event) => {
        event.preventDefault(); // Prevent form from causing page reload
    
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
    
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setError(''); // Clear any previous error
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setError(error.message);
            setMessage(''); // Clear any previous message
        }
    };

    return (
        <>
            <div className="preloader">
                <div className="preloader-inner">
                    <div className="preloader-icon">
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            <section className="account-section bg_img vh-100" style={{ backgroundImage: `url(${backgroundImg.src})` }}>
                <div className="container">
                    <div className="padding-top padding-bottom">
                        <div className="account-area">
                            <div className="section-header-3">
                                <span className="cate">Reset your account</span>
                            </div>
                            {message && <div className="alert alert-success" role="alert">{message}</div>}
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <form className="account-form" onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label htmlFor="email2">Email<span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Enter Your Email"
                                        id="email2"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group text-center">
                                    <input type="submit" value="Reset Password" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
