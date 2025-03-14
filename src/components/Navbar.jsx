

// // // export default Navbar;
// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getAuth, signOut } from "firebase/auth";

// // const Navbar = () => {
// //   const navigate = useNavigate();
// //   const auth = getAuth();

// //   const handleLogout = async () => {
// //     try {
// //       await signOut(auth);
// //       navigate("/"); // Redirect to Login Page
// //     } catch (error) {
// //       console.error("Logout failed:", error.message);
// //     }
// //   };

// //   return (
// //     <nav>
// //       <h2>Banking System</h2>
// //       <button onClick={handleLogout}>Logout</button>
// //     </nav>
// //   );
// // };

// // export default Navbar;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";
// import "../components/Navbar.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/"); // Redirect to Login Page
//     } catch (error) {
//       console.error("Logout failed:", error.message);
//     }
//   };

//   return (
//     <nav style={navStyle}>
//       <h6 style={titleStyle}>SS Bank</h6>
//       <button onClick={handleLogout} style={buttonStyle}>Logout</button>
//     </nav>
//   );
// };

// // Styles
// const navStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "15px 20px",
//   backgroundColor: "#1E293B",
//   color: "white",
// };

// const titleStyle = {
//   margin: 0,
//   fontSize: "24px",
//   fontWeight: "bold",
// };

// const buttonStyle = {
//   padding: "8px 16px",
//   backgroundColor: "#EF4444",
//   color: "white",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontSize: "16px",
// };

// // export default Navbar;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";


// const Navbar = () => {
//   const navigate = useNavigate();
//   const auth = getAuth();
  
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/"); // Redirect to Login Page
//     } catch (error) {
//       console.error("Logout failed:", error.message);
//     }
//   };
  
//   return (
//     <nav className="navbar">
//       <h1 className="navbar-title">SS Bank</h1>
//       <button onClick={handleLogout} className="logout-button">Logout</button>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to Login Page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav style={{
      position: "absolute", 
      top: "0",
      right: "0",
      backgroundColor: "#002766",
      padding: "10px 20px",
      borderRadius: "0 0 8px 8px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
    }}>
      <h1 style={{
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        margin: "0"
      }}>SS Bank</h1>

      <button 
        onClick={handleLogout} 
        style={{
          backgroundColor: "#dc2626",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          transition: "all 0.3s ease-in-out"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#b91c1c"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#dc2626"}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
