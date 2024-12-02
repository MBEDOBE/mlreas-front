// src/components/Dashboard.js
import React, { useContext } from "react";
import DoctorDashboard from "./Dashboard/DoctorDashboard";
import LabTechnicianDashboard from "./Dashboard/LabTechnicianDashboard";
import AdminDashboard from "./AdminDashboard";
import { AuthContext } from "../context/AuthContext";
import { Typography } from "@material-tailwind/react";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="p-4">
      {auth.role === "doctor" && <DoctorDashboard />}
      {auth.role === "lab_technician" && <LabTechnicianDashboard />}
      {auth.role === "admin" && <AdminDashboard />}
      {!["doctor", "lab_technician", "admin"].includes(auth.role) && (
        <Typography variant="h5" color="red">
          Unauthorized Access
        </Typography>
      )}
    </div>
  );
};

export default Dashboard;
