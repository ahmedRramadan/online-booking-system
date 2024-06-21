import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../app/utils/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../app/globals.css';
import Image from 'next/image';
import Nbar from '@/components/Navbar';
import Swal from 'sweetalert2';

const Profile = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const [userDetails, setUserDetails] = useState({
    username: '',
    firstName: '',
    lastName: '',
    orgName: '',
    location: '',
    emailAddress: '',
    phone: '',
    profilePicture: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { ...userDetails }, { merge: true });
      Swal.fire({
        title: 'Your profile has been updated successfully!',
        icon: 'success',
        confirmButtonText: 'continue',
      });
    } else {
      console.error("No user logged in");
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      profilePicture: photoURL,
    }));
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { profilePicture: photoURL });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className='profile-page-section'>
      <Nbar />
      <div className="profile-page container mp-5" style={{ marginTop: '100px' }}>
        <nav className="nav nav-borders">
          <a className="nav-link active ms-0" href="/profile" rel="noopener noreferrer">Profile</a>
          <a className="nav-link" href="/profile/security" rel="noopener noreferrer">Security</a>
          <a className="nav-link" href="/profile/myevents" rel="noopener noreferrer">My events</a>
          <a className="nav-link" href="/profile/mytickets" rel="noopener noreferrer">My tickets</a>
          <a className="nav-link" href="/addevent" rel="noopener noreferrer">Create event</a>
        </nav>
        <hr className="mt-0 mb-4" />
        <div className="row">
          <div className="col-xl-4">
            {/* Profile picture card */}
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
                {/* Profile picture image */}
                {userDetails.profilePicture ? (
                  <img
                    className="img-account-profile rounded-circle mb-2"
                    src={userDetails.profilePicture}
                    alt="Profile"
                    style={{ width: 100, height: 100, borderRadius: '50%' }}
                  />
                ) : (
                  <Image
                    className="img-account-profile rounded-circle mb-2"
                    src="http://bootdey.com/img/Content/avatar/avatar1.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                )}
                {/* Profile picture help block */}
                <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                {/* Profile picture upload button - hidden input field */}
                <label htmlFor="profilePictureUpload" className="btn btn-primary">
                  Upload new image
                </label>
                <input
                  id="profilePictureUpload"
                  type="file"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            {/* Account details card */}
            <div className="card mb-4">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                    <input
                      className="form-control"
                      id="inputUsername"
                      type="text"
                      placeholder="Enter your username"
                      name="username"
                      value={userDetails.username || ''}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Form Row for first name and last name */}
                  <div className="row gx-3 mb-3">
                    {/* Form Group (first name) */}
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputFirstName">First name</label>
                      <input
                        className="form-control mb-3"
                        id="inputFirstName"
                        type="text"
                        placeholder="Enter your first name"
                        name="firstName"
                        value={userDetails.firstName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Form Group (last name) */}
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputLastName">Last name</label>
                      <input
                        className="form-control mb-3"
                        id="inputLastName"
                        type="text"
                        placeholder="Enter your last name"
                        name="lastName"
                        value={userDetails.lastName || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Form Row for organization name and location */}
                  <div className="row gx-3 mb-3">
                    {/* Form Group (organization name) */}
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputOrgName">Organization name</label>
                      <input
                        className="form-control mb-3"
                        id="inputOrgName"
                        type="text"
                        placeholder="Enter your organization name"
                        name="orgName"
                        value={userDetails.orgName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Form Group (location) */}
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputLocation">Location</label>
                      <input
                        className="form-control mb-3"
                        id="inputLocation"
                        type="text"
                        placeholder="Enter your location"
                        name="location"
                        value={userDetails.location || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Form Group (email address) */}
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                    <input
                      className="form-control mb-3"
                      id="inputEmailAddress"
                      type="email"
                      disabled
                      placeholder="Enter your email address"
                      name="emailAddress"
                      value={userDetails.emailAddress || 'ahmedrramdaan@gmail.com'}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                      <input
                        className="form-control mb-3"
                        id="inputPhone"
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone"
                        value={userDetails.phone || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Save changes button */}
                  <button className="btn btn-primary" type="submit">Save changes</button>
                </form>
                <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
