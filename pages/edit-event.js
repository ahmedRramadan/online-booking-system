import '../app/globals.css';
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, db, storage } from '../app/utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

// استيراد مكون الخريطة ديناميكيًا مع تعطيل SSR
const MapWithNoSSR = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function EditEvent() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [event, setEvent] = useState({
    name: '',
    description: '',
    address: '',
    isPaid: false,
    price: '',
    backgroundColor: 'rgb(222, 217, 217)',
    textColor: '#000000',
    backgroundImage: '',
    size: 'medium',
    country: '',
    startDate: '',
    endDate: '',
    location: { lat: 26.8206, lng: 30.8025 },
    id: ''
  });

  const router = useRouter();
  const { id } = router.query;
  const auth = getAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, 'events', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const eventData = docSnap.data();
        setEvent({
          ...eventData,
          startDate: eventData.startDate.toDate(),
          endDate: eventData.endDate.toDate(),
        });
        setStartDate(eventData.startDate.toDate());
        setEndDate(eventData.endDate.toDate());
        setImages(eventData.images || []);
        setLoading(false);
      } else {
        console.log("No such document!");
      }
    };

    if (id) {
      fetchEvent();
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [id, auth, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLocationChange = (location) => {
    setEvent(prevEvent => ({
      ...prevEvent,
      location,
    }));
    console.log("Location set:", location);
  };

  const handleDateChange = (name, date) => {
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.log('No user logged in');
      return;
    }

    const imagesUrls = await Promise.all(
      images.map(async (imageSrc) => {
        if (imageSrc.startsWith('http')) {
          return imageSrc;
        }
        const imageName = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const fileRef = ref(storage, `events/${imageName}`);
        await uploadBytes(fileRef, blob);
        return getDownloadURL(fileRef);
      })
    );

    const updatedEvent = {
      ...event,
      images: imagesUrls
    };

    const eventRef = doc(db, 'events', id);
    await updateDoc(eventRef, updatedEvent);

    Swal.fire({
      title: 'Event Updated Successfully!',
      text: 'Your event has been updated.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagesArray = files.map(file => URL.createObjectURL(file));
    setImages(imagesArray);
  };

  const [ticket, setTicket] = useState({
    backgroundColor: '#ffffff',
    color: '#000000',
    size: 'medium',
    backgroundImage: ''
  });

  const getTicketStyle = (event) => {
    let dimensions = {};
    switch (event.size) {
      case 'small':
        dimensions = { width: '300px', height: '100px' };
        break;
      case 'medium':
        dimensions = { width: '500px', height: '200px' };
        break;
      case 'large':
        dimensions = { width: '700px', height: '400px' };
        break;
      default:
        dimensions = {};
    }

    return {
      ...dimensions,
      backgroundColor: event.backgroundColor,
      color: event.textColor,
      backgroundImage: `url(${event.backgroundImage})`,
      backgroundSize: 'cover',
      margin: '40px auto',
      padding: '20px',
      textAlign: 'center',
    };
  };

  const ticketStyle = getTicketStyle(event);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='add-event-section'>
      <Navbar />
      <div className='container card' style={{marginTop:'140px'}}>
        <div className='card-header'>Edit Event</div>
        <div className='card-body'>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className='row'>
            <div className='col-6 my-3'>
              <label htmlFor="name">Event Title</label>
              <input
                type="text"
                id="name"
                name="name"
                value={event.name}
                onChange={handleChange}
              />
            </div>
            <div className='col-6 my-3'>
              <label htmlFor="description">Event Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={event.description}
                onChange={handleChange}
              />
            </div>
            <div className='col-6 my-3'>
              <label htmlFor="country">Event Country</label>
              <select id="country" name="country" className="form-control" value={event.country} onChange={handleChange}>
                <option value="Egypt">Egypt</option>
                <option value="Afghanistan">Afghanistan</option>
                {/* Add other countries as needed */}
              </select>
            </div>
            <div className='col-6 my-3'>
              <label htmlFor="address">Event Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={event.address}
                onChange={handleChange}
              />
            </div>
            <div className='col-3 my-3'>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                Paid?
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={event.isPaid}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='col-3 my-3'>
              {event.isPaid && (
                <div style={{marginTop: "0"}}>
                  <label htmlFor="price">Event Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={event.price}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group col-3 my-3">
              <label htmlFor="startDate">Event Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  handleDateChange('startDate', date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                id="startDate"
              />
            </div>
            <div className="form-group col-3 my-3">
              <label htmlFor="endDate">Event End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  handleDateChange('endDate', date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                id="endDate"
              />
            </div>
            <div className="form-group col-12 my-3">
              <label htmlFor="chatData">Chat Bot Help Data</label>
              <textarea
                type="text"
                id="chatData"
                name="chatData"
                value={event.chatData}
                onChange={handleChange}
              />
            </div>
            <div className='col-12 m-3'>
              <label htmlFor="location">Location</label>
              <MapWithNoSSR onLocationChange={handleLocationChange} />
            </div>
            <div className='col-3 my-3'>
              <label htmlFor="backgroundColor">Ticket Background Color</label>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={event.backgroundColor}
                onChange={handleChange}
              />
            </div>
            <div className='col-3 my-3'>
              <label htmlFor="textColor">Ticket Text Color</label>
              <input
                type="color"
                id="textColor"
                name="textColor"
                value={event.textColor}
                onChange={handleChange}
              />
            </div>
            <div className='col-6 my-3'>
              <label htmlFor="backgroundImage">Background Image Link</label>
              <input
                type="text"
                id="backgroundImage"
                name="backgroundImage"
                placeholder="URL Image"
                value={event.backgroundImage}
                onChange={handleChange}
              />
            </div>
            <div className="container mt-3">
              <label htmlFor="image-upload" className="btn mb-3">
                Upload Event Images <FontAwesomeIcon icon={faImages} className='golden-color' />
                <input
                  type="file"
                  id="image-upload"
                  name="files"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              <div className="row">
                {images.map((image, index) => (
                  <div className="col-12 col-sm-6 col-md-4 mt-2" key={index}>
                    <img src={image} alt={`event-img-${index}`} className="img-thumbnail" />
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className='btn btn-primary'>Save Changes</button>
          </form>
          <div style={ticketStyle} className='ticket-card'>
            <h2 className='h4'>{event.name}</h2>
            <div className='qrcode-add-section'></div>
            <div className='ticket-description'>{event.description}</div>
            <div className='ticket-time-address'>
              <p className='ticket-time p'>From {startDate.toLocaleDateString()} To {endDate.toLocaleDateString()}</p>
              <p className='ticket-time p'>Address: {event.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
