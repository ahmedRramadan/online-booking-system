import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../app/utils/firebase';
import Ticket from '@/components/Ticket';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../../app/globals.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Nbar from '@/components/Navbar';

const TicketPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchTicketData = async () => {
        try {
          const ticketRef = doc(db, 'tickets', id);
          const ticketSnap = await getDoc(ticketRef);

          if (ticketSnap.exists()) {
            const ticketDetails = ticketSnap.data();

            // Fetch event details
            const eventRef = doc(db, 'events', ticketDetails.eventId);
            const eventSnap = await getDoc(eventRef);

            if (eventSnap.exists()) {
              const eventDetails = eventSnap.data();

              // Fetch user details
              const userRef = doc(db, 'users', ticketDetails.userId);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                const userDetails = userSnap.data();

                // Convert Firestore timestamps to date strings with time
                eventDetails.startDate = eventDetails.startDate.toDate().toLocaleString();
                eventDetails.endDate = eventDetails.endDate.toDate().toLocaleString();

                setTicketData({ ...ticketDetails, event: eventDetails, user: userDetails });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching ticket data:', error);
        }
        setLoading(false);
      };

      fetchTicketData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticketData) {
    return <div>Ticket not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <Ticket property={ticketData.event} user={ticketData.user} />
      </div>
      <Footer />
    </div>
  );
};

export default TicketPage;