import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Home } from './pages/home.jsx'
import { Site } from './site.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Site />
  </StrictMode>,
)
