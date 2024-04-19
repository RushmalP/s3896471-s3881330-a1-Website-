import React from 'react';

function Profile() {
  // Assume user details and the date of joining are stored in localStorage
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const joiningDate = userDetails?.joiningDate; // Replace with your actual joining date key

  return (
    <main>
      <h1>Profile</h1>
      {userDetails ? (
        <div>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          {/* Display other user details as needed */}
          {joiningDate && <p>Date of Joining: {joiningDate}</p>}
        </div>
      ) : (
        <p>No user details found. Please sign in.</p>
      )}
    </main>
  );
}

export default Profile;
