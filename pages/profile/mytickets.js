import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../app/globals.css';
import Nbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, 'tickets'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const ticketList = await Promise.all(querySnapshot.docs.map(async (ticketDoc) => {
          const data = ticketDoc.data();
          const eventId = data.eventId;
          let eventDoc, providerDoc;
          try {
            eventDoc = await getDoc(doc(db, 'events', eventId));
          } catch (error) {
            console.error("Error fetching event document:", error);
            return null;
          }
          try {
            providerDoc = await getDoc(doc(db, 'users', eventDoc.data().userId));
          } catch (error) {
            console.error("Error fetching provider document:", error);
            return null;
          }
          return {
            id: ticketDoc.id,
            ...data,
            eventName: eventDoc.data().name,
            providerName: providerDoc.data().orgName
          };
        }));

        setTickets(ticketList.filter(ticket => ticket !== null));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleCancel = async (ticketId) => {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      Swal.fire({
        title: 'Success!',
        text: 'Ticket cancelled successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to cancel the ticket.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='profile-page-section'>
       <Nbar/>
      <div className="profile-page container" style={{marginTop:'100px'}}>
      <nav className="nav nav-borders">
        <a className="nav-link " href="/profile" rel="noopener noreferrer">Profile</a>
        <a className="nav-link" href="/profile/security" rel="noopener noreferrer">Security</a>
        <a className="nav-link" href="/profile/myevents"  rel="noopener noreferrer">My events</a>
        <a className="nav-link active" href="/profile/mytickets"  rel="noopener noreferrer">My tickets</a>
        <a className="nav-link" href="/addevent" rel="noopener noreferrer">Create event</a>
      </nav>
        {user ? (
          <table className="table table-striped table-dark mt-4">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Provider Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.eventName}</td>
                  <td>{ticket.providerName}</td>
                  <td>
                    <button className="btn btn-danger col-6" onClick={() => handleCancel(ticket.id)}>Cancel</button>
                    <button className="btn btn-primary col-6" onClick={() => window.location.href = `/tickets/${ticket.id}`}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You need to be logged in to view your tickets.</p>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
