import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Login from './login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Getstarted from './getstarted.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path = "/login" element ={<Login/>} />
    <Route path = "/getstarted" element={<Getstarted/>} />
    <Route path= "/" element={<App/>} />
  </Routes>
  </BrowserRouter>
)

