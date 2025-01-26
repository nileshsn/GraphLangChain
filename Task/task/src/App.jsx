import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import ResetPassword from './Pages/ResetPassword/ResetPassword'

const routes = (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>{routes}</div>
  )
};

export default App;