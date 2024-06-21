import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../app/globals.css';
const Payment = () => {
  const router = useRouter();
  const { eventId, price } = router.query;
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (price) {
          initiatePayment(currentUser.uid, eventId, price);
        } else {
          console.error('Price is missing');
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, eventId, price, router]);

  const initiatePayment = async (userId, eventId, price) => {
    try {
      const response = await axios.post('/api/paymob-init', {
        userId,
        eventId,
        price,
      });
      setPaymentUrl(response.data.paymentUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error initiating payment:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className='profile-page-section'>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Payment</h2>
        {price && (
          <div className="text-center mb-4">
            <h3>Price: {price} EG</h3>
          </div>
        )}
        {paymentUrl ? (
          <iframe src={paymentUrl} width="100%" height="800px" frameBorder="0"></iframe>
        ) : (
          <div>Failed to initiate payment.</div>
        )}
      </div>
    </div>
  );
};

export default Payment;