"use client";

import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCalendarCheck, faCalendarXmark, faFileInvoiceDollar, faHouseChimneyCrack, faMoneyBill, faTicket, faTowerObservation  } from '@fortawesome/free-solid-svg-icons';
import { faHeadset  } from '@fortawesome/free-solid-svg-icons';
import { faHouseChimney  } from '@fortawesome/free-solid-svg-icons';
import { faHouseChimneyUser  } from '@fortawesome/free-solid-svg-icons';
import { faBuildingUser  } from '@fortawesome/free-solid-svg-icons';
import { faBuildingCircleCheck  } from '@fortawesome/free-solid-svg-icons';


function Services() {

return (
<section class='services-section py-5' id='services'>
    <div class="container">
        <div class='row mt-5 justify-content-start'>
            <div class='col-xl-6 mb-4'>
                <p class='display-5 text-white'>OUR BOOKING SOLUTIONS</p>
                <p class='text-white opacity-75 h5'>A ticket booking website offers a convenient platform for users to purchase and manage tickets for various events.The website also provides features for managing bookings, such as canceling, modifying, or upgrading tickets</p>
            </div>
            <div class='col-xl-3 col-sm-6'>
                <div class='services-box p-5 d-flex justify-content-between mb-4'>
                    <div>
                        <p class='text-white opacity-50 h4 mb-5'>01</p>
                        <p class='service-name text-white h6'>CUSTOMIZATION<br/>TICKETS</p>
                    </div>
                    <FontAwesomeIcon icon={faTicket} className='services-icon h2' />
                </div>
            </div>
            <div class='col-xl-3 col-sm-6'>
                <div class='services-box p-5 d-flex justify-content-between mb-4'>
                    <div>
                        <p class='text-white opacity-50 h4 mb-5'>02</p>
                        <p class='service-name text-white h6'>BOOKING<br/>EVENTS</p>
                    </div>
                    <FontAwesomeIcon icon={faCalendarCheck} className='services-icon h2' />
                </div>
            </div>
            <div class='col-xl-3 col-sm-6'>
                <div class='services-box p-5 d-flex justify-content-between mb-4'>
                    <div>
                        <p class='text-white opacity-50 h4 mb-5'>03</p>
                        <p class='service-name text-white h6'>CANCELING<br/>BOOKINGS</p>
                    </div>
                    <FontAwesomeIcon icon={faCalendarXmark} className='services-icon h2' />
                </div>
            </div>
            <div class='col-xl-3 col-sm-6'>
                <div class='services-box p-5 d-flex justify-content-between mb-4'>
                    <div>
                        <p class='text-white opacity-50 h4 mb-5'>04</p>
                        <p class='service-name text-white h6'>PAYMENT<br/>SYSTEM</p>
                    </div>
                    <FontAwesomeIcon icon={faMoneyBill} className='services-icon h2' />
                </div>
            </div>
            <div class='col-xl-3 col-sm-6'>
                <div class='services-box p-5 d-flex justify-content-between mb-4'>
                    <div>
                        <p class='text-white opacity-50 h4 mb-5'>05</p>
                        <p class='service-name text-white h6'>RECOVERING<br/>MONEY</p>
                    </div>
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className='services-icon h2' />
                </div>
            </div>
            <div class='col-xl-3 col-sm-6'>
                <div class='services-box p-5 d-flex justify-content-between mb-4'>
                    <div>
                        <p class='text-white opacity-50 h4 mb-5'>06</p>
                        <p class='service-name text-white h6'>CHANGING<br/>RESERVATION</p>
                    </div>
                    <FontAwesomeIcon icon={faTowerObservation} className='services-icon h2' />
                </div>
            </div>
        </div>
    </div>
</section>

);
}

export default Services;
