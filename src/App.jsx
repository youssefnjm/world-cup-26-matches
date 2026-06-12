import { RouterProvider } from 'react-router-dom'
import './App.css'
import LandingPage from './Pages/LandingPage'
import { router } from './Router/router'

function App() {

  return (<>
    <RouterProvider router={router} />
    {/* <LandingPage /> */}
  </>)
}

export default App
