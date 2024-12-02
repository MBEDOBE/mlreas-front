import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import AddLabResult from "../AddLabResult";

const LabTechnicianDashboard = () => {
  const [labResults, setLabResults] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/labresults", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLabResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLabResults();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Typography variant="h4" color="primary" className="mb-4">
        Lab Technician Dashboard
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Lab Result
      </Button>

      {/* Add Lab Result Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Lab Result</DialogTitle>
        <DialogContent>
          <AddLabResult />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lab Results Table */}
      {labResults.length === 0 ? (
        <Typography variant="body1" color="textSecondary" className="mt-4">
          No lab results available.
        </Typography>
      ) : (
        <TableContainer component={Paper} className="mt-4">
          <Table aria-label="lab results table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Test Type</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labResults
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((result) => (
                  <TableRow key={result._id}>
                    <TableCell>{result.patientId?.name}</TableCell>
                    <TableCell>{result.testType}</TableCell>
                    <TableCell>{result.result}</TableCell>
                    <TableCell>
                      {new Date(result.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <TablePagination
            component="div"
            count={labResults.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default LabTechnicianDashboard;
