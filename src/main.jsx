import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryProvider } from './providers/QueryProvider.jsx'
import { ThemeProvider } from './providers/ThemeProvider.jsx'
import { ToastProvider } from './providers/ToastProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>,
)