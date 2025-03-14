
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import "./Login.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log("User already logged in:", user.email);
//         navigate(user.email === "sathanasri312@gmail.com" ? "/admin" : "/customer-home");
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       alert("Login Successful!");
//       navigate(user.email === "sathanasri312@gmail.com" ? "/admin" : "/customer-home");
//     } catch (err) {
//       if (err.code === "auth/user-not-found") {
//         setError("User not found. Please sign up.");
//       } else if (err.code === "auth/wrong-password") {
//         setError("Incorrect password. Try again.");
//       } else {
//         setError("Login failed. Please check your credentials.");
//         setError("If new user signup");
//       }
//     }
//   };

//   return (
//     <div className="login-container">
     
//       <h2>Login</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       <p onClick={() => navigate("/signup")}>Don't have an account? Sign Up</p>
//     </div>
//   );
// };

// // ✅ Export the component at the bottom
// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Login.css";

const Login = () => {
  const [emailOrCustomerId, setEmailOrCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User already logged in:", user.email);
        navigate(user.email === "sathanasri312@gmail.com" ? "/admin" : "/customer-home");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Function to get email from Firestore using Customer ID
  const getEmailFromCustomerId = async (customerId) => {
    try {
      const q = query(collection(db, "approveCustomers"), where("customerId", "==", customerId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().email; // Get the email from Firestore
      }
      return null;
    } catch (error) {
      console.error("Error fetching email:", error);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let email = emailOrCustomerId;

      // If user enters a Customer ID, fetch the associated email
      if (!email.includes("@")) {
        email = await getEmailFromCustomerId(emailOrCustomerId);
        if (!email) {
          setError("Customer ID not found.");
          return;
        }
      }

      // Sign in with the retrieved email
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Login Successful!");
      navigate(user.email === "sathanasri312@gmail.com" ? "/admin" : "/customer-home");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter Email or Customer ID"
          value={emailOrCustomerId}
          onChange={(e) => setEmailOrCustomerId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p onClick={() => navigate("/signup")}>Don't have an account? Sign Up</p>
    </div>
  );
};

export default Login;
