// import React, { useState, useEffect } from "react";
// import { db } from "../firebase/firebaseconfig";
// import { collection, addDoc, getDocs } from "firebase/firestore";

// const LoanManagement = ({ customerId }) => {
//   const [loanAmount, setLoanAmount] = useState("");
//   const [duration, setDuration] = useState("");
//   const [purpose, setPurpose] = useState("");
//   const [loans, setLoans] = useState([]);

//   // Fetch existing loans when component loads
//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "loans"));
//         const loanList = querySnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((loan) => loan.customerId === customerId);
//         setLoans(loanList);
//       } catch (error) {
//         console.error("Error fetching loans:", error);
//       }
//     };
//     fetchLoans();
//   }, [customerId]);

//   // Function to apply for a new loan
//   const applyForLoan = async () => {
//     try {
//       if (!loanAmount || !duration || !purpose) {
//         alert("Please fill in all fields");
//         return;
//       }

//       const newLoan = {
//         customerId,
//         loanAmount: Number(loanAmount),
//         duration,
//         purpose,
//         status: "Pending",
//       };

//       // Add the new loan to Firestore
//       const docRef = await addDoc(collection(db, "loans"), newLoan);

//       // Update state with the new loan (including Firestore ID)
//       setLoans([...loans, { id: docRef.id, ...newLoan }]);

//       // Clear form fields after submission
//       setLoanAmount("");
//       setDuration("");
//       setPurpose("");

//       alert("Loan Application Submitted!");
//     } catch (error) {
//       console.error("Error applying for loan:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Loan Management</h2>
//       <div>
//         <h3>Apply for a Loan</h3>
//         <input
//           type="number"
//           placeholder="Loan Amount"
//           value={loanAmount}
//           onChange={(e) => setLoanAmount(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Duration (e.g., 12 months)"
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Purpose of Loan"
//           value={purpose}
//           onChange={(e) => setPurpose(e.target.value)}
//         />
//         <button onClick={applyForLoan}>Apply</button>
//       </div>

//       <div>
//         <h3>My Loans</h3>
//         <table border="1">
//           <thead>
//             <tr>
//               <th>Amount</th>
//               <th>Duration</th>
//               <th>Purpose</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loans.map((loan) => (
//               <tr key={loan.id}>
//                 <td>{loan.loanAmount}</td>
//                 <td>{loan.duration}</td>
//                 <td>{loan.purpose}</td>
//                 <td>{loan.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { db } from "../firebase/firebaseconfig"; // Ensure correct path
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const LoanCustomer = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [purpose, setPurpose] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Apply for a new loan
  const applyForLoan = async () => {
    try {
      if (!loanAmount || !duration || !purpose || !accountNumber) {
        alert("Please fill in all fields");
        return;
      }

      // Check if the account number exists in approveCustomers collection
      const accountQuery = query(
        collection(db, "approveCustomers"),
        where("accountNumber", "==", accountNumber)
      );

      const querySnapshot = await getDocs(accountQuery);

      if (querySnapshot.empty) {
        alert("Error: Account number not found in approved customers!");
        return;
      }

      // Store the loan application in Firestore (loans collection)
      const newLoan = {
        accountNumber,
        loanAmount: Number(loanAmount),
        duration,
        purpose,
        status: "Pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "loans"), newLoan);

      // Clear form fields after submission
      setAccountNumber("");
      setLoanAmount("");
      setDuration("");
      setPurpose("");

      alert("Loan Application Submitted!");
    } catch (error) {
      console.error("Error applying for loan:", error);
    }
  };

  return (
    <div>
      <h2>Loan Application</h2>
      <div>
        <h3>Apply for a Loan</h3>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duration (e.g., 12 months)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="text"
          placeholder="Purpose of Loan"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
        <button onClick={applyForLoan}>Apply</button>
      </div>
    </div>
  );
};

export default LoanCustomer;
