import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
