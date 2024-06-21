
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../app/globals.css';
import Image from 'next/image';
import Nbar from '@/components/Navbar';
import Swal from 'sweetalert2';

const security = () => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);
      // Update password
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully.");
      setError('');
    } catch (error) {
      setError("Failed to update password: incorrect password");
      setSuccess('');
    }
  };


  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user).then(() => {
          Swal.fire(
            'Deleted!',
            'Your account has been deleted.',
            'success'
          );
          // Redirect to home or login page after account deletion
          // router.push('/login'); // If you are using Next.js and router
        }).catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete account',
            text: error.message,
          });
        });
      }
    });
  };

  
  return (
    <div className='profile-page-section' >
    <Nbar/>
     <div className="profile-page container" style={{marginTop:'100px'}}>
      <nav className="nav nav-borders">
        <a className="nav-link ms-0" href="/profile" rel="noopener noreferrer">Profile</a>
        <a className="nav-link active" href="/profile/security" rel="noopener noreferrer">Security</a>
        <a className="nav-link" href="/profile/myevents" rel="noopener noreferrer">My events</a>
        <a className="nav-link" href="/profile/mytickets"  rel="noopener noreferrer">My tickets</a>
        <a className="nav-link" href="/addevent" rel="noopener noreferrer">Create event</a>
      </nav>
      <div className="card mb-4">
    <div className="card-header">Change Password</div>
    <div className="card-body">
    <div>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{"backgroundColor":"var(--darken-color)"}}>Change Password</button>
      </form>
      {success && <p style={{ color: 'green', marginTop:'20px' }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop:'20px' }}>{error}</p>}
    </div>
    </div>
  </div>
  <div class="card mb-4">
                    <div class="card-header">Delete Account</div>
                    <div class="card-body">
                        <p>Deleting your account is a permanent action and cannot be undone. If you are sure you want to delete your account, select the button below.</p>
                        <button className="btn btn-danger text-white" type="button" onClick={handleDeleteAccount}>I understand, delete my account</button>
                    </div>
                </div>
      </div>
    </div>

  );
};

export default security;
