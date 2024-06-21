import { useRouter } from 'next/router';
import '../../app/globals.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import '../../../node_modules/swiper/swiper-bundle.min.css';
import '../../../node_modules/swiper/swiper.min.css';
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../../../node_modules/leaflet/dist/leaflet.css";
import dynamic from 'next/dynamic';
import { auth, db } from '../../app/utils/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Ticket from '@/components/Ticket';
import Chatbot from '@/components/Chatbot';
import QRCode from 'qrcode.react'; // إضافة مكتبة QRCode

async function createTicketForEvent(eventidfinal, propertyName) {
    const user = auth.currentUser;
    const eventId = eventidfinal;
    if (!user) {
        console.error("No user logged in");
        return false;
    }

    const ticketId = `${user.uid}_${eventidfinal}_${new Date().toISOString()}`;
    const ticketRef = doc(db, "tickets", ticketId);

    try {
        await setDoc(ticketRef, {
            userId: user.uid,
            eventId: eventidfinal,
            eventName: propertyName,
            qrData: ticketId, // استخدام ticketId هنا بشكل صحيح
            createdAt: new Date(),
        });

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            tickets: arrayUnion(ticketId)
        });

        // تحديث عدد التذاكر المتبقية
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        const eventData = eventSnap.data();
        await updateDoc(eventRef, {
            numberOfTicketsAvailable: (parseInt(eventData.numberOfTicketsAvailable) - 1).toString()
        });

        console.log(`Ticket created successfully with ID: ${ticketId}`);
        return true;
    } catch (error) {
        console.error("Error creating ticket:", error);
        return false;
    }
}

// ديناميكي مع تعطيل SSR
export const DynamicMapComponent = dynamic(() => import('../../components/MapComponent'), {
    ssr: false
});

export async function getServerSideProps(context) {
    const db = getFirestore();
    const id = context.params.id;
    const eventidfinal = context.params.id;

    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return {
            notFound: true,
        };
    }

    const property = docSnap.data();

    const userRef = doc(db, "users", property.userId);
    const userSnap = await getDoc(userRef);
    const user = userSnap.data();

    // تحويل تواريخ Firestore إلى نصوص ISO ثم إلى تاريخ فقط
    if (property.startDate && property.startDate.toDate) {
        property.startDate = property.startDate.toDate().toISOString().split('T')[0];
    }
    if (property.endDate && property.endDate.toDate) {
        property.endDate = property.endDate.toDate().toISOString().split('T')[0];
    }

    return {
        props: {
            property,
            eventidfinal,
            user,
            images: property.images || [], // تأكد من أن حقل الصور موجود ومصفوفة
        },
    };
}

const EventDetails = ({ property, images, user, eventidfinal }) => {
    SwiperCore.use([Autoplay, Pagination]);

    const [ticketCreated, setTicketCreated] = useState(false);
    const [isEventEnded, setIsEventEnded] = useState(false);
    const [ticketsAvailable, setTicketsAvailable] = useState(parseInt(property.numberOfTicketsAvailable) || 0);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        // تحقق من انتهاء وقت الحدث
        const currentDate = new Date();
        const eventEndDate = new Date(property.endDate);
        if (currentDate > eventEndDate || ticketsAvailable <= 0) {
            setIsEventEnded(true);
        }
    }, [property.endDate, ticketsAvailable]);

    const handleGetTicket = async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          router.push('/login');
          return;
        }

        // جلب تفاصيل الحدث من Firestore
        const eventRef = doc(db, 'events', eventidfinal);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) {
          console.error('Event not found');
          return;
        }

        const eventData = eventSnap.data();
        const price = eventData.price;

        if (price && !isNaN(price) && price > 0) {
          // Redirect to payment page with price information
          router.push(`/payment?eventId=${eventidfinal}&price=${price}`);
          return;
        }

        const result = await createTicketForEvent(eventidfinal, property.name);
        if (result) {
          setTicketCreated(true);
          setTicketsAvailable(ticketsAvailable - 1); // تحديث عدد التذاكر المتبقية
        }
      };

    return (
        <div className='property-details-page'>
            <Navbar />
            <div className='container property-details my-5'>
                {isEventEnded && (
                    <div className="alert alert-warning text-center">
                       Time has run out or tickets are sold out
                    </div>
                )}
                <h2 className='text-center mb-4'>{property.name}</h2>
                <p className='h5 text-center'>{property.description}</p>
                <div className='mb-5'>
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img className='property-details-image rounded img-fluid' src={image} alt={`Image ${index}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className='property-info mb-5'>
                    <h3 className="mb-4 h3">Event details</h3>
                    <p><strong>Country:</strong> {property.country}</p>
                    <p><strong>Address:</strong> {property.address}</p>
                    <p><strong>Price:</strong> {property.price && !isNaN(property.price) ? `${property.price} EG` : 'Free'}</p>
                    <p><strong>Date:</strong> from {property.startDate} to {property.endDate}</p>
                    <p><strong>Tickets available:</strong> {ticketsAvailable}</p>
                </div>
                <div>
                    {property.location && (
                        <DynamicMapComponent center={[property.location.lat, property.location.lng]} />
                    )}
                </div>
                <div className="property-info mt-5">
                    <h3 className="mb-4 h3">provider details</h3>
                    <p><strong>Company:</strong> {user.orgName}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <a className='golden-btn text-center' target='_blank' href={`https://api.whatsapp.com/send/?phone=${user.phone}&text=Welcome+To+AJYAD&type=phone_number&app_absent=0`}><p>chat with provider <FontAwesomeIcon icon={faWhatsapp} /></p></a>
                </div>
                <a
                    className={`golden-btn text-center mt-5 mx-auto ${isEventEnded ? 'd-none' : ''}`}
                    onClick={handleGetTicket}
                    style={{ pointerEvents: isEventEnded ? 'none' : 'auto' }}
                >
                    <p>Get a ticket</p>
                </a>
                {ticketCreated && (
                    <Ticket property={property} user={user} />
                )}
            </div>
            <div className='chat-in-evet-page'>
            <Chatbot 
              eventChatData={property.chatData || ''} 
              eventName={property.name || ''} 
              eventPrice={property.price || 'Free'} 
              eventnumberOfTicketsAvailable={property.numberOfTicketsAvailable || 0} 
              eventStartDate={property.startDate || ''} 
              eventEndDate={property.endDate || ''} 
              eventAddress={property.address || ''} 
            />            </div>
            <Footer />
        </div>
    );
}

export default EventDetails;
