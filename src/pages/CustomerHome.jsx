import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CustomerHome.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Customer Dashboard</h1>
      <div style={{ margin: "20px 0" }}>
      <button onClick={() => navigate("/profile")} style={{ display: "block", margin: "10px", padding: "10px", width: "200px" }}>
          View Profile
        </button>
        <button onClick={() => navigate("/edit-profile")} style={{ display: "block", margin: "10px", padding: "10px", width: "200px" }}>
         Edit Profile
        </button>
        <button onClick={() => navigate("/create-account")} style={{ display: "block", margin: "10px", padding: "10px", width: "200px" }}>
          Create Bank Account
        </button>
        <button onClick={() => navigate("/transactions")} style={{ display: "block", margin: "10px", padding: "10px", width: "200px" }}>
          Transactions
        </button>
        <button onClick={() => navigate("/loan-customer")} style={{ display: "block", margin: "10px", padding: "10px", width: "200px" }}>
          Loan Application
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
