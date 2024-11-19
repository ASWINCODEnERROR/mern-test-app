import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Employeecreate = () => {
  const { id } = useParams(); // Get employee ID from URL
  const navigate = useNavigate(); // Navigation hook
  const [errors, setErrors] = useState({});
  // State for form data
  const [formData, setFormData] = useState({
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Designation: "",
    f_Gender: "",
    f_Course: [],
  });

  const [f_Image, setF_Image] = useState(null); // State for file upload

  useEffect(() => {
    // Fetch employee details if `id` exists (for edit functionality)
    if (id) {
      axios
        .get(`http://localhost:5000/api/employees/${id}`)
        .then((response) => {
          const data = response.data.employee;
          setFormData({
            f_Name: data.f_Name || "",
            f_Email: data.f_Email || "",
            f_Mobile: data.f_Mobile || "",
            f_Designation: data.f_Designation || "",
            f_Gender: data.f_Gender || "",
            f_Course: data.f_Course || [],
          });
          setF_Image(data.f_Image || null);
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
          alert("Failed to load employee data.");
        });
    }
  }, [id]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        f_Course: checked
          ? [...prevState.f_Course, value]
          : prevState.f_Course.filter((course) => course !== value),
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.f_Name.trim()) newErrors.f_Name = "Name is required";
    if (!formData.f_Email.trim()) newErrors.f_Email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.f_Email))
      newErrors.f_Email = "Email is not valid";
    if (!formData.f_Mobile.trim()) newErrors.f_Mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(formData.f_Mobile))
      newErrors.f_Mobile = "Mobile must be a 10-digit number";
    if (!formData.f_Designation.trim())
      newErrors.f_Designation = "Designation is required";
    if (!formData.f_Gender.trim()) newErrors.f_Gender = "Gender is required";
    if (formData.f_Course.length === 0) newErrors.f_Course = "At least one course is required";

    if (f_Image && !["image/png", "image/jpeg"].includes(f_Image.type)) {
      newErrors.f_Image = "Only PNG and JPG images are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailDuplicate = async () => {
    if (!id) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees?email=${formData.f_Email}`
        );
        return response.data.exists;
      } catch (error) {
        console.error("Error checking email duplication:", error);
        return false;
      }
    }
    return false;
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setF_Image(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()){
      return;
    } 

    const isDuplicate = await checkEmailDuplicate();
    if (isDuplicate) {
      setErrors((prev) => ({ ...prev, f_Email: "Email already exists" }));
      return;
    }
    try {
      const data = new FormData();
      data.append("f_Name", formData.f_Name);
      data.append("f_Email", formData.f_Email);
      data.append("f_Mobile", formData.f_Mobile);
      data.append("f_Designation", formData.f_Designation);
      data.append("f_Gender", formData.f_Gender);
      data.append("f_Course", JSON.stringify(formData.f_Course));
      if (f_Image) {
        data.append("f_Image", f_Image);
      }
      console.log('Data being sent:////', formData);

      // Update or create employee
      if (id) {
        // Update
        await axios.put(`http://localhost:5000/api/employees/${id}`, data);
        alert("Employee updated successfully!");
      } else {
        // Create
        await axios.post("http://localhost:5000/api/employees", data);
        alert("Employee added successfully!");
      }
      navigate("/emptab"); // Redirect to employee table or list
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Employee" : "Add Employee"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="f_Name"
            value={formData.f_Name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.f_Name && (
            <p className="text-red-500 text-sm">{errors.f_Name}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="f_Email"
            value={formData.f_Email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.f_Email && (
            <p className="text-red-500 text-sm">{errors.f_Email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Mobile</label>
          <input
            type="number"
            name="f_Mobile"
            value={formData.f_Mobile}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.f_Mobile && (
            <p className="text-red-500 text-sm">{errors.f_Mobile}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Designation</label>
          <select
            name="f_Designation"
            value={formData.f_Designation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Designation</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
          </select>
          {errors.f_Designation && (
            <p className="text-red-500 text-sm">{errors.f_Designation}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Gender</label>
          <div className="flex space-x-4">
            {["Male", "Female", "Other"].map((gender) => (
              <label key={gender}>
                <input
                  type="radio"
                  name="f_Gender"
                  value={gender}
                  checked={formData.f_Gender === gender}
                  onChange={handleChange}
                  required
                />
                {gender}
              </label>
            ))}
          </div>
          {errors.f_Gender && (
            <p className="text-red-500 text-sm">{errors.f_Gender}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Courses</label>
          <div className="flex space-x-4">
            {["MCA", "BCA", "BSC"].map((course) => (
              <label key={course}>
                <input
                  type="checkbox"
                  name="f_Course"
                  value={course}
                  checked={formData.f_Course.includes(course)}
                  onChange={handleChange}
                />
                {course}
              </label>
            ))}
          </div>
          {errors.f_Course && (
            <p className="text-red-500 text-sm">{errors.f_Course}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Image</label>
          <input
            type="file"
            name="f_Image"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.f_Image && (
            <p className="text-red-500 text-sm">{errors.f_Image}</p>
          )}
          {f_Image && !id && (
            <img
              src={URL.createObjectURL(f_Image)}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover"
            />
          )}
          {id && f_Image && typeof f_Image === "string" && (
            <img
              src={`http://localhost:5000/${f_Image}`}
              alt="Employee"
              className="mt-2 w-24 h-24 object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          {id ? "Update Employee" : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default Employeecreate;
