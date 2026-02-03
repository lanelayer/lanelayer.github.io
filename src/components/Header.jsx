import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="LaneLayer home">
          <img src="https://lanelayer.com/assets/images/logo.png" alt="LaneLayer" className="logo-img" />
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/developers">Developers</Link>
          <a href="https://docs.lanelayer.com" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="https://discord.gg/F9GwH7zzJm" target="_blank" rel="noopener noreferrer">Discord</a>
        </nav>
      </div>
    </header>
  )
}
