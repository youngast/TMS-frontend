import MainPage from './pages/MainPage'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <MainPage viewmode={"list"}/>
      <Outlet />
    </>
  )
}

export default App
