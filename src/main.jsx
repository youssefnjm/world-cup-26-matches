import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WC26Provider } from './Context/WC26.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WC26Provider>
      <App />
    </WC26Provider>
  </StrictMode>,
)
