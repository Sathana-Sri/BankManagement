// import React, { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserAccounts = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         navigate("/login"); // Redirect if not logged in
//         return;
//       }

//       try {
//         // Step 1: Get logged-in user's email
//         const userEmail = user.email;

//         // Step 2: Query Firestore for all accounts with the same email
//         const accountsRef = collection(db, "approveCustomers");
//         const q = query(accountsRef, where("email", "==", userEmail));
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const userAccounts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//           setAccounts(userAccounts);
//         } else {
//           console.log("No accounts found for this email.");
//         }
//       } catch (error) {
//         console.error("Error fetching user accounts:", error);
//       }

//       setLoading(false);
//     };

//     fetchUserAccounts();
//   }, [auth, db, navigate]);

//   if (loading) return <p>Loading profile...</p>;

//   return (
//     <div className="profile-container" style={{ padding: "20px", background: "#1E293B", color: "white" }}>
//       <h2>User Profile</h2>
//       {accounts.length > 0 ? (
//         accounts.map((account, index) => (
//           <div key={account.id} className="profile-section" style={{ border: "1px solid #fff", padding: "10px", margin: "10px 0" }}>
//             <h3>Account {index + 1}</h3>
//             <p><strong>Name:</strong> {account.fullName}</p>
//             <p><strong>Email:</strong> {account.email}</p>
//             <p><strong>Phone:</strong> {account.phoneNumber}</p>
//             <p><strong>Account Type:</strong> {account.acctype}</p>
//             <p><strong>Account Number:</strong> {account.accountNumber}</p>
//           </div>
//         ))
//       ) : (
//         <p>No profile data found.</p>
//       )}
//       <button onClick={() => navigate("/customer-home")}>Go Back</button>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login"); // Redirect if not logged in
        return;
      }

      try {
        // Step 1: Get logged-in user's email
        const userEmail = user.email;

        // Step 2: Query Firestore for all accounts with the same email
        const accountsRef = collection(db, "approveCustomers");
        const q = query(accountsRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userAccounts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAccounts(userAccounts);
        } else {
          console.log("No accounts found for this email.");
        }
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }

      setLoading(false);
    };

    fetchUserAccounts();
  }, [auth, db, navigate]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container" style={{ padding: "20px", background: "#1E293B", color: "white" }}>
      <h2>User Profile</h2>
      {accounts.length > 0 ? (
        <div className="profile-list" style={{ display: "flex", gap: "20px", overflowX: "auto", padding: "10px" }}>
          {accounts.map((account, index) => (
            <div key={account.id} className="profile-card" style={{ 
                border: "1px solid #fff", 
                padding: "15px", 
                minWidth: "300px",
                background: "#374151",
                borderRadius: "10px"
              }}>
              <h3>Account {index + 1}</h3>
              <p><strong>Name:</strong> {account.fullName}</p>
              <p><strong>Email:</strong> {account.email}</p>
              <p><strong>Phone:</strong> {account.phoneNumber}</p>
              <p><strong>Account Type:</strong> {account.acctype}</p>
              <p><strong>Account Number:</strong> {account.accountNumber}</p>
              <p><strong>Bank Balance:</strong> ₹{account.bankBalance}</p>
              <p><strong>PAN Card:</strong> {account.panCard}</p>
              <p><strong>Address:</strong> {account.address}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
      <button onClick={() => navigate("/customer-home")} style={{ marginTop: "10px", padding: "10px 15px", background: "#3B82F6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Go Back
      </button>
    </div>
  );
};

export default Profile;
