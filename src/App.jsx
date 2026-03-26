import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Build from './pages/Build'

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/build-first-lane" element={<Home scrollTo="build-first-lane" />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Route>
        <Route path="/build" element={<Build />} />
      </Routes>
    </HashRouter>
  )
}

export default App
