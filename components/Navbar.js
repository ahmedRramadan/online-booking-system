"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {Container} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { auth, db } from '../app/utils/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [navScroll, setNavScroll] = useState(false);
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              setUser(user);
          } else {
              setUser(null);
          }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
  }, [auth]);
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().firstName); // تعيين اسم المستخدم
        } else {
          setUserName(''); // إعادة تعيين اسم المستخدم إذا لم يكن هناك مستخدم مسجل
        }
      }
    };
  
    fetchUserName();
  
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setNavScroll(true);
      } else {
        setNavScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
        
return (
    <>
        <header className='fixed-top' style={{backgroundColor: navScroll ? 'var(--darken-color)' : 'transparent'}}>
        <div className='container'>
        <nav className='my-2 d-flex justify-content-between align-items-center'>
                        <Link href='/home' className='text-white' style={{width: '100px'}}>
                            <Image className='' src='/images/logo.png' width={100} height={100} layout="responsive" alt="Ajyad"/>
                        </Link>
                <ul className='ajyad-list d-lg-flex d-none gap-5 list-style-none'>
                    <li> <Link className='text-white' href='/home'>Home</Link></li>
                    <li> <Link className='text-white' href='#services'>services</Link></li>
                    <li><Link className='text-white' href='#projects'>tickets</Link></li>
                    <li><Link className='text-white' href='#contact-section'>contact</Link></li>

                </ul>
                
                <div className='phone d-lg-flex d-none align-items-center' >
                    <div className='d-flex flex-column'>
                    <div className='account-name text-white'>
                    {user ? (
                <Link href="/profile" className='text-white'>Account</Link>
            ) : (
                <Link href="/login" className='text-white'>Login</Link>
            )}      </div>
                    </div>
                </div>
                    <FontAwesomeIcon icon={faBars} className='cursor-pointer d-lg-none h1 text-white menu-icon' onClick={()=>setMenu(!menu)} style={{display: menu? 'none' : 'block'}}/>
                </nav>
        </div>
        </header>

        <div className='h-100 w-100 position-absolute top-0 py-5 siadebarstyle' style={{left: menu? '0': '-100%' , transition: '0.6s ease', backgroundColor : '#eceeef'}}>
        <div className='container'>
                <button className='border-0 float-right' style={{background : "var(--darken-color)"}}  onClick={()=>setMenu(!menu)}><FontAwesomeIcon icon={faCircleXmark} className='h1 text-white'/></button>
                <ul className='d-flex flex-column gap-3 list-style-none py-5 ps-0'>
                <li> <Link className='text-white' href='/home'>Home</Link></li>
                    <li> <Link className='text-white' href='#services'>services</Link></li>
                    <li><Link className='text-white' href='#projects'>tickets</Link></li>
                    <li><Link className='text-white' href='#contact-section'>contact</Link></li>
                </ul>
                
            </div>
        </div>

    </>
);
}

export default Navbar;
