import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [resultsAvailable, setResultsAvailable] = useState({});
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setPatients(res.data);

        const results = {};
        for (const patient of res.data) {
          try {
            const labRes = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/labresults/patient/${patient._id}`,
              {
                headers: { Authorization: `Bearer ${auth.token}` },
              }
            );
            results[patient._id] = labRes.data.length > 0;
          } catch (error) {
            console.error(
              `Error fetching lab results for ${patient._id}:`,
              error
            );
          }
        }
        setResultsAvailable(results);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();

    const interval = setInterval(() => {
      fetchCriticalAlerts();
    }, 10000);
    return () => clearInterval(interval);
  }, [auth.token]);

  const fetchCriticalAlerts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/labresults/critical-alerts`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setCriticalAlerts(res.data);
    } catch (err) {
      console.error("Error fetching critical alerts:", err);
    }
  };

  const fetchLabResults = async (patientId) => {
    try {
      setSelectedPatient(patientId);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/labresults/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setLabResults(res.data);
      setLabModalOpen(true);
    } catch (err) {
      console.error("Error fetching lab results:", err);
    }
  };

  const closeModal = () => {
    setLabModalOpen(false);
    setLabResults([]);
    setSelectedPatient(null);
  };

  const markResultAsResolved = async (labResultId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/labresults/resolve/${labResultId}`,
        null,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert("Lab result marked as resolved.");
      setLabResults(labResults.filter((result) => result._id !== labResultId)); // Remove resolved result from list
      fetchCriticalAlerts(); // Refresh critical alerts
    } catch (err) {
      console.error("Error marking result as resolved:", err);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Typography variant="h4" color="primary">
        Doctor Dashboard
      </Typography>

      {criticalAlerts.length > 0 && (
        <div className="w-full max-w-md mt-8 mb-4">
          {criticalAlerts.map((alert, index) => (
            <Alert key={index} severity="error" className="mb-2">
              {alert.message}
            </Alert>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Grid container spacing={2}>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Grid item xs={12} md={6} lg={6} key={patient._id}>
                <Card
                  className="w-full shadow-lg"
                  style={{ minWidth: "500px", width: "100%" }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="h6" color="textPrimary">
                          {patient.name}
                        </Typography>
                        <Typography color="textSecondary" className="text-sm">
                          Age: {patient.age}
                        </Typography>
                        <Typography color="textSecondary" className="text-sm">
                          Gender: {patient.gender}
                        </Typography>
                        <Typography color="textSecondary" className="text-sm">
                          Medical Condition: {patient.medicalCondition}
                        </Typography>
                        <Typography color="textSecondary" className="text-sm">
                          Notes: {patient.notes || "None"}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        {resultsAvailable[patient._id] ? (
                          <IconButton
                            color="primary"
                            onClick={() => fetchLabResults(patient._id)}
                          >
                            <Visibility />
                          </IconButton>
                        ) : (
                          <Typography color="textSecondary" className="text-sm">
                            No Results
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" className="mt-4">
              No patients assigned yet.
            </Typography>
          )}
        </Grid>
      </div>

      <Dialog open={labModalOpen} onClose={closeModal} maxWidth="lg">
        <DialogTitle>
          Lab Results for{" "}
          {patients.find((p) => p._id === selectedPatient)?.name}
        </DialogTitle>
        <DialogContent>
          {labResults.length > 0 ? (
            labResults.map((result) => (
              <div key={result._id} className="mb-4">
                <Typography variant="subtitle2" color="textPrimary">
                  {result.testType}
                </Typography>
                <Typography color="textSecondary" className="text-sm">
                  Result: {result.result}
                </Typography>
                <Typography color="textSecondary" className="text-sm">
                  Date: {new Date(result.createdAt).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => markResultAsResolved(result._id)}
                  style={{ marginTop: "10px" }}
                >
                  Mark as Resolved
                </Button>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No lab results available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
