import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: { fontSize: 13, borderRadius: 12 },
        success: { style: { background: '#d1fae5', color: '#065f46' } },
        error:   { style: { background: '#fee2e2', color: '#991b1b' } },
      }}
    />
  </StrictMode>,
)
