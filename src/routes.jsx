// src/routes.jsx
import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"

// Pages
import HomePage from "./pages/HomePage"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Profile from "./pages/Profile"
import SuccessStories from "./pages/SuccessStories"
import Membership from "./pages/Membership"
import ContactUs from "./pages/ContactUs"
import PartnerMatchesPage from "./pages/PartnerMatchesPage"
import FAQPage from "./pages/FAQPage"
import SearchPage from "./pages/SearchPage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout Route */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/matches" element={<PartnerMatchesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* 404 - Page Not Found (keeps Navbar; Footer depends on your rule) */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 - Page Not Found
            </h2>
          }
        />
      </Route>
    </Routes>
  )
}
