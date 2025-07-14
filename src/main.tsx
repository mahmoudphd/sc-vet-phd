import React from 'react'
import ReactDOM from 'react-dom/client'
import Bootstrap from './Bootstrap.tsx'
import './i18n/config'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Bootstrap />
  </React.StrictMode>,
)