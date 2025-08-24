import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRoutes from "./routes"
import ClickSpark from './components/ClickSpark.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ClickSpark color="#ff5722" /> */}
    <AppRoutes />
  </StrictMode>,
)
