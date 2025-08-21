import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Pages import karo
import HomePage from "./pages/HomePage"
import SearchPage from "./pages/SearchPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Search */}
        <Route path="/search" element={<SearchPage />} />

        {/* Profile (dynamic route with userId) */}
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 404 Page */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  )
}
