import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const AddPatientModal = ({ open, handleOpen, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    medicalCondition: "",
    notes: "",
    doctorId: "",
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch list of users and filter doctors
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Filter users to get only those with role 'doctor'
        const doctorUsers = res.data.filter((user) => user.role === "doctor");
        setDoctors(doctorUsers);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send request to add patient
      await axios.post("http://localhost:8000/api/patients", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Patient added successfully");
      handleOpen(); // Close modal after submission
      onPatientAdded();
    } catch (err) {
      console.error("Failed to add patient:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      fullWidth={true}
      minWidth="md" // Increase the width of the form here
    >
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Patient Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              variant="outlined"
              margin="normal"
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={onChange}
              variant="outlined"
              margin="normal"
              required
            />
          </div>
          <div className="mb-4">
            <FormControl fullWidth required>
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                labelId="gender-select-label"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={onChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Medical Condition"
              name="medicalCondition"
              value={formData.medicalCondition}
              onChange={onChange}
              variant="outlined"
              margin="normal"
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              variant="outlined"
              margin="normal"
            />
          </div>
          <div className="mb-4">
            <FormControl fullWidth required>
              <InputLabel id="doctor-select-label">Assign Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={onChange}
                label="Assign Doctor"
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={handleOpen}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Add Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPatientModal;
