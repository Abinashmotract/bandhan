// src/App.jsx
import ClickSpark from "./components/ClickSpark.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import AppRoutes from "./routes"

function App() {
  return (
    <>
      <ClickSpark color="#ff5722" />
      <ScrollToTop />
      <AppRoutes />
    </>
  )
}

export default App
