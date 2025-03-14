

// // export default CustomerManagement;
// import React, { useState, useEffect } from "react";
// import { db } from "../firebase/firebaseconfig";
// import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
// import "../styles/CustomerManagement.css";

// const CustomerManagement = () => {
//   const [customers, setCustomers] = useState([]);
//   const [holdCustomers, setHoldCustomers] = useState([]);
//   const [limits, setLimits] = useState({});

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "customers"));
//         const customerList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCustomers(customerList);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       }
//     };

//     const fetchHoldCustomers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "holdCustomers"));
//         const holdList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setHoldCustomers(holdList);
//       } catch (error) {
//         console.error("Error fetching hold customers:", error);
//       }
//     };

//     fetchCustomers();
//     fetchHoldCustomers();
//   }, []);

//   // ✅ APPROVE CUSTOMER (Move to 'approveCustomers' collection & remove from UI)
//   const handleApprove = async (customer) => {
//     try {
//       // Move to "approveCustomers"
//       await setDoc(doc(db, "approveCustomers", customer.id), { 
//         ...customer, 
//         status: "approved" 
//       });

//       // Remove from "customer" collection
//       await deleteDoc(doc(db, "customers", customer.id));

//       // Remove from UI
//       setCustomers(customers.filter((c) => c.id !== customer.id));

//       alert("Customer Approved and moved to ApproveCustomers!");
//     } catch (error) {
//       console.error("Error approving customer:", error);
//     }
//   };

//   // ✅ MOVE TO HOLD FUNCTION
//   const handleHold = async (customer) => {
//     try {
//       // Move to "holdCustomers"
//       await setDoc(doc(db, "holdCustomers", customer.id), { 
//         ...customer, 
//         status: "hold" 
//       });

//       // Remove from "customer" collection
//       await deleteDoc(doc(db, "customers", customer.id));

//       // Update UI
//       setCustomers(customers.filter((c) => c.id !== customer.id));
//       setHoldCustomers([...holdCustomers, { ...customer, status: "hold" }]);

//       alert("Customer Moved to Hold!");
//     } catch (error) {
//       console.error("Error moving customer to hold:", error);
//     }
//   };

//   // ❌ REJECT CUSTOMER
//   const handleReject = async (id) => {
//     try {
//       await deleteDoc(doc(db, "customers", id));
//       setCustomers(customers.filter((c) => c.id !== id));
//       alert("Customer Rejected!");
//     } catch (error) {
//       console.error("Error rejecting customer:", error);
//     }
//   };

//   // ✅ APPROVE FROM HOLD
//   const approveFromHold = async (customer) => {
//     try {
//       // Move to "approveCustomers"
//       await setDoc(doc(db, "approveCustomers", customer.id), { 
//         ...customer, 
//         status: "approved" 
//       });

//       // Remove from "holdCustomers"
//       await deleteDoc(doc(db, "holdCustomers", customer.id));

//       // Update UI
//       setHoldCustomers(holdCustomers.filter((c) => c.id !== customer.id));

//       alert("Customer Approved from Hold and moved to ApproveCustomers!");
//     } catch (error) {
//       console.error("Error approving from hold:", error);
//     }
//   };

//   // ❌ REJECT FROM HOLD
//   const rejectFromHold = async (id) => {
//     try {
//       await deleteDoc(doc(db, "holdCustomers", id));
//       setHoldCustomers(holdCustomers.filter((c) => c.id !== id));
//       alert("Customer Rejected from Hold!");
//     } catch (error) {
//       console.error("Error rejecting from hold:", error);
//     }
//   };

//   // 🔄 UPDATE TRANSFER LIMIT
//   const updateTransferLimit = async (id) => {
//     try {
//       const newLimit = limits[id] || 0;
//       await updateDoc(doc(db, "customers", id), { transferLimit: Number(newLimit) });

//       setCustomers(customers.map((c) => (c.id === id ? { ...c, transferLimit: newLimit } : c)));
//       alert("Transfer Limit Updated!");
//     } catch (error) {
//       console.error("Error updating transfer limit:", error);
//     }
//   };

//   return (
//     <div>
      

//       {/* Pending Customers Section */}
//       <h3>Pending Customers</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>PAN</th>
//             <th>Adhar</th>
//             <th>Transfer Limit</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer) => (
//             <tr key={customer.id}>
//               <td>{customer.fullName}</td>
//               <td>{customer.email}</td>
//               <td>{customer.phoneNumber}</td>
//               <td>{customer.panCard}</td>
//               <td>{customer.aadhaarNumber}</td>
//               <td>
//                 <input
//                   type="number"
//                   value={limits[customer.id] || customer.transferLimit || ""}
//                   onChange={(e) => setLimits({ ...limits, [customer.id]: e.target.value })}
//                 />
//                 <button onClick={() => updateTransferLimit(customer.id)}>Update</button>
//               </td>
//               <td>{customer.status || "Pending"}</td>
//               <td>
//                 <button onClick={() => handleApprove(customer)}>Approve</button>
//                 <button onClick={() => handleHold(customer)}>Hold</button>
//                 <button onClick={() => handleReject(customer.id)}>Reject</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Hold Customers Section */}
//       <h3>Hold Customers</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>PAN</th>
//             <th>Adhar</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {holdCustomers.map((customer) => (
//             <tr key={customer.id}>
//             <td>{customer.fullName}</td>
//               <td>{customer.email}</td>
//               <td>{customer.phoneNumber}</td>
//               <td>{customer.panCard}</td>
//               <td>{customer.aadhaarNumber}</td>
//               <td>
//                 <button onClick={() => approveFromHold(customer)}>Approve</button>
//                 <button onClick={() => rejectFromHold(customer.id)}>Reject</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import "../styles/CustomerManagement.css";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [holdCustomers, setHoldCustomers] = useState([]);
  const [limits, setLimits] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const customerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchHoldCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "holdCustomers"));
        const holdList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHoldCustomers(holdList);
      } catch (error) {
        console.error("Error fetching hold customers:", error);
      }
    };

    fetchCustomers();
    fetchHoldCustomers();
  }, []);

  // ✅ APPROVE CUSTOMER (NOW REQUIRES TRANSFER LIMIT)
  const handleApprove = async (customer) => {
    const transferLimit = limits[customer.id] ?? customer.transferLimit;
    
    if (!transferLimit || transferLimit <= 0) {
      alert("Please enter a valid Transfer Limit before approving.");
      return;
    }

    try {
      await setDoc(doc(db, "approveCustomers", customer.id), { 
        ...customer, 
        transferLimit: Number(transferLimit), 
        status: "approved" 
      });

      await deleteDoc(doc(db, "customers", customer.id));

      setCustomers(customers.filter((c) => c.id !== customer.id));
      alert("Customer Approved!");
    } catch (error) {
      console.error("Error approving customer:", error);
    }
  };

  // ✅ MOVE CUSTOMER TO HOLD
  const handleHold = async (customer) => {
    try {
      await setDoc(doc(db, "holdCustomers", customer.id), { ...customer, status: "hold" });
      await deleteDoc(doc(db, "customers", customer.id));

      setCustomers(customers.filter((c) => c.id !== customer.id));
      setHoldCustomers([...holdCustomers, { ...customer, status: "hold" }]);

      alert("Customer Moved to Hold!");
    } catch (error) {
      console.error("Error moving customer to hold:", error);
    }
  };

  // ❌ REJECT CUSTOMER
  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      setCustomers(customers.filter((c) => c.id !== id));
      alert("Customer Rejected!");
    } catch (error) {
      console.error("Error rejecting customer:", error);
    }
  };

  // ✅ APPROVE CUSTOMER FROM HOLD (REQUIRES TRANSFER LIMIT)
  const approveFromHold = async (customer) => {
    const transferLimit = limits[customer.id] ?? customer.transferLimit;
    
    if (!transferLimit || transferLimit <= 0) {
      alert("Please enter a valid Transfer Limit before approving from hold.");
      return;
    }

    try {
      await setDoc(doc(db, "approveCustomers", customer.id), { 
        ...customer, 
        transferLimit: Number(transferLimit), 
        status: "approved" 
      });

      await deleteDoc(doc(db, "holdCustomers", customer.id));

      setHoldCustomers(holdCustomers.filter((c) => c.id !== customer.id));
      alert("Customer Approved from Hold!");
    } catch (error) {
      console.error("Error approving from hold:", error);
    }
  };

  // ❌ REJECT CUSTOMER FROM HOLD
  const rejectFromHold = async (id) => {
    try {
      await deleteDoc(doc(db, "holdCustomers", id));
      setHoldCustomers(holdCustomers.filter((c) => c.id !== id));
      alert("Customer Rejected from Hold!");
    } catch (error) {
      console.error("Error rejecting from hold:", error);
    }
  };

  // 🔄 UPDATE TRANSFER LIMIT
  const updateTransferLimit = async (id) => {
    try {
      const newLimit = limits[id] || 0;  // Default to 0 if empty
      if (newLimit <= 0) {
        alert("Transfer Limit must be greater than 0.");
        return;
      }

      await updateDoc(doc(db, "customers", id), { transferLimit: Number(newLimit) });

      setCustomers(customers.map((c) => (c.id === id ? { ...c, transferLimit: newLimit } : c)));
      alert("Transfer Limit Updated!");
    } catch (error) {
      console.error("Error updating transfer limit:", error);
    }
  };

  return (
    <div>
      {/* 🔵 Pending Customers Section */}
      <h3>Pending Customers</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>PAN</th>
            <th>Adhar</th>
            <th>Transfer Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td>{customer.panCard}</td>
              <td>{customer.aadhaarNumber}</td>
              <td>
                <input
                  type="number"
                  value={limits[customer.id] ?? customer.transferLimit ?? ""}
                  onChange={(e) => setLimits({ ...limits, [customer.id]: e.target.value })}
                />
                <button onClick={() => updateTransferLimit(customer.id)}>Update</button>
              </td>
              <td>{customer.status || "Pending"}</td>
              <td>
                <button onClick={() => handleApprove(customer)}>Approve</button>
                <button onClick={() => handleHold(customer)}>Hold</button>
                <button onClick={() => handleReject(customer.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🟡 Hold Customers Section */}
      <h3>Hold Customers</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>PAN</th>
            <th>Adhar</th>
            <th>Transfer Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holdCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td>{customer.panCard}</td>
              <td>{customer.aadhaarNumber}</td>
              <td>
                <input
                  type="number"
                  value={limits[customer.id] ?? customer.transferLimit ?? ""}
                  onChange={(e) => setLimits({ ...limits, [customer.id]: e.target.value })}
                />
                <button onClick={() => updateTransferLimit(customer.id)}>Update</button>
              </td>
              <td>{customer.status || "Hold"}</td>
              <td>
                <button onClick={() => approveFromHold(customer)}>Approve</button>
                <button onClick={() => rejectFromHold(customer.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;


