import React, { useState, useEffect } from "react";
import axios from "axios";
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
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const toggleOrder = () => setOrder(order === "asc" ? "desc" : "asc");
  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Employee Table
      </h2>

      {/* Search and Sort Controls */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Sort By</option>
          <option value="f_Name">Name</option>
          <option value="f_Email">Email</option>
          <option value="_id">ID</option>
        </select>

        {/* Toggle Order Button */}
        <button
          onClick={toggleOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Order: {order === "asc" ? "Ascending" : "Descending"}
        </button>
        <div>
          <button className="mr-10 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
            <a href="/createmp">Add Employee</a>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                id
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Image
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Name
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Email
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Mobile
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Designation
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Gender
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Course
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Status
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id} className="border-t">
                {/* <td className="px-4 py-2">{employee._id}</td> */}
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:5000/${employee.f_Image}`} // Use full URL if needed
                    alt={employee.f_Name}
                    className="w-16 h-16 rounded object-cover mx-auto"
                    onError={(e) => (e.target.src = "/default-image.png")}
                  />
                </td>
                {/* <td className="px-4 py-2">{employee.f_Image}</td> */}
                <td className="px-4 py-2">{employee.f_Name}</td>
                <td className="px-4 py-2">{employee.f_Email}</td>
                <td className="px-4 py-2">{employee.f_Mobile}</td>
                <td className="px-4 py-2">{employee.f_Designation}</td>
                <td className="px-4 py-2">{employee.f_Gender}</td>
                <td className="px-4 py-2">{employee.f_Course}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={async () => {
                      await axios.put(
                        `http://localhost:5000/api/employees/${employee._id}/active`,
                        { isActive: !employee.isActive }
                      );
                      fetchEmployees();
                    }}
                    className={`px-4 py-2 rounded text-white ${
                      employee.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(employee._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await axios.delete(
                        `http://localhost:5000/api/employees/${employee._id}`
                      );
                      fetchEmployees();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded shadow ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded shadow ${
            page === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
