import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../app/globals.css';
import Navbar from '@/components/Navbar';
import Swal from 'sweetalert2';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, 'events'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const eventsList = await Promise.all(querySnapshot.docs.map(async (eventDoc) => {
          const data = eventDoc.data();
          const ticketsQuery = query(collection(db, 'tickets'), where('eventId', '==', eventDoc.id));
          const ticketsSnapshot = await getDocs(ticketsQuery);
          
          let creationDate = 'Unknown';
          if (data.createdAt && data.createdAt.toDate) {
            creationDate = data.createdAt.toDate().toISOString().split('T')[0];
          }

          return {
            id: eventDoc.id,
            ...data,
            creationDate,
            ticketsCount: ticketsSnapshot.size,
          };
        }));
        setEvents(eventsList);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleDelete = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      setEvents(events.filter(event => event.id !== eventId));
      Swal.fire({
        title: 'Success!',
        text: 'Event deleted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the event.',
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
    <Navbar />
      <div className="container profile-page" style={{marginTop:'100px'}}>
      <nav className="nav nav-borders">
        <a className="nav-link " href="/profile" rel="noopener noreferrer">Profile</a>
        <a className="nav-link" href="/profile/security" rel="noopener noreferrer">Security</a>
        <a className="nav-link active" href="/profile/myevents"  rel="noopener noreferrer">My events</a>
        <a className="nav-link " href="/profile/mytickets"  rel="noopener noreferrer">My tickets</a>
        <a className="nav-link" href="/addevent" rel="noopener noreferrer">Create event</a>
      </nav>
        {user ? (
          <table className="table table table-striped table-dark mt-4">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Creation Date</th>
                <th>Tickets Booked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.creationDate}</td>
                  <td>{event.ticketsCount}</td>
                  <td>
                  <button className="btn btn-primary col-6" onClick={() => window.location.href = `/edit-event?id=${event.id}`}>Edit</button>
                  <button className="btn btn-danger col-6" onClick={() => handleDelete(event.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You need to be logged in to view your events.</p>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
