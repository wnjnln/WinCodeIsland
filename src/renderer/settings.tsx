import React from 'react'
import ReactDOM from 'react-dom/client'
import { SettingsApp } from './settings-app/SettingsApp'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsApp />
  </React.StrictMode>
)
