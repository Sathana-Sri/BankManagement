// import React, { useState, useEffect } from "react";
// import { db } from "../firebase/firebaseconfig";
// import { collection, addDoc } from "firebase/firestore";

// const BankAccountForm = () => {
//   const [formData, setFormData] = useState({
//     customerId: "",
//     accountNumber: "",
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     panCard: "",
//     aadhaarNumber: "",
//     bankBalance: 1000, // Default balance
//     status: "Pending", // Default status
//   });

//   const [errors, setErrors] = useState({});

//   // Generate Customer ID and Account Number when component loads
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       customerId: Math.floor(1000 + Math.random() * 9000).toString(), // 4-digit customer ID
//       accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(), // 12-digit account number
//     }));
//   }, []);

//   const validateInput = (name, value) => {
//     let error = "";
//     switch (name) {
//       case "fullName":
//         if (!/^[a-zA-Z\s]{1,50}$/.test(value)) error = "Only letters allowed, max 50 characters.";
//         break;
//       case "email":
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format.";
//         break;
//       case "phoneNumber":
//         if (!/^\d{10}$/.test(value)) error = "Phone number must be 10 digits.";
//         break;
//       case "panCard":
//         if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) error = "Invalid PAN format (ABCDE1234F).";
//         break;
//       case "aadhaarNumber":
//         if (!/^\d{12}$/.test(value)) error = "Aadhaar must be a 12-digit number.";
//         break;
//       case "address":
//         if (value.trim().length < 5) error = "Address must be at least 5 characters long.";
//         break;
//       default:
//         break;
//     }
//     return error;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const error = validateInput(name, value);
//     setErrors({ ...errors, [name]: error });
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let isValid = true;
//     let newErrors = {};

//     Object.keys(formData).forEach((key) => {
//       const error = validateInput(key, formData[key]);
//       if (error) {
//         newErrors[key] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     if (!isValid) return;

//     try {
//       await addDoc(collection(db, "customers"), formData);
//       alert("Bank Account Created Successfully!");
//       // Reset form
//       setFormData({
//         customerId: Math.floor(1000 + Math.random() * 9000).toString(),
//         accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
//         fullName: "",
//         email: "",
//         phoneNumber: "",
//         address: "",
//         panCard: "",
//         aadhaarNumber: "",
//         bankBalance: 1000,
//         status: "Pending",
//       });
//       setErrors({});
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Create Bank Account</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Customer ID</label>
//           <input type="text" value={formData.customerId} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Account Number</label>
//           <input type="text" value={formData.accountNumber} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Full Name</label>
//           <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
//           {errors.fullName && <span className="error">{errors.fullName}</span>}
//         </div>
//         <div className="form-group">
//           <label>Email</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//           {errors.email && <span className="error">{errors.email}</span>}
//         </div>
//         <div className="form-group">
//           <label>Phone Number</label>
//           <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
//           {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
//         </div>
//         <div className="form-group">
//           <label>Address</label>
//           <input type="text" name="address" value={formData.address} onChange={handleChange} required />
//           {errors.address && <span className="error">{errors.address}</span>}
//         </div>
//         <div className="form-group">
//           <label>PAN Card</label>
//           <input type="text" name="panCard" value={formData.panCard} onChange={handleChange} required />
//           {errors.panCard && <span className="error">{errors.panCard}</span>}
//         </div>
//         <div className="form-group">
//           <label>Aadhaar Number</label>
//           <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required />
//           {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
//         </div>
//         <div className="form-group">
//           <label>Bank Balance</label>
//           <input type="text" value={formData.bankBalance} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Status</label>
//           <input type="text" value={formData.status} readOnly />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default BankAccountForm;
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import "../styles/CreateAccount.css";

const BankAccountForm = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    accountNumber: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    panCard: "",
    aadhaarNumber: "",
    bankBalance: 1000, // Default balance
    status: "Pending", // Default status
    accountType: "Savings", // Default to Savings
  });

  const [errors, setErrors] = useState({});

  // Generate Account Number when component loads
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(), // 12-digit account number
    }));
  }, []);

  // Validate user input
  const validateInput = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!/^[a-zA-Z\s]{1,50}$/.test(value)) error = "Only letters allowed, max 50 characters.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format.";
        break;
      case "phoneNumber":
        if (!/^\d{10}$/.test(value)) error = "Phone number must be 10 digits.";
        break;
      case "panCard":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) error = "Invalid PAN format (ABCDE1234F).";
        break;
      case "aadhaarNumber":
        if (!/^\d{12}$/.test(value)) error = "Aadhaar must be a 12-digit number.";
        break;
      case "address":
        if (value.trim().length < 5) error = "Address must be at least 5 characters long.";
        break;
      default:
        break;
    }
    return error;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
  };

  const checkExistingCustomer = async (aadhaar) => {
    // Query customers collection
    const customersQuery = query(collection(db, "customers"), where("aadhaarNumber", "==", aadhaar));
    const customersSnapshot = await getDocs(customersQuery);
  
    // Query approveCustomers collection
    const approvedQuery = query(collection(db, "approveCustomers"), where("aadhaarNumber", "==", aadhaar));
    const approvedSnapshot = await getDocs(approvedQuery);
  
    if (!customersSnapshot.empty) {
      return customersSnapshot.docs[0].data().customerId; // Return existing customer ID from customers
    } else if (!approvedSnapshot.empty) {
      return approvedSnapshot.docs[0].data().customerId; // Return existing customer ID from approvedCustomers
    } else {
      return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a new customer ID
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {};

    // Validate all inputs
    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (!isValid) return;

    try {
      // Check if customer already exists using Aadhaar
      const existingCustomerId = await checkExistingCustomer(formData.aadhaarNumber);

      // Update formData with the correct customerId
      const updatedFormData = { ...formData, customerId: existingCustomerId };

      // Save new account to Firestore
      await addDoc(collection(db, "customers"), updatedFormData);

      alert("Bank Account Created Successfully!");

      // Reset form
      setFormData({
        customerId: "",
        accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        panCard: "",
        aadhaarNumber: "",
        bankBalance: 1000,
        status: "Pending",
        accountType: "Savings",
      });

      setErrors({});
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Bank Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer ID</label>
          <input type="text" value={formData.customerId} readOnly />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input type="text" value={formData.accountNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Account Type</label>
          <select name="accountType" value={formData.accountType} onChange={handleChange}>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label>PAN Card</label>
          <input type="text" name="panCard" value={formData.panCard} onChange={handleChange} required />
          {errors.panCard && <span className="error">{errors.panCard}</span>}
        </div>
        <div className="form-group">
          <label>Aadhaar Number</label>
          <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required />
          {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
        </div>
        <div className="form-group">
          <label>Bank Balance</label>
          <input type="text" value={formData.bankBalance} readOnly />
        </div>
        <div className="form-group">
          <label>Status</label>
          <input type="text" value={formData.status} readOnly />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BankAccountForm;
