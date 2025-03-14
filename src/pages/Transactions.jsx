
// // export default Transaction;
// import React, { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../firebase/firebaseconfig";
//  // Ensure this path is correct
// import { useNavigate } from "react-router-dom";

// const Transaction = () => {
//   const [accounts, setAccounts] = useState([]); // Store multiple accounts
//   const [selectedAccount, setSelectedAccount] = useState(""); // Selected account
//   const [balance, setBalance] = useState(0); // Store balance
//   const [recipientAcc, setRecipientAcc] = useState(""); // Recipient account
//   const [amount, setAmount] = useState(""); // Transfer amount
//   const [loading, setLoading] = useState(true);
  
//   const auth = getAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserAccounts = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const userEmail = user.email;
//         const accountsRef = collection(db, "approveCustomers");
//         const q = query(accountsRef, where("email", "==", userEmail));
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const userAccounts = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setAccounts(userAccounts);
//           setSelectedAccount(userAccounts[0].accountNumber); // Default to first account
//           setBalance(userAccounts[0].balance);
//         } else {
//           alert("No bank accounts found.");
//         }
//       } catch (error) {
//         console.error("Error fetching accounts:", error);
//       }
//       setLoading(false);
//     };

//     fetchUserAccounts();
//   }, [auth, navigate]);

//   const handleAccountChange = (event) => {
//     const selectedAcc = event.target.value;
//     setSelectedAccount(selectedAcc);
//     const selectedAccData = accounts.find(
//       (acc) => acc.accountNumber === selectedAcc
//     );
//     setBalance(selectedAccData.balance);
//   };

//   const handleTransfer = async () => {
//     if (!recipientAcc || !amount || isNaN(amount) || amount <= 0) {
//       alert("Enter a valid recipient account number and amount.");
//       return;
//     }

//     if (balance < amount) {
//       alert("Insufficient balance!");
//       return;
//     }

//     try {
//       // Find sender account details
//       const senderData = accounts.find(
//         (acc) => acc.accountNumber === selectedAccount
//       );
//       if (!senderData) {
//         alert("Sender account not found.");
//         return;
//       }

//       const senderRef = doc(db, "approveCustomers", senderData.id);

//       // Find recipient account
//       const recipientQuery = query(
//         collection(db, "approveCustomers"),
//         where("accountNumber", "==", recipientAcc)
//       );
//       const recipientSnapshot = await getDocs(recipientQuery);

//       if (recipientSnapshot.empty) {
//         alert("Recipient account not found!");
//         return;
//       }

//       const recipientDoc = recipientSnapshot.docs[0];
//       const recipientData = recipientDoc.data();
//       const recipientRef = doc(db, "approveCustomers", recipientDoc.id);

//       // Deduct from sender
//       await updateDoc(senderRef, { balance: senderData.balance - parseFloat(amount) });

//       // If the recipient is in the same bank, add balance
//       if (recipientData.bankName === senderData.bankName) {
//         await updateDoc(recipientRef, { balance: recipientData.balance + parseFloat(amount) });
//       }

//       alert("Transaction successful!");
//       navigate("/profile");
//     } catch (error) {
//       console.error("Transaction failed:", error);
//       alert("Transaction failed. Please try again.");
//     }
//   };

//   if (loading) return <p>Loading accounts...</p>;

//   return (
//     <div style={containerStyle}>
//       <h2>Bank Transaction</h2>

//       <label>Select Account:</label>
//       <select value={selectedAccount} onChange={handleAccountChange} style={inputStyle}>
//         {accounts.map((acc) => (
//           <option key={acc.id} value={acc.accountNumber}>
//             {acc.accountNumber} - Balance: ${acc.balance}
//           </option>
//         ))}
//       </select>

//       <p>Available Balance: ${balance}</p>

//       <label>Recipient Account Number:</label>
//       <input
//         type="text"
//         value={recipientAcc}
//         onChange={(e) => setRecipientAcc(e.target.value)}
//         required
//         style={inputStyle}
//       />

//       <label>Amount to Transfer:</label>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         required
//         style={inputStyle}
//       />

//       <button onClick={handleTransfer} style={buttonStyle}>Transfer</button>
//       <button onClick={() => navigate("/profile")} style={{ ...buttonStyle, background: "#6B7280" }}>
//         Cancel
//       </button>
//     </div>
//   );
// };

// // Styling
// const containerStyle = {
//   padding: "20px",
//   background: "#1E293B",
//   color: "white",
//   borderRadius: "10px",
//   maxWidth: "400px",
//   margin: "auto",
//   textAlign: "center",
// };

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
//   marginTop: "10px",
// };

// export default Transaction;
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [bankBalance, setBankBalance] = useState(0);
  const [recipientAcc, setRecipientAcc] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userEmail = user.email;
        const accountsRef = collection(db, "approveCustomers");
        const q = query(accountsRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userAccounts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAccounts(userAccounts);
          setSelectedAccount(userAccounts[0].accountNumber);
          setBankBalance(userAccounts[0].bankBalance);
        } else {
          alert("No bank accounts found.");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
      setLoading(false);
    };

    fetchUserAccounts();
  }, [auth, navigate]);

  const handleAccountChange = (event) => {
    const selectedAcc = event.target.value;
    setSelectedAccount(selectedAcc);
    const selectedAccData = accounts.find((acc) => acc.accountNumber === selectedAcc);
    setBankBalance(selectedAccData.bankBalance);
  };

  const handleTransfer = async () => {
    if (!recipientAcc || !amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid recipient account number and amount.");
      return;
    }

    if (bankBalance < amount) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const senderData = accounts.find((acc) => acc.accountNumber === selectedAccount);
      if (!senderData) {
        alert("Sender account not found.");
        return;
      }

      const senderRef = doc(db, "approveCustomers", senderData.id);

      const recipientQuery = query(
        collection(db, "approveCustomers"),
        where("accountNumber", "==", recipientAcc)
      );
      const recipientSnapshot = await getDocs(recipientQuery);

      if (recipientSnapshot.empty) {
        alert("Recipient account not found!");
        return;
      }

      const recipientDoc = recipientSnapshot.docs[0];
      const recipientData = recipientDoc.data();
      const recipientRef = doc(db, "approveCustomers", recipientDoc.id);

      await updateDoc(senderRef, { bankBalance: senderData.bankBalance - parseFloat(amount) });
      if (recipientData.bankName === senderData.bankName) {
        await updateDoc(recipientRef, { bankBalance: recipientData.bankBalance + parseFloat(amount) });
      }

      alert("Transaction successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div style={containerStyle}>

      <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>Select Account:</label>
      <select value={selectedAccount} onChange={handleAccountChange} style={inputStyle}>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.accountNumber}>
            {acc.accountNumber} - Balance: ${acc.bankBalance}
          </option>
        ))}
      </select>

      <p  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>Available Balance: ${bankBalance}</p>

      <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>Recipient Account Number:</label>
      <input
        type="text"
        value={recipientAcc}
        onChange={(e) => setRecipientAcc(e.target.value)}
        required
        style={inputStyle}
      />

      <label  style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "5px", display: "block" }}>Amount to Transfer:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={inputStyle}
      />

      <button onClick={handleTransfer} style={buttonStyle}>Transfer</button>
      <button onClick={() => navigate("/profile")} style={{ ...buttonStyle, background: "#6B7280" }}>
        Cancel
      </button>
    </div>
  );
};

const containerStyle = {
  padding: "20px",
  background: "#1E293B",
  color: "white",
  borderRadius: "10px",
  maxWidth: "400px",
  margin: "auto",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "none",
  marginTop: "5px",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px",
  background: "#3B82F6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "10px",
};

export default Transaction;