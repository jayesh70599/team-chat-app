import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom' // Import Router

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 1. Wraps App for routing */}
      <AuthContextProvider> {/* 2. Wraps App for User State */}
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)