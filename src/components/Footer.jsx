import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-top">
          <Link to="/" className="footer-logo">
            <img src="https://lanelayer.com/assets/images/logo.png" alt="LaneLayer" />
          </Link>
          <div className="footer-columns">
            <div className="footer-col">
              <h4>Platform</h4>
              <a href="https://lanelayer.com" target="_blank" rel="noopener noreferrer">Docs</a>
              <Link to="/how-it-works">How it works</Link>
              <Link to="/developers">Developers</Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="https://discord.gg/F9GwH7zzJm" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="https://lanelayer.com/legal" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
              <a href="https://lanelayer.com/legal" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-newsletter">
            <p>Sign up to our newsletter</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email" aria-label="Email" required />
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>LaneLayer</p>
          <div className="footer-social">
            <a href="https://discord.gg/F9GwH7zzJm" target="_blank" rel="noopener noreferrer" aria-label="Discord">Discord</a>
            <a href="https://twitter.com/lanelayer" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
