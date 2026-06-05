import logoSimple from '../assets/logo-simple.png'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={logoSimple} alt="Seal and Shield LLC" className="footer__logo" />
          <div>
            <p className="footer__brand-name">Seal &amp; Shield LLC</p>
            <p className="footer__brand-tagline">Commercial Roofing — Lawrence, Kansas</p>
          </div>
        </div>

        <nav className="footer__nav">
          {['home','services','about','contact'].map(id => (
            <button key={id} className="footer__link" onClick={() => scrollTo(id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </nav>

        <div className="footer__contact">
          <a href="tel:7853041957" className="footer__phone">(785) 304-1957</a>
          <p className="footer__hours">Mon – Fri &nbsp;|&nbsp; 8 a.m. – 5 p.m.</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} Seal and Shield LLC. All rights reserved. Lawrence, Kansas.</p>
      </div>
    </footer>
  )
}
