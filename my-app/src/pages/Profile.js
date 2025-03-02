import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile({ logoutUser }) {
  const userDetailsFromStorage = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [editing, setEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(userDetailsFromStorage);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');  
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email || (newPassword && !confirmPassword)) {
      setError('All fields are required when making changes.');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userDetails.email)) {
      setError('Invalid email format');
      return;
    }

    if (newPassword && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(newPassword)) {
      setError('Password must be strong: At least 8 characters, including a number, uppercase, lowercase, and special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const updatedDetails = newPassword ? { ...userDetails, password: newPassword } : userDetails;
    localStorage.setItem('userDetails', JSON.stringify(updatedDetails));
    setMessage('Profile updated successfully!');
    setError('');
    setEditing(false);
  };

  const handleDelete = () => {
    setShowModal(true); 
  };

  const confirmDelete = () => {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('isLoggedIn');
    alert("Profile Deleted"); 
    logoutUser();
    navigate('/');
    setShowModal(false); 
  };

  const enterEditMode = () => {
    setEditing(true);
    setError('');
  };

  const exitEditMode = () => {
    setEditing(false);
    setUserDetails(JSON.parse(localStorage.getItem('userDetails')));
    setError('');
  };

  const renderEditView = () => (
    <form onSubmit={handleEdit} className="profile-edit-form">
      <label htmlFor="name">Name</label>
      <input id="name" type="text" name="name" placeholder="Name" value={userDetails.name || ''} onChange={handleChange} />
      
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" placeholder="Email" value={userDetails.email || ''} onChange={handleChange} />
      
      <label htmlFor="password">New Password (leave blank to keep same password)</label>
      <input id="password" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      
      <label htmlFor="confirm-password">Confirm New Password</label>
      <input id="confirm-password" type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      
      {error && <p className="profile-error">{error}</p>}
      
      <div className="profile-buttons">
        <button type="submit" className="profile-save">Save Changes</button>
        <button type="button" onClick={exitEditMode} className="profile-cancel">Cancel</button>
      </div>
      {message && <p className="profile-message">{message}</p>}
    </form>
  );

  const renderDefaultView = () => (
    <div className="profile-info">
      <p><strong>Name:</strong> {userDetails.name}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Date of Joining:</strong> {userDetails.joiningDate}</p>
      <div className="profile-buttons">
        <button onClick={enterEditMode} className="profile-edit">Edit</button>
        <button onClick={handleDelete} className="profile-delete">Delete Profile</button>
      </div>
      {message && <p className="profile-message">{message}</p>}
    </div>
  );

  const renderModal = () => (
    showModal && (
      <div className="modal">
        <div className="modal-content">
          <p>Are you sure you want to delete your profile?</p>
          <button onClick={confirmDelete}>Yes, Delete it</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    )
  );

  return (
    <main className={editing ? "profile-editing" : "profile-viewing"}>
      <h1>{editing ? "Edit Profile" : "Profile"}</h1>
      {editing ? renderEditView() : renderDefaultView()}
      {renderModal()}
    </main>
  );
}

export default Profile;