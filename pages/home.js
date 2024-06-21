
import Navbar from '@/components/Navbar';
import '../app/globals.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Quote from '@/components/Quote';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';


export default function Home() {

    
    return (
        <>
          <section className='main-section' id='home'>
        <div className='main-section-bg'></div>
        <Navbar />
        <div className='main-section-content '>
            <img className = 'left-line d-none d-sm-block' src = {'/images/left-curve-line.png'} alt = 'animation line' />
            <img className = 'right-golden-curve d-none d-sm-block ' src = {'/images/right-golden-curve.png'} alt = 'animation line' />
            <img className = 'right-white-curve d-none d-sm-block' src = {'/images/right-white-curve.png'} alt = 'animation line' />
            <div className='text-main-box text-white d-flex justify-content-center align-items-sm-start align-items-center flex-column container'>
                <h3 className='h5'>Welcome To TakeIt</h3>
                <p className='display-5 display-sm-1' id='main-tittle'>Your gateway to perfect bookings!</p>
                <a className='golden-btn' href='#services'><p>Find More</p></a>
            </div>
        </div>
    </section>
            <Services/>
            <Projects/>
            <Quote/>
            <Contact />
            <Footer />
        </>
    );
}
