import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const AddLabResult = () => {
  const [patients, setPatients] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    testType: "",
    result: "",
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/patients`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPatients();
  }, []);

  // Fetch test types
  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/thresholds`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTestTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch test types", err);
      }
    };

    fetchTestTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmationOpen(true);
  };

  const confirmSubmission = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/labresults`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Lab result added successfully");
      setConfirmationOpen(false);
    } catch (err) {
      console.error("Failed to submit lab result", err);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Typography variant="h5" color="primary" className="mb-4">
        Add Lab Result
      </Typography>
      <form onSubmit={handleSubmit}>
        <Select
          fullWidth
          label="Select Patient"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a Patient
          </MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient._id} value={patient._id}>
              {patient.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          label="Select Test Type"
          name="testType"
          value={formData.testType}
          onChange={handleChange}
          required
          displayEmpty
          className="mt-4"
        >
          <MenuItem value="" disabled>
            Select a Test Type
          </MenuItem>
          {testTypes.map((testType) => (
            <MenuItem key={testType._id} value={testType.testType}>
              {testType.testType}
            </MenuItem>
          ))}
        </Select>

        <TextField
          fullWidth
          margin="normal"
          label="Result"
          name="result"
          value={formData.result}
          onChange={handleChange}
          required
        />

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>

      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Patient: {patients.find((p) => p._id === formData.patientId)?.name}
          </Typography>
          <Typography>Test Type: {formData.testType}</Typography>
          <Typography>Result: {formData.result}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmSubmission} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddLabResult;
