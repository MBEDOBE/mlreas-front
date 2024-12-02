import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const AddUserModal = ({ open, handleOpen, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://mlreas-api.onrender.com/api/users", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Corrected
      });
      alert("User added successfully");
      onUserAdded(); // Callback to refresh user list
      handleOpen(); // Close modal
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      fullWidth={true}
      minWidth="md" // Increase the width to medium size
    >
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
        </div>
        <div className="mb-4">
          <Select
            fullWidth
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          >
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="doctor">doctor</MenuItem>
            <MenuItem value="lab_technician">lab_technician</MenuItem>
          </Select>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={handleOpen}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
