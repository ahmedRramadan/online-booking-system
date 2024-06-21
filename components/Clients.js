"use client"
import { Col, Container, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide, } from "swiper/react";
import { Pagination,Autoplay } from "swiper";
import { AnimationOnScroll } from 'react-animation-on-scroll';
function Clients() {
return (
    <section className='clients-section position-relative' id='clients'>
        <div className='clients-section-bg position-absolute w-100 h-75'></div>
        <Container>
            <AnimationOnScroll duration={1} animateOnce={true} animateIn="animate__fadeInDown">
            <div className='numbers-box text-white d-flex gap-5 justify-content-center text-align-center'>
                <div>
                    <p className='display-5'>8705</p>
                    <p className='h6'>PROJECTS COMPLETED</p>
                </div>
                <div>
                    <p className='display-5'>480</p>
                    <p>ACTIVE CLIENTS</p>
                </div>
                <div>
                    <p className='display-5'>626</p>
                    <p >CUPS OF COFFEE</p>
                </div>
                <div>
                    <p className='display-5'>9704</p>
                    <p>HAPPY CLIENTS</p>
                </div>
            </div>
            </AnimationOnScroll>
            <Row className='clients-message-box position-absolute'>
                <Col md={6}><div className='clients-message golden-color-bg  p-5 h4 rounded-top m-0 h-100'>WE’RE COMMITTED TO DELIVER <br/> HIGH QUALITY PROJECTS .</div></Col>
                <Col md={6}><div className='clients-message bg-white p-5 h3 rounded-top end-0 m-0 h-100' id='clients-message'>WE’RE TRUSTED BY <br/> MORE THAN 6260 CLIENTS.</div></Col>
            </Row>
            <Swiper className='mySwiper clients-swiper d-flex '
                slidesPerView={1}
                spaceBetween={50}
                grabCursor={true}
                autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                }}
                loop={true}
                breakpoints={{
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 50,
                },
                }}
                modules={[Autoplay]}
            >
                <SwiperSlide className='d-flex justify-content-center d-lg-block'><img src={'/images/evento.png'} alt='clients' className='evento-image'/></SwiperSlide>
                <SwiperSlide className='d-flex justify-content-center d-lg-block'><img src={'/images/evento.png'} alt='clients' className='evento-image'/></SwiperSlide>
                <SwiperSlide className='d-flex justify-content-center d-lg-block'><img src={'/images/evento.png'} alt='clients' className='evento-image'/></SwiperSlide>
                <SwiperSlide className='d-flex justify-content-center d-lg-block'><img src={'/images/evento.png'} alt='clients' className='evento-image'/></SwiperSlide>
                <SwiperSlide className='d-flex justify-content-center d-lg-block'><img src={'/images/evento.png'} alt='clients' className='evento-image'/></SwiperSlide>
            </Swiper>
    
        </Container>
    </section>
);
}

export default Clients;
