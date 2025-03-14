// import React, { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const EditProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//   });

//   const auth = getAuth();
//   const db = getFirestore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         navigate("/login"); // Redirect if not logged in
//         return;
//       }

//       try {
//         // Step 1: Get logged-in user's email
//         const userEmail = user.email;

//         // Step 2: Query Firestore for the user's account
//         const accountsRef = collection(db, "approveCustomers");
//         const q = query(accountsRef, where("email", "==", userEmail));
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const docData = querySnapshot.docs[0]; // Assuming first matched record
//           setUserData({ id: docData.id, ...docData.data() });

//           // Prefill form with user data
//           setFormData({
//             fullName: docData.data().fullName,
//             email: docData.data().email,
//             phoneNumber: docData.data().phoneNumber,
//             address: docData.data().address,
//           });
//         } else {
//           console.log("No account found for this email.");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }

//       setLoading(false);
//     };

//     fetchUserData();
//   }, [auth, db, navigate]);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userData) {
//       alert("User data not found!");
//       return;
//     }

//     try {
//       const userDocRef = doc(db, "approveCustomers", userData.id);
//       await updateDoc(userDocRef, formData);
//       alert("Profile updated successfully!");
//       navigate("/profile"); // Redirect to Profile page after updating
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile. Please try again.");
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;

//   return (
//     <div className="edit-profile-container" style={{ padding: "20px", background: "#1E293B", color: "white", borderRadius: "10px", maxWidth: "400px", margin: "auto" }}>
//       <h2>Edit Profile</h2>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//         <label>
//           Name:
//           <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
//         </label>

//         <label>
//           Email:
//           <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
//         </label>

//         <label>
//           Phone Number:
//           <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={inputStyle} />
//         </label>

//         <label>
//           Address:
//           <textarea name="address" value={formData.address} onChange={handleChange} required style={{ ...inputStyle, height: "60px" }} />
//         </label>

//         <button type="submit" style={buttonStyle}>Save Changes</button>
//         <button type="button" onClick={() => navigate("/profile")} style={{ ...buttonStyle, background: "#6B7280" }}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// // Inline Styles
// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   borderRadius: "5px",
//   border: "none",
//   marginTop: "5px",
//   fontSize: "16px",
// };

// const buttonStyle = {
//   padding: "10px",
//   background: "#3B82F6",
//   color: "white",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontSize: "16px",
// };

// export default EditProfile;
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const EditProfile = () => {
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
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
          const accounts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserAccounts(accounts);

          // Prefill form with the first matching account
          setFormData({
            fullName: accounts[0].fullName,
            email: accounts[0].email,
            phoneNumber: accounts[0].phoneNumber,
            address: accounts[0].address,
          });
        } else {
          console.log("No account found for this email.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [auth, db, navigate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (update all matching accounts)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userAccounts.length === 0) {
      alert("User data not found!");
      return;
    }

    try {
      const updatePromises = userAccounts.map((account) => {
        const userDocRef = doc(db, "approveCustomers", account.id);
        return updateDoc(userDocRef, formData);
      });

      await Promise.all(updatePromises);

      alert("Profile updated successfully across all accounts!");
      navigate("/profile"); // Redirect to Profile page after updating
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="edit-profile-container" style={{ padding: "20px", background: "#1E293B", color: "white", borderRadius: "10px", maxWidth: "400px", margin: "auto" }}>
      <h2  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>Edit Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>
          Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
        </label>

        {/* <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} disabled />
        </label> */}

        <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>
          Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={inputStyle} />
        </label>

        <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>
          Address:
          <textarea name="address" value={formData.address} onChange={handleChange} required style={{ ...inputStyle, height: "60px" }} />
        </label>

        <button type="submit" style={buttonStyle}>Save Changes</button>
        <button type="button" onClick={() => navigate("/profile")} style={{ ...buttonStyle, background: "#6B7280" }}>Cancel</button>
      </form>
    </div>
  );
};

// Inline Styles
const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #64748b",  // Slight border for visibility
  marginTop: "5px",
  fontSize: "16px",
  backgroundColor: "#334155",  // Darker input background
  color: "#f8fafc",  // Light text inside input
  outline: "none"
};

const buttonStyle = {
  padding: "10px",
  background: "#3B82F6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default EditProfile;
