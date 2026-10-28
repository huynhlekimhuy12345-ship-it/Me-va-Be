import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installDemoApi } from './lib/demoApi'

// Bản demo frontend-only: mọi request /api/* được phục vụ từ localStorage
// (demoStore.js), không cần backend Express/SQLite.
installDemoApi()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
