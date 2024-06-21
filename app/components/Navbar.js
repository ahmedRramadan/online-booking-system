"use client";
import { useState, useEffect } from 'react';
import {Container} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
    const [menu,setMenu] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [navScroll,setNavScroll] = useState(false);
        
        useEffect(() => {
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
        <Container>
        <nav className='my-2 d-flex justify-content-between align-items-center'>
                        <Link href='/en' className='text-white' style={{width: '100px'}}>
                            <Image className='' src='/images/logo.png' width={100} height={100} layout="responsive" alt="Ajyad"/>
                        </Link>
                <ul className='ajyad-list d-lg-flex d-none gap-5 list-style-none'>
                    <li> <Link className='text-white' href='/en#home'>Home</Link></li>
                    <li> <Link className='text-white' href='/en#services'>services</Link></li>
                    <li> <Link className='text-white' href='/en#experiences'>Why Ajyad?</Link></li>
                    <li><Link className='text-white' href='/en#projects'>Realestate</Link></li>
                    <li> <Link className='text-white' href='/en#team'>team</Link></li>
                    <li><Link className='text-white' href='/en#contact'>contact</Link></li>

                </ul>
                
                <div className='phone d-lg-flex d-none align-items-center' >
                    <div className='d-flex flex-column'>
                        <a className='text-white' href='ar' style={{fontSize : '12px', fontWeight:'bold'}}>عربي</a>
                    </div>
                </div>
                    <FontAwesomeIcon icon={faBars} className='cursor-pointer d-lg-none h1 text-white menu-icon' onClick={()=>setMenu(!menu)} style={{display: menu? 'none' : 'block'}}/>
                </nav>
        </Container>
        </header>

        <div className='h-100 w-100 position-absolute top-0 py-5 siadebarstyle' style={{left: menu? '0': '-100%' , transition: '0.6s ease', backgroundColor : '#eceeef'}}>
            <Container>
                <button className='border-0 float-right' style={{background : "var(--darken-color)"}}  onClick={()=>setMenu(!menu)}><FontAwesomeIcon icon={faCircleXmark} className='h1 text-white'/></button>
                <ul className='d-flex flex-column gap-3 list-style-none py-5 ps-0'>
                <li> <Link className='text-white' href='/en#home'>Home</Link></li>
                    <li> <Link className='text-white' href='/en#services'>services</Link></li>
                    <li> <Link className='text-white' href='/en#experiences'>Why Ajyad?</Link></li>
                    <li><Link className='text-white' href='/en#projects'>Realestate</Link></li>
                    <li> <Link className='text-white' href='/en#team'>team</Link></li>
                    <li><Link className='text-white' href='/en#contact'>contact</Link></li>
                </ul>
                
            </Container>
        </div>

    </>
);
}

export default Navbar;
