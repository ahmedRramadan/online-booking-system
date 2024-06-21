import React from 'react';
import QRCode from 'qrcode.react'; // تأكد من تثبيت المكتبة
import { toPng } from 'html-to-image'; // تأكد من تثبيت المكتبة
import { auth } from '@/app/utils/firebase';

const Ticket = ({ property }) => {
  const user = auth.currentUser;

  // طباعة معرف المستخدم للتأكد من أنه يتم تمريره بشكل صحيح
  console.log('User UID:', user.uid);

  // توليد فريد لرمز QR باستخدام معرف التذكرة
  const ticketId = `${user.uid}_${property.id}_${new Date().toISOString()}`;
  const qrData = ticketId;

  const handleDownload = () => {
    const ticketElement = document.getElementById('ticket-to-download');
    toPng(ticketElement, { cacheBust: true, width: ticketElement.scrollWidth, height: ticketElement.scrollHeight })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${property.name}-ticket.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  };

  return (
    <>
      <div className="ticket-container" id="ticket-to-download">
        <div className="ticket-card" style={{ backgroundColor: property.backgroundColor, color: property.textColor, backgroundImage: `url(${property.backgroundImage})`, padding: '20px', borderRadius: '10px' }}>
          <h2>{property.name}</h2>
          <div className="qrcode-add-section" style={{ textAlign: 'center', margin: '20px 0' }}>
            <QRCode value={qrData} size={128} level={"H"} />
          </div>
          <div className="ticket-description">{property.description}</div>
          <div className="ticket-time-address">
            <p>from {property.startDate} to {property.endDate}</p>
            <p>address: {property.address}</p>
          </div>
        </div>
      </div>
      <button onClick={handleDownload} style={{ backgroundColor: "var(--darken-color)", display: 'block', margin: '10px auto' }} className="w-fit">Download Ticket</button>
    </>
  );
};

export default Ticket;