import '../app/globals.css';
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { StrictMode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { auth, db, storage } from '../app/utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '@/components/Navbar';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';


// استيراد مكون الخريطة ديناميكيًا مع تعطيل SSR
const MapWithNoSSR = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p> // هذا اختياري: يمكنك عرض نص التحميل هنا
});

export default function AddEvent() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [images, setImages] = useState([]);

  const [event, setEvent] = useState({
    name: 'event Name',
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
    numberOfTicketsAvailable:'',
    location: { lat: 26.8206, lng: 30.8025 },
    id:''
  });
  
  const router = useRouter();
    const auth = getAuth();
   

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (!user) {
                // إذا لم يكن المستخدم مسجل الدخول، يتم إعادة توجيهه إلى صفحة تسجيل الدخول
                router.push('/login');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth, router]);


const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setEvent(prevEvent => ({
    ...prevEvent,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const handleLocationChange = (location) => {
  // Update event state with new location
  setEvent(prevEvent => ({
    ...prevEvent,
    location,
  }));

  // Log the location to the console to verify its value
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

  // يفترض أن 'images' تحتوي على قائمة بملفات الصور المحددة
  const imagesUrls = await Promise.all(
    images.map(async (imageSrc) => {
      const imageName = imageSrc.substring(imageSrc.lastIndexOf('/') + 1); // افتراض تحديد اسم الملف من URL
      const response = await fetch(imageSrc);
      const blob = await response.blob(); // تحويل الصورة من URL إلى blob للرفع
      const fileRef = ref(storage, `events/${imageName}`);
      await uploadBytes(fileRef, blob);
      return getDownloadURL(fileRef);
    })
  );

  const newEvent = {
    ...event,
    userId: user.uid,
    images: imagesUrls
  };

  const eventRef = doc(db, "events", `${user.uid}_${new Date().toISOString()}`);
  await setDoc(eventRef, { ...newEvent, id: eventRef.id }); 

  Swal.fire({
      title: 'Event Created Successfully!',
    html: `Your event has been created. Click <a href='/events/${eventRef.id}' target='_blank'>here</a> to view your event.`,
    icon: 'success',
    confirmButtonText: 'Ok'
  });
};

    const handleImageChange = (e) => {
      // التعامل مع ملفات الصور
      const files = Array.from(e.target.files);
      const imagesArray = files.map(file => {
          return URL.createObjectURL(file);
      });
      setImages(imagesArray);
  };

    const [ticket, setTicket] = useState({
      backgroundColor: '#ffffff', // قيمة ابتدائية للون الخلفية
      color: '#000000', // قيمة ابتدائية للون النص
      size: 'medium', // قيمة ابتدائية لحجم التذكرة
      backgroundImage: '' // رابط صورة الخلفية
  });


// تعديل دالة getTicketStyle لتضمين الأسلوب الكامل
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

  const handleTicketChange = (e) => {
      const { name, value } = e.target;
      setTicket(prevTicket => ({
          ...prevTicket,
          [name]: value
      }));
  };



    return (
      <div className='add-event-section'>
      <Navbar />
      <div className='container card' style={{marginTop:'140px'}}>
        <div className='card-header'>Add Event</div>
        <div className='card-body'>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className='row'>
          <div className='col-6 my-3'>
            <label htmlFor="name">event title</label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={event.name}
                  onChange={handleChange}
              />
          </div>
            <div className='col-6 my-3'>
              <label htmlFor="description">event description</label>
              <input
                  type="text"
                  id="description"
                  name="description"
                  value={event.description}
                  onChange={handleChange}
              />
            </div>
            <div className='col-6 my-3'>
            <label htmlFor="address">event country</label>
            <select id="country" name="country" class="form-control" onChange={handleChange}>
                <option value="Egypt">Egypt</option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Åland Islands">Åland Islands</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote D'ivoire">Cote D'ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Territories">French Southern Territories</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guernsey">Guernsey</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-bissau">Guinea-bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jersey">Jersey</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                <option value="Korea, Republic of">Korea, Republic of</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macao">Macao</option>
                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                <option value="Moldova, Republic of">Moldova, Republic of</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Netherlands Antilles">Netherlands Antilles</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russian Federation">Russian Federation</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Helena">Saint Helena</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-leste">Timor-leste</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Viet Nam">Viet Nam</option>
                <option value="Virgin Islands, British">Virgin Islands, British</option>
                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                <option value="Wallis and Futuna">Wallis and Futuna</option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
            </select>
            </div>
            <div className='col-6 my-3'>
            <label htmlFor="address">event address</label>
            <input
                type="text"
                id="address"
                name="address"
                value={event.address}
                onChange={handleChange}
            />
            </div>
            <div className='col-3 my-3'>
            <label >
              paid?
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
                 <label htmlFor="price">event price</label>
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
  <label htmlFor="start-date">Event start date</label>
  <DatePicker
    selected={startDate}
    onChange={(date) => {
      setStartDate(date);
      handleDateChange('startDate', date);
    }}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    dateFormat="dd/MM/yyyy h:mm aa"
    className="form-control"
    id="startDate"
  />
</div>
<div className="form-group col-3 my-3">
  <label htmlFor="end-date">Event end date</label>
  <DatePicker
    selected={endDate}
    onChange={(date) => {
      setEndDate(date);
      handleDateChange('endDate', date);
    }}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    dateFormat="dd/MM/yyyy h:mm aa"
    className="form-control"
    id="endDate"
  />
</div>
        <div className="form-group col-12 my-3">
          <label htmlFor="chat-data">Chat bot help data</label>
          <textarea
                type="text"
                id="chatData"
                name="chatData"
                value={event.chatData}
                onChange={handleChange}
            />
        </div>
        <div className='col-12 m-3'>
        <label htmlFor="location">location</label>
      <MapWithNoSSR onLocationChange={handleLocationChange} />
    </div>
           <div className='col-3 my-3'>
            <label htmlFor="backgroundColor">ticket background color</label>
            <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={event.backgroundColor}
                onChange={handleChange}
            />
           </div>
           <div className='col-3 my-3'>
        <label htmlFor="color">ticket text color</label>
        <input
            type="color"
            id="textColor"
            name="textColor"
            value={event.textColor}
            onChange={handleChange}
        />
          </div>
          
         
          <div className='col-3 my-3'>
          <label htmlFor="backgroundImage">Background image link</label>
<input
    type="text"
    id="backgroundImage"
    name="backgroundImage"
    placeholder="URL image"
    value={event.backgroundImage}
    onChange={handleChange}
/>
    </div>
    <div className='col-3 my-3'>
    <label htmlFor="numberOfTicketsAvilable">Number Of Tickets Available</label>
<input
    type="number"
    id="numberOfTicketsAvailable"
    name="numberOfTicketsAvailable"
    placeholder="Number Of Tickets Available"
    value={event.numberOfTicketsAvailable}
    onChange={handleChange}
/>

    </div>

          <div className="container mt-3">
            <label htmlFor="image-upload" className="btn mb-3">
              upload event images <FontAwesomeIcon icon={faImages} className='golden-color'  />
                <input
                    type="file"
                    id="image-upload"
                    name='files'
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
            <button type="submit" className='btn btn-primary'>Create Event</button>
        </form>

        <div style={ticketStyle} className='ticket-card'>
                <h2 className='h4'>{event.name}</h2>
                <div className='qrcode-add-section'></div>
                <div className='ticket-description'>{event.description}</div>
                  <div className='ticket-time-address'>
                  <p className='ticket-time p'>from {startDate.toLocaleDateString()} To {endDate.toLocaleDateString()}</p>
                  <p className='ticket-time p'>address: {event.address}</p>
                  </div>
            </div>
        </div>
        </div>
        </div>
    );
}
