import React, { useState } from 'react';
import { db } from '../app/utils/firebase' // تأكد من استيراد db بشكل صحيح
import { collection, addDoc } from "firebase/firestore"; 


export default function Contact() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: new Date(),
      });
      setSuccessMessage('Your message was sent successfully!');
      setErrorMessage(''); // تأكد من مسح أية رسائل خطأ سابقة
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setErrorMessage('An error occurred while sending your message. Please try again.');
      setSuccessMessage(''); // مسح أية رسائل نجاح سابقة
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="contact-section" id="contact-section">
      <div className="container my-5" >
      <h2 className="mb-4 text-center">Contact Us</h2>
      <form className="row" onSubmit={handleSubmit}>
        <div className="mb-3 col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3 col-sm-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3 col-sm-4">
          <input
            type="tel"
            className="form-control"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" className="btn w-auto" style={{ backgroundColor: 'var(--darken-color)', color: 'white' }}>
            Send
          </button>
        </div>
      </form>
      {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
{errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
      </div>
    </div>
  );
}
