import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Developers from './pages/Developers'
function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build-first-lane" element={<Home scrollTo="build-first-lane" />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/use-cases" element={<Navigate to="/developers" replace />} />
          <Route path="/tosichain" element={<Navigate to="/developers" replace />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  )
}

export default App
