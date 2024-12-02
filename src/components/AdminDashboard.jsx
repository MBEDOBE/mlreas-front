import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddUserModal from "./AddUserModal";
import AddPatientModal from "./AddPatientModal";
import axios from "axios";

const AdminDashboard = () => {
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [openThresholdModal, setOpenThresholdModal] = useState(false);
  const [formData, setFormData] = useState({
    testType: "",
    minValue: "",
    maxValue: "",
  });
  const [selectedTab, setSelectedTab] = useState(0);

  const handleUserModal = () => setOpenUserModal(!openUserModal);
  const handlePatientModal = () => setOpenPatientModal(!openPatientModal);
  const handleThresholdModal = () => setOpenThresholdModal(!openThresholdModal);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    // Fetch Users Data
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch Patients Data
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

    // Fetch Threshold Data
    const fetchThresholds = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/thresholds`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setThresholds(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchPatients();
    fetchThresholds();
  }, []);

  const handleThresholdSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/thresholds`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setThresholds([...thresholds, res.data]);
      handleThresholdModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Typography variant="h4" color="primary" className="mb-4">
        Admin Dashboard
      </Typography>

      {/* Buttons to Open Modals */}
      <div className="flex gap-4 mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleUserModal}
          className="mb-4"
        >
          Add New User
        </Button>
        <AddUserModal open={openUserModal} handleOpen={handleUserModal} />

        <Button
          variant="contained"
          color="primary"
          onClick={handlePatientModal}
          className="mb-4"
        >
          Add New Patient
        </Button>
        <AddPatientModal
          open={openPatientModal}
          handleOpen={handlePatientModal}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleThresholdModal}
          className="mb-4"
        >
          Add New Threshold
        </Button>
      </div>

      {/* Tabs for Users, Patients, and Thresholds */}
      <Box sx={{ width: "100%", maxWidth: 1024 }} className="mt-6">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="users, patients, and thresholds tabs"
        >
          <Tab label="Users" />
          <Tab label="Patients" />
          <Tab label="Thresholds" />
        </Tabs>

        {/* Users Table */}
        {selectedTab === 0 && (
          <Card className="w-full mt-4">
            <CardContent>
              <Typography variant="h6" color="primary" className="mb-2">
                Users
              </Typography>
              {users.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  No users available.
                </Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Patients Table */}
        {selectedTab === 1 && (
          <Card className="w-full mt-4">
            <CardContent>
              <Typography variant="h6" color="primary" className="mb-2">
                Patients
              </Typography>
              {patients.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  No patients available.
                </Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Medical Condition</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Assigned Doctor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.medicalCondition}</TableCell>
                        <TableCell>{patient.notes || "N/A"}</TableCell>
                        <TableCell>
                          {patient.doctorId?.name || "Unassigned"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Thresholds Table */}
        {selectedTab === 2 && (
          <Card className="w-full mt-4">
            <CardContent>
              <Typography variant="h6" color="primary" className="mb-2">
                Thresholds
              </Typography>
              {thresholds.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  No thresholds available.
                </Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Test Type</TableCell>
                      <TableCell>Min Value</TableCell>
                      <TableCell>Max Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {thresholds.map((threshold) => (
                      <TableRow key={threshold._id}>
                        <TableCell>{threshold.testType}</TableCell>
                        <TableCell>{threshold.minValue}</TableCell>
                        <TableCell>{threshold.maxValue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Add Threshold Modal */}
      <Dialog open={openThresholdModal} onClose={handleThresholdModal}>
        <DialogTitle>Add New Threshold</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Test Type"
            name="testType"
            value={formData.testType}
            onChange={(e) =>
              setFormData({ ...formData, testType: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Min Value"
            name="minValue"
            type="number"
            value={formData.minValue}
            onChange={(e) =>
              setFormData({ ...formData, minValue: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Value"
            name="maxValue"
            type="number"
            value={formData.maxValue}
            onChange={(e) =>
              setFormData({ ...formData, maxValue: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleThresholdModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleThresholdSubmit} color="primary">
            Add Threshold
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
