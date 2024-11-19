import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/authentication/Login";
import RegisterPage from "./components/authentication/RegisterPage";
import Navigation from "./layouts/Navigation";
import EmployeeTable from "./components/employee/EmployeeTable";
import AddEmployeeForm from "./components/authentication/AddEmployeeForm";
import Employeecreate from "./components/employee/Employeecreate";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Navigation */}
        <Route path="/" element={<Login />} />
        <Route path="/reg" element={<RegisterPage />} />

        {/* Routes with Navigation */}
        <Route element={<AppLayout />}>
          <Route path="/addemp" element={<AddEmployeeForm />} />
          <Route path="/emptab" element={<EmployeeTable />} />
          <Route path="/createmp" element={<Employeecreate />} />
          <Route path="/edit/:id" element={<Employeecreate />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;