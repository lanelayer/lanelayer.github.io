import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Developers from './pages/Developers'

/** Watches all [data-reveal] elements and adds .is-visible when they enter the viewport */
function ScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    // Small delay lets React finish painting the new page before we query the DOM
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]')
      if (!els.length) return

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )

      els.forEach(el => io.observe(el))
      return () => io.disconnect()
    }, 80)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollReveal />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/use-cases" element={<Navigate to="/developers" replace />} />
          <Route path="/tosichain" element={<Navigate to="/developers" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
