// import { Link } from "react-router-dom";
// import "../styles/AdminDashboard.css";

// const AdminDashboard = () => {
//     return (
//       <div className="admin-dashboard">
//         <h2>Admin Dashboard</h2>
//         <div className="button-container">
//           <Link to="/customer-management" className="dashboard-button">
//             Customer Management
//           </Link>
//           <Link to="/loan-application" className="dashboard-button">
//             Loan Application
//           </Link>
//         </div>
//       </div>
//     );
//   };
  
//   export default AdminDashboard;

// import { Link } from "react-router-dom";
// import "../styles/AdminDashboard.css";

// const AdminDashboard = () => {
//   return (
//     <div className="admin-dashboard">
//       <h2>Admin Dashboard</h2>
//       <div className="button-container">
//         <Link to="/customer-management">
//           <button className="dashboard-button">Customer Management</button>
//         </Link>
//         <Link to="/loan-application">
//           <button className="dashboard-button">Loan Application</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px'
      }}>Admin Dashboard</h2>
      <div className="button-container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px',
        width: '100%'
      }}>
        <Link to="/customer-management">
          <button className="dashboard-button" style={{
            padding: '12px 20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            width: '220px'
          }}>Customer Management</button>
        </Link>
        <Link to="/loan-application">
          <button className="dashboard-button" style={{
            padding: '12px 20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            width: '220px'
          }}>Loan Application</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;