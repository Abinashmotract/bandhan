import { useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout({ children }) {
  const location = useLocation()

  const noFooterPaths = ["/login", "/register"]

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        {children}
      </main>
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </>
  )
}
