// src/layouts/MainLayout.jsx
import { useLocation, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout() {
  const location = useLocation()
  const noFooterPaths = ["/login", "/register", "/forgot-password", "/reset-password"]

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar always at top */}
      <Navbar />

      {/* Main content should grow and push footer down */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>

      {/* Footer only if not in auth pages */}
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  )
}
