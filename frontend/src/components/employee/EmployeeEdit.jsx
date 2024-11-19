import React from 'react'

const EmployeeEdit = () => {
  return (
    <div>
      
    </div>
  )
}

export default EmployeeEdit


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const EmployeeEdit = () => {
//   const { id } = useParams(); // Get employee ID from URL parameters
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     f_Name: "",
//     f_Email: "",
//     f_Mobile: "",
//     f_Designation: "",
//     f_Gender: "",
//     f_Course: [],
//   });
//   const [f_Image, setF_Image] = useState(null);

//   useEffect(() => {
//     if (id) {
//       // Fetch existing employee data
//       axios
//         .get(`http://localhost:5000/api/employees/${id}`)
//         .then((response) => {
//           const data = response.data.employee;
//           setFormData({
//             f_Name: data.f_Name || "",
//             f_Email: data.f_Email || "",
//             f_Mobile: data.f_Mobile || "",
//             f_Designation: data.f_Designation || "",
//             f_Gender: data.f_Gender || "",
//             f_Course: data.f_Course || [],
//           });
//           setF_Image(data.f_Image || null);
//         })
//         .catch((error) => {
//           console.error("Error fetching employee data:", error);
//           alert("Failed to load employee data.");
//         });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       if (checked) {
//         setFormData((prevState) => ({
//           ...prevState,
//           f_Course: [...prevState.f_Course, value],
//         }));
//       } else {
//         setFormData((prevState) => ({
//           ...prevState,
//           f_Course: prevState.f_Course.filter((course) => course !== value),
//         }));
//       }
//     } else {
//       setFormData((prevState) => ({ ...prevState, [name]: value }));
//     }
//   };

//   const handleFileChange = (e) => {
//     setF_Image(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("f_Name", formData.f_Name);
//       data.append("f_Email", formData.f_Email);
//       data.append("f_Mobile", formData.f_Mobile);
//       data.append("f_Designation", formData.f_Designation);
//       data.append("f_Gender", formData.f_Gender);
//       data.append("f_Course", JSON.stringify(formData.f_Course)); // Ensure course is passed as JSON
//       if (f_Image) {
//         data.append("f_Image", f_Image);
//       }

//       const response = await axios.put(
//         `http://localhost:5000/api/employees/${id}`,
//         data
//       );
//       console.log("Updating Employee ID********:", id);


//       alert("Employee updated successfully!");
//       navigate("/emptab"); // Navigate back to the employee list
//     } catch (error) {
//       console.error("Error updating employee:", error);
//       alert("Failed to update employee.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
//       <h1 className="text-2xl font-bold mb-4">Edit Employee!!!!!!!!!!   </h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700 font-medium">Name</label>
//           <input
//             type="text"
//             name="f_Name"
//             value={formData.f_Name}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Email</label>
//           <input
//             type="email"
//             name="f_Email"
//             value={formData.f_Email}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Mobile</label>
//           <input
//             type="number"
//             name="f_Mobile"
//             value={formData.f_Mobile}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Designation</label>
//           <select
//             name="f_Designation"
//             value={formData.f_Designation}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             required
//           >
//             <option value="">Select Designation</option>
//             <option value="Manager">Manager</option>
//             <option value="Developer">Developer</option>
//             <option value="Designer">Designer</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Gender</label>
//           <div className="flex space-x-4">
//             <label>
//               <input
//                 type="radio"
//                 name="f_Gender"
//                 value="Male"
//                 checked={formData.f_Gender === "Male"}
//                 onChange={handleChange}
//                 required
//               />
//               Male
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="f_Gender"
//                 value="Female"
//                 checked={formData.f_Gender === "Female"}
//                 onChange={handleChange}
//                 required
//               />
//               Female
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="f_Gender"
//                 value="Other"
//                 checked={formData.f_Gender === "Other"}
//                 onChange={handleChange}
//                 required
//               />
//               Other
//             </label>
//           </div>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Courses</label>
//           <div className="flex space-x-4">
//             {["MCA", "BCA", "BSC"].map((course) => (
//               <label key={course}>
//                 <input
//                   type="checkbox"
//                   name="f_Course"
//                   value={course}
//                   checked={formData.f_Course.includes(course)}
//                   onChange={handleChange}
//                 />
//                 {course}
//               </label>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium">Image</label>
//           <input
//             type="file"
//             name="f_Image"
//             onChange={handleFileChange}
//             className="w-full border rounded px-3 py-2"
//           />
//           {f_Image && <img src={`http://localhost:5000/${f_Image}`} alt="Employee" className="mt-2 w-24 h-24 object-cover" />}
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
//         >
//           Update Employee
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EmployeeEdit;

