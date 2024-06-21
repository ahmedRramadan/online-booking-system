import '../app/globals.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import backgroundImg from '../public/account-bg.jpg'; 
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../app/utils/firebase'; 
import { doc, setDoc } from "firebase/firestore";
import { db } from '../app/utils/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useRouter } from 'next/router';


export default function SignUp() {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
    const [name, setName] = useState(''); // State for the name field
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleSubmit = async (event) => {
      event.preventDefault();    
      setLoading(true); // Indicate loading process
      setError(''); // Clear previous errors
      setSuccess(''); // Clear previous success messages
    
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        setLoading(false);
        return;
      }
      if (!agree) {
        setError("You must agree to the terms and conditions.");
        setLoading(false);
        return;
      }
    
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
        });
      
        setSuccess("Verification email sent. Please check your inbox.");
        router.push('/home');
        localStorage.setItem('userName', name);
      }catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    const signInWithGoogle = async () => {
      setLoading(true); // Indicate loading process
      setError(''); // Clear previous errors
      setSuccess(''); // Clear previous success messages
    
      try {
        await signInWithPopup(auth, googleProvider);
        setSuccess("Successfully signed in with Google.");
        router.push('/home'); // Redirect to home page after successful login
      } catch (error) {
        console.error("Error signing in with Google:", error.message);
        setError(error.message); // Display an error message
      } finally {
        setLoading(false);
      }
    };
    
    const signInWithFacebook = async () => {
      setLoading(true); // Indicate loading process
      setError(''); // Clear previous errors
      setSuccess(''); // Clear previous success messages
    
      try {
        await signInWithPopup(auth, facebookProvider);
        setSuccess("Successfully signed in with Facebook.");
        router.push('/home'); // Redirect to home page after successful login
      } catch (error) {
        console.error("Error signing in with Facebook:", error.message);
        setError(error.message); // Display an error message
      } finally {
        setLoading(false);
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
  
        <section className="account-section bg_img" style={{ backgroundImage: `url(${backgroundImg.src})` }}>
          <div className="container">
            <div className="padding-top padding-bottom">
              <div className="account-area">
                <div className="section-header-3">
                  <span className="cate">welcome</span>
                  <h2 className="title text-white">to TakeIt</h2>
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {success && <div className="alert alert-success" role="alert">{success}</div>}
                <form className="account-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name<span>*</span></label>
                  <input type="text" placeholder="Enter Your Name" id="name" required onChange={e => setName(e.target.value)} />
                </div>
                  <div className="form-group">
                    <label htmlFor="email1">Email<span>*</span></label>
                    <input type="text" placeholder="Enter Your Email" id="email1" required onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pass1">Password<span>*</span></label>
                    <input type="password" placeholder="Password" id="pass1" required onChange={e => setPassword(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pass2">Confirm Password<span>*</span></label>
                    <input type="password" placeholder="Confirm Password" id="pass2" required onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                  <div className="form-group checkgroup">
                    <input type="checkbox" id="bal" required checked={agree} onChange={e => setAgree(e.target.checked)} />
                    <label htmlFor="bal">I agree to the <a href="#0">Terms, Privacy Policy</a> and <a href="#0">Fees</a></label>
                  </div>
                  <div className="form-group text-center">
                    <input type="submit" value="Sign Up" />
                  </div>
                </form>
                <div className="option text-white">
                  Already have an account? <a href="/login">Login</a> {/* Adjust the link as necessary */}
                </div>
                <div className="or"><span>Or</span></div>
                <ul className="social-icons px-0">
                  <li>
                    <a href="#" onClick={signInWithFacebook}>
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={signInWithGoogle}>
                      <FontAwesomeIcon icon={faGoogle} />
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