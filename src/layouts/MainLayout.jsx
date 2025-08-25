// src/layouts/MainLayout.jsx
import { useLocation, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout() {
  const location = useLocation()
  const noFooterPaths = ["/login", "/register", "/forgot-password", "/reset-password"]

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Outlet />
      </main>
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </>
  )
}
