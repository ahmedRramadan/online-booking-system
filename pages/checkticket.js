import React, { useState } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Html5Qrcode } from 'html5-qrcode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/globals.css';

const CheckTicket = () => {
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setTicketInfo(null);
    setError(null);
  };

  const handleScanFile = async () => {
    if (!file) {
      setError('Please upload a QR code image first');
      return;
    }

    const html5QrCode = new Html5Qrcode("reader");
    try {
      const qrCodeMessage = await html5QrCode.scanFile(file, true);
      console.log('QR Code Data:', qrCodeMessage); // طباعة بيانات QR code
      handleScan(qrCodeMessage);
    } catch (err) {
      setError('Error scanning QR code');
    }
  };

  const handleScan = async (data) => {
    if (data) {
      const qrData = data.split('_').slice(0, -1).join('_'); // الحصول على الأجزاء التي تسبق التاريخ
      try {
        const db = getFirestore();
        const ticketsCollection = collection(db, 'tickets');
        const ticketsSnapshot = await getDocs(ticketsCollection);
        
        let ticketFound = false;
        ticketsSnapshot.forEach(docSnapshot => {
          const ticketData = docSnapshot.data();
          const storedQrData = ticketData.qrData.split('_').slice(0, -1).join('_'); // الحصول على الأجزاء التي تسبق التاريخ
          console.log('Comparing QR Code Data:', qrData, 'with stored QR Data:', storedQrData); // طباعة القيمتين للمقارنة
          
          if (storedQrData === qrData) {
            ticketFound = true;
            const userRef = doc(db, 'users', ticketData.userId);
            getDoc(userRef).then(userSnap => {
              if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log('User Data:', userData); // طباعة بيانات المستخدم
                const eventRef = doc(db, 'events', ticketData.eventId);
                getDoc(eventRef).then(eventSnap => {
                  if (eventSnap.exists()) {
                    const eventData = eventSnap.data();
                    console.log('Event Data:', eventData); // طباعة بيانات الحدث
                    setTicketInfo({
                      userName: userData.name,
                      eventName: eventData.name,
                      eventDate: `${eventData.startDate.toDate().toISOString().split('T')[0]} to ${eventData.endDate.toDate().toISOString().split('T')[0]}`,
                      bookedAt: ticketData.createdAt.toDate().toISOString().split('T')[0],
                    });
                    setError(null);
                  } else {
                    console.error('Event not found');
                    setError('Event not found');
                  }
                }).catch(err => {
                  console.error('Error fetching event information:', err);
                  setError('Error fetching event information');
                });
              } else {
                console.error('User not found');
                setError('User not found');
              }
            }).catch(err => {
              console.error('Error fetching user information:', err);
              setError('Error fetching user information');
            });
          }
        });

        if (!ticketFound) {
          setError('Ticket not found');
          setTicketInfo(null);
        }
      } catch (err) {
        console.error('Error fetching ticket information:', err);
        setError('Error fetching ticket information');
        setTicketInfo(null);
      }
    }
  };

  return (
    <div className='profile-page-section checkticket-page'>      
      <Navbar />
      <div className="container my-5" style={{marginTop:"115px !important"}}>
        <h2 className="text-center mb-4 text-dark mt-5">Check Ticket</h2>
        <div className="d-flex justify-content-center mb-3">
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
        </div>
        <div className="d-flex justify-content-center mb-5">
          <button onClick={handleScanFile} className="btn btn-primary">Scan QR Code</button>
        </div>
        <div id="reader" style={{ display: 'none' }}></div>
        {ticketInfo && (
          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-success">Ticket Valid</h4>
              <p className="card-text"><strong>User Name:</strong> {ticketInfo.userName}</p>
              <p className="card-text"><strong>Event Name:</strong> {ticketInfo.eventName}</p>
              <p className="card-text"><strong>Event Date:</strong> {ticketInfo.eventDate}</p>
              <p className="card-text"><strong>Booked At:</strong> {ticketInfo.bookedAt}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckTicket;
