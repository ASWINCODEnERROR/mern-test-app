import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };
  useEffect(() => {
    fetchEmployees();
  }, [search, sortBy, order, page]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees", {
        params: { search, sortBy, order, page, limit: 10 },
      });
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } 
    catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleOrder = () => setOrder(order === "asc" ? "desc" : "asc");
  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      <h2>Employee Table</h2>

      {/* Search Input */}
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: "10px", marginRight: "10px" }}
      />

      {/* Sort Dropdown */}
      <Select value={sortBy} onChange={handleSortChange}>
        <MenuItem value="">None</MenuItem>
        <MenuItem value="f_Name">Name</MenuItem>
        <MenuItem value="f_Email">Email</MenuItem>
        <MenuItem value="_id">ID</MenuItem>
      </Select>

      {/* Toggle Order Button */}
      <Button onClick={toggleOrder}>Order: {order === "asc" ? "Ascending" : "Descending"}</Button>

      {/* Employee Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell>{employee.f_Name}</TableCell>
              <TableCell>{employee.f_Email}</TableCell>
              <TableCell>{employee.f_Mobile}</TableCell>
              <TableCell>{employee.f_Designation}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={employee.isActive ? "success" : "error"}
                  onClick={async () => {
                    await axios.put(`http://localhost:5000/api/employees/${employee._id}/active`, { isActive: !employee.isActive });
                    fetchEmployees();
                  }}
                >
                  {employee.isActive ? "Active" : "Inactive"}
                </Button>
              </TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleEdit(employee._id)}>Edit</Button>
                <Button color="secondary" onClick={async () => {
                  await axios.delete(`http://localhost:5000/api/employees/${employee._id}`);
                  fetchEmployees(); // Refresh data
                }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div>
        <Button onClick={prevPage} disabled={page === 1}>
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={nextPage} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default EmployeeTable;