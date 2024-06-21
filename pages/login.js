import '../app/globals.css';
import React, { useState } from 'react';
import Image from 'next/image';
import backgroundImg from '../public/account-bg.jpg'; // Adjust the path to your image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../app/utils/firebase'; // Adjust this path as necessary

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any existing error messages
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home'); // Redirect to the home page on successful login
    } catch (error) {
      console.error("Error signing in with email and password:", error.message);
      setError(error.message); // Update to set error state
    }
  };

  const handleSignInWithGoogle = async () => {
    setError(''); // Clear any existing error messages
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/home'); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message); // Update to set error state
    }
  };

  const handleSignInWithFacebook = async () => {
    setError(''); // Clear any existing error messages
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push('/home'); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error signing in with Facebook:", error.message);
      setError(error.message); // Update to set error state
    }
  };

  return (
    <>
      {/* Preloader */}
      <div className="preloader">
        <div className="preloader-inner">
          <div className="preloader-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Sign-In Section */}
      <section
        className="account-section bg_img"
        style={{ backgroundImage: `url(${backgroundImg.src})` }}
      >
        <div className="container">
          <div className="padding-top padding-bottom">
            <div className="account-area">
              <div className="section-header-3">
                <span className="cate">hello</span>
                <h2 className="title text-white">welcome back</h2>
              </div>
              {error && <div className="alert alert-danger" role="alert" style={{ marginTop: '20px' }}>{error}</div>}
              <form className="account-form" onSubmit={handleSubmit}>
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
                <div className="form-group">
                  <label htmlFor="pass3">Password<span>*</span></label>
                  <input
                    type="password"
                    placeholder="Password"
                    id="pass3"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group checkgroup">
                  <input type="checkbox" id="bal2" />
                  <label htmlFor="bal2">remember password</label>
                  <a href="/forgetpassword" className="forget-pass">Forget Password</a>
                </div>
                <div className="form-group text-center">
                  <input type="submit" value="log in" />
                </div>
              </form>
              <div className="option text-white">
                Don't have an account? <a href="/signup">sign up now</a>
              </div>
              <div className="or"><span>Or</span></div>

              {/* Social icons */}
              <ul className="social-icons px-0">
                <li>
                  <a href="javascript:void(0);" onClick={handleSignInWithGoogle}>
                    <FontAwesomeIcon icon={faGoogle} />
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" onClick={handleSignInWithFacebook}>
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
