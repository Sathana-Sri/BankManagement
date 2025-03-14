// import { useState, useEffect } from "react";
// import { db } from "../firebase/firebaseconfig"; // Ensure correct Firestore import
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// const LoanApplications = () => {
//   const [loans, setLoans] = useState([]);

//   useEffect(() => {
//     const fetchLoans = async () => {
//       const querySnapshot = await getDocs(collection(db, "loan"));
//       const loanList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setLoans(loanList);
//     };

//     fetchLoans();
//   }, []);

//   const updateLoanStatus = async (id, newStatus) => {
//     const loanRef = doc(db, "loan", id);
//     await updateDoc(loanRef, { status: newStatus });

//     // Update local state
//     setLoans((prevLoans) =>
//       prevLoans.map((loan) =>
//         loan.id === id ? { ...loan, status: newStatus } : loan
//       )
//     );
//   };

//   return (
//     <div>
//       <h2>Loan Applications</h2>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Loan ID</th>
//             <th>Customer ID</th>
//             <th>Amount</th>
//             <th>Interest</th>
//             <th>Loan Type</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loans.map((loan) => (
//             <tr key={loan.id}>
//               <td>{loan.loanid}</td>
//               <td>{loan.customerid}</td>
//               <td>{loan.amount}</td>
//               <td>{loan.interest}%</td>
//               <td>{loan.loantype}</td>
//               <td>{loan.status}</td>
//               <td>
//                 {loan.status === "Pending" && (
//                   <>
//                     <button onClick={() => updateLoanStatus(loan.id, "Approved")}>
//                       Approve
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Hold")}>
//                       Hold
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Rejected")}>
//                       Reject
//                     </button>
//                   </>
//                 )}
//                 {loan.status === "Hold" && (
//                   <>
//                     <button onClick={() => updateLoanStatus(loan.id, "Approved")}>
//                       Approve
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Rejected")}>
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// import { useState, useEffect } from "react";
// import { db } from "../firebase/firebaseconfig"; // Ensure Firestore is correctly imported
// import { 
//   collection, 
//   getDocs, 
//   updateDoc, 
//   doc, 
//   query, 
//   where, 
//   addDoc, 
//   deleteDoc 
// } from "firebase/firestore";

// const LoanApplications = () => {
//   const [loans, setLoans] = useState([]);

//   // Fetch all loan applications from Firestore
//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "loan"));
//         const loanList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setLoans(loanList);
//       } catch (error) {
//         console.error("Error fetching loans:", error);
//       }
//     };

//     fetchLoans();
//   }, []);

//   // Function to update loan status & update approved customer balance
//   const updateLoanStatus = async (loanId, newStatus, amount, customerId) => {
//     try {
//       const loanRef = doc(db, "loan", loanId);

//       // If approving, update customer balance in "approveCustomers" and move to "approveloans"
//       if (newStatus === "Approved") {
//         // 🔥 Query Firestore to find the correct customer in approveCustomers collection
//         const customerQuery = query(
//           collection(db, "approveCustomers"),
//           where("customerid", "==", customerId) // Search in approveCustomers
//         );

//         const customerSnapshot = await getDocs(customerQuery);

//         if (!customerSnapshot.empty) {
//           const customerDoc = customerSnapshot.docs[0]; // First matched customer document
//           const customerRef = doc(db, "approveCustomers", customerDoc.id); // Get Firestore doc reference
//           const customerData = customerDoc.data();

//           const newBalance = (customerData.bankbalance || 0) + amount;

//           // ✅ Update customer balance in Firestore
//           await updateDoc(customerRef, { bankbalance: newBalance });
//           console.log(`✅ Approved Customer ${customerId} balance updated to: ${newBalance}`);

//           // 🔥 Move the approved loan to the "approveloans" collection
//           const loanSnapshot = await getDocs(query(collection(db, "loan"), where("customerid", "==", customerId)));

//           if (!loanSnapshot.empty) {
//             const loanData = loanSnapshot.docs[0].data(); // Get loan data

//             // ✅ Add loan data to "approveloans" collection
//             await addDoc(collection(db, "approveloans"), {
//               ...loanData,
//               status: "Approved", // Ensure status is saved as Approved
//             });
//             console.log(`✅ Loan ${loanId} moved to "approveloans" collection`);

//             // ❌ Delete the loan from the "loan" collection
//             await deleteDoc(loanRef);
//             console.log(`❌ Loan ${loanId} removed from "loan" collection`);
//           }
//         } else {
//           alert("Approved Customer not found! Please check the data.");
//           console.error("Approved Customer not found for ID:", customerId);
//           return;
//         }
//       }

//       // ✅ Update loan status in Firestore (if not approved)
//       if (newStatus !== "Approved") {
//         await updateDoc(loanRef, { status: newStatus });
//         console.log(`✅ Loan ${loanId} status updated to: ${newStatus}`);
//       }

//       // 🔄 Refresh loan data to update UI
//       const querySnapshot = await getDocs(collection(db, "loan"));
//       const loanList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setLoans(loanList);
//     } catch (error) {
//       console.error("Error updating loan status:", error);
//     }
//   };

//   return (
//     <div>
//       <h3>Loan Applications</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Loan ID</th>
//             <th>Customer ID</th>
//             <th>Amount</th>
//             <th>Interest</th>
//             <th>Loan Type</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loans.map((loan) => (
//             <tr key={loan.id}>
//               <td>{loan.loanid}</td>
//               <td>{loan.customerid}</td>
//               <td>{loan.amount}</td>
//               <td>{loan.interest}%</td>
//               <td>{loan.loantype}</td>
//               <td>{loan.status}</td>
//               <td>
//                 {loan.status === "Pending" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         updateLoanStatus(loan.id, "Approved", loan.amount, loan.customerid)
//                       }
//                     >
//                       Approve
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Hold", loan.amount, loan.customerid)}>
//                       Hold
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Rejected", loan.amount, loan.customerid)}>
//                       Reject
//                     </button>
//                   </>
//                 )}
//                 {loan.status === "Hold" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         updateLoanStatus(loan.id, "Approved", loan.amount, loan.customerid)
//                       }
//                     >
//                       Approve
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Rejected", loan.amount, loan.customerid)}>
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // export default LoanApplications;
// import { useState, useEffect } from "react";
// import { db } from "../firebase/firebaseconfig"; // Ensure Firestore is correctly imported
// import { 
//   collection, 
//   getDocs, 
//   updateDoc, 
//   doc, 
//   query, 
//   where, 
//   addDoc, 
//   deleteDoc 
// } from "firebase/firestore";

// const LoanApplications = () => {
//   const [loans, setLoans] = useState([]);

//   // Fetch all loan applications from Firestore
//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         console.log("Fetching loans from Firestore...");
//         const querySnapshot = await getDocs(collection(db, "loans")); // ✅ Fixed Collection Name
//         const loanList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setLoans(loanList);
//         console.log("Loans fetched successfully:", loanList);
//       } catch (error) {
//         console.error("Error fetching loans:", error);
//       }
//     };

//     fetchLoans();
//   }, []);

//   // Function to update loan status & update approved customer balance
//   const updateLoanStatus = async (loanId, newStatus, amount, customerId) => {
//     try {
//       const loanRef = doc(db, "loans", loanId); // ✅ Fixed Collection Name

//       if (newStatus === "Approved") {
//         // 🔥 Find customer in approveCustomers collection
//         const customerQuery = query(
//           collection(db, "approveCustomers"),
//           where("customerid", "==", customerId)
//         );

//         const customerSnapshot = await getDocs(customerQuery);

//         if (!customerSnapshot.empty) {
//           const customerDoc = customerSnapshot.docs[0];
//           const customerRef = doc(db, "approveCustomers", customerDoc.id);
//           const customerData = customerDoc.data();

//           const newBalance = (customerData.bankbalance || 0) + amount;

//           // ✅ Update customer balance
//           await updateDoc(customerRef, { bankbalance: newBalance });
//           console.log(`✅ Updated Customer ${customerId} balance to: ${newBalance}`);

//           // ✅ Move the approved loan to "approveloans"
//           const loanData = (await getDocs(query(collection(db, "loans"), where("customerid", "==", customerId))))
//             .docs[0]?.data();

//           if (loanData) {
//             await addDoc(collection(db, "approveloans"), {
//               ...loanData,
//               status: "Approved",
//             });

//             console.log(`✅ Loan ${loanId} moved to "approveloans"`);

//             // ❌ Delete from "loans" collection
//             await deleteDoc(loanRef);
//             console.log(`❌ Loan ${loanId} removed from "loans"`);
//           }
//         } else {
//           alert("Approved Customer not found! Please check the data.");
//           console.error("Approved Customer not found for ID:", customerId);
//           return;
//         }
//       } else {
//         // ✅ Update loan status in Firestore
//         await updateDoc(loanRef, { status: newStatus });
//         console.log(`✅ Loan ${loanId} status updated to: ${newStatus}`);
//       }

//       // 🔄 Refresh UI by fetching updated loans
//       const querySnapshot = await getDocs(collection(db, "loans"));
//       setLoans(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//     } catch (error) {
//       console.error("Error updating loan status:", error);
//     }
//   };

//   return (
//     <div>
//       <h3>Loan Applications</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Loan ID</th>
//             <th>Customer ID</th>
//             <th>Amount</th>
//             <th>Interest</th>
//             <th>Loan Type</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loans.map((loan) => (
//             <tr key={loan.id}>
//               <td>{loan.loanid}</td>
//               <td>{loan.customerid}</td>
//               <td>{loan.amount}</td>
//               <td>{loan.interest}%</td>
//               <td>{loan.loantype}</td>
//               <td>{loan.status}</td>
//               <td>
//                 {loan.status === "Pending" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         updateLoanStatus(loan.id, "Approved", loan.amount, loan.customerid)
//                       }
//                     >
//                       Approve
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Hold", loan.amount, loan.customerid)}>
//                       Hold
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Rejected", loan.amount, loan.customerid)}>
//                       Reject
//                     </button>
//                   </>
//                 )}
//                 {loan.status === "Hold" && (
//                   <>
//                     <button
//                       onClick={() =>
//                         updateLoanStatus(loan.id, "Approved", loan.amount, loan.customerid)
//                       }
//                     >
//                       Approve
//                     </button>
//                     <button onClick={() => updateLoanStatus(loan.id, "Rejected", loan.amount, loan.customerid)}>
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig";
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  addDoc, 
  deleteDoc 
} from "firebase/firestore";

const LoanApplications = () => {
  const [loans, setLoans] = useState([]);

  // Fetch all loan applications from Firestore
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        console.log("Fetching loans from Firestore...");
        const querySnapshot = await getDocs(collection(db, "loans"));
        const loanList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLoans(loanList);
        console.log("Loans fetched successfully:", loanList);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, []);

  // Function to update loan status
  const updateLoanStatus = async (loanId, newStatus, loanData) => {
    try {
      const loanRef = doc(db, "loans", loanId);

      if (newStatus === "Approved") {
        // ✅ Move loan to "approveloans" and remove from "loans"
        await addDoc(collection(db, "approveloans"), { ...loanData, status: "Approved" });
        await deleteDoc(loanRef);
        console.log(`✅ Loan ${loanId} moved to "approveloans" and deleted from "loans"`);

        // 🛠️ Remove from UI immediately
        setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
      } 
      else if (newStatus === "Rejected") {
        // ❌ Delete loan from "loans"
        await deleteDoc(loanRef);
        console.log(`❌ Loan ${loanId} deleted from Firestore`);

        // 🛠️ Remove from UI immediately
        setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
      } 
      else {
        // ✅ Update loan status in Firestore
        await updateDoc(loanRef, { status: newStatus });
        console.log(`✅ Loan ${loanId} status updated to: ${newStatus}`);

        // 🔄 Update status in UI immediately
        setLoans((prevLoans) =>
          prevLoans.map((loan) =>
            loan.id === loanId ? { ...loan, status: newStatus } : loan
          )
        );
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  return (
    <div>
      <h3>Loan Applications</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Duration (Years)</th>
            <th>Loan Amount</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.accountNumber}</td>
              <td>{loan.duration}</td>
              <td>{loan.loanAmount}</td>
              <td>{loan.purpose}</td>
              <td>{loan.status || "Unknown"}</td> {/* Show status */}
              <td>
                {loan.status === "Pending" ? (
                  <>
                    <button onClick={() => updateLoanStatus(loan.id, "Approved", loan)}>
                      Approve
                    </button>
                    <button onClick={() => updateLoanStatus(loan.id, "Hold")}>
                      Hold
                    </button>
                    <button onClick={() => updateLoanStatus(loan.id, "Rejected")}>
                      Reject
                    </button>
                  </>
                ) : loan.status === "Hold" ? (
                  <>
                    <button onClick={() => updateLoanStatus(loan.id, "Approved", loan)}>
                      Approve
                    </button>
                    <button onClick={() => updateLoanStatus(loan.id, "Rejected")}>
                      Reject
                    </button>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanApplications;

