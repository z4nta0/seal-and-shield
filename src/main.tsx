import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AppRooCom } from './app.tsx'
import './styles/fonts.css'
import './styles/styles.css'

ReactDOM.createRoot(document.getElementById('appMouDiv')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRooCom />
    </BrowserRouter>
  </React.StrictMode>
)
