import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"

// Pages
import HomePage from "./pages/HomePage"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Profile from "./pages/Profile"
import SuccessStories from "./pages/SuccessStories"

export default function AppRoutes() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success-stories" element={<SuccessStories />} />

          {/* 404 - Page Not Found */}
          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                404 - Page Not Found
              </h2>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  )
}
