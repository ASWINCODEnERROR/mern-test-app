import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import AddEmplopyForm from './components/authentication/AddEmployeeForm.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* < /> */}
  </StrictMode>,
)
