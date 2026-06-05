import { useState, useEffect } from 'react'
import logoSimple from '../assets/logo-simple.png'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home',     href: '#home'     },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about'    },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Highlight active section
      const sections = ['home', 'services', 'about', 'contact']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <a
          className="navbar__brand"
          href="#home"
          onClick={e => { e.preventDefault(); handleNav('#home') }}
        >
          <img src={logoSimple} alt="Seal and Shield LLC" className="navbar__logo" />
          <span className="navbar__brand-text">
            <span className="navbar__brand-main">Seal & Shield</span>
            <span className="navbar__brand-sub">LLC</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="navbar__nav">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`navbar__link ${active === link.href.replace('#', '') ? 'navbar__link--active' : ''}`}
              onClick={e => { e.preventDefault(); handleNav(link.href) }}
            >
              {link.label}
            </a>
          ))}
          <a href="tel:7853041957" className="navbar__cta">
            (785) 304-1957
          </a>
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            className="navbar__mobile-link"
            onClick={e => { e.preventDefault(); handleNav(link.href) }}
          >
            {link.label}
          </a>
        ))}
        <a href="tel:7853041957" className="navbar__mobile-cta">
          (785) 304-1957
        </a>
      </div>
    </header>
  )
}
