"use client"
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Quote() {

return (
    <section className='quote-section position-relative'>
        <div className='quote-section-bg'></div>
        <div className='container'>
            <div className='quote-box position-absolute'>
                <FontAwesomeIcon icon={faCubes} className='golden-color display-1 p-5'  />
                <h2 className='text-white font-weight-bold'>Unlock the World of Entertainment: Book Your Tickets, Experience the Magic, and Enjoy Every Moment!</h2>
            </div>
        </div>
    </section>
);
}

export default Quote;
