// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import Navbar from "./components/Navbar";
// import CustomerManagement from "./pages/CustomerManagement";
// import LoanApplication from "./pages/LoanApplication";
// import Login from "./pages/Login";
// import Transactions from "./pages/Transactions";

// import "./App.css";

// const App = () => {
//   return (
//     <div>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/admin" element={<AdminDashboard />} />
       
//         <Route path="/customer-management" element={<CustomerManagement />} />
//         <Route path="/loan-application" element={<LoanApplication />} />
//         <Route path="/transactions" element={<Transactions />} />
//       </Routes>
//     </div>
//   );
// };

// // export default App;
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import CustomerManagement from "./pages/CustomerManagement";
// import LoanApplication from "./pages/LoanApplication";
// import Profile from "./pages/Profile";
// import Transactions from "./pages/Transactions";
// import CustomerHome from "./pages/CustomerHome"; // ✅ Import Customer Home
// import CreateAccount from "./pages/CreateAccount";
// import LoanCustomer from "./pages/LoanCustomer";
// import "./App.css";
// import EditProfile from "./EditProfile";

// const App = () => {
//   return (
//     <div>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />  
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/customer-home" element={<CustomerHome />} /> {/* ✅ Added CustomerHome */}
//         <Route path="/create-account" element={<CreateAccount />} /> {/* New route */}
//         <Route path="/customer-management" element={<CustomerManagement />} />
//         <Route path="/loan-application" element={<LoanApplication />} />
//         <Route path="/loan-customer" element={<LoanCustomer />} />
//         <Route path="/profile" element={<Profile />} /> 
//         <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
//         <Route path="/transactions" element={<Transactions />} />
//       </Routes>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CustomerManagement from "./pages/CustomerManagement";
import LoanApplication from "./pages/LoanApplication";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import CustomerHome from "./pages/CustomerHome";
import CreateAccount from "./pages/CreateAccount";
import LoanCustomer from "./pages/LoanCustomer";
import EditProfile from "./pages/EditProfile";

import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer-home" element={user ? <CustomerHome /> : <Navigate to="/login" />} />
        <Route path="/create-account" element={user ? <CreateAccount /> : <Navigate to="/login" />} />
        <Route path="/customer-management" element={user ? <CustomerManagement /> : <Navigate to="/login" />} />
        <Route path="/loan-application" element={user ? <LoanApplication /> : <Navigate to="/login" />} />
        <Route path="/loan-customer" element={user ? <LoanCustomer /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
