import logo from '../assets/logo-full.png'
import './Home.css'

const STATS = [
  { value: '100%',    label: 'Commercial Focus'    },
  { value: 'Free',    label: 'Inspections & Quotes' },
  { value: 'KS + US', label: 'Service Coverage'    },
  { value: '2024',    label: 'Founded in Lawrence'  },
]

export default function Home() {
  return (
    <section id="home" className="home">
      {/* Geometric background accent */}
      <div className="home__bg-grid" aria-hidden="true" />
      <div className="home__bg-gradient" aria-hidden="true" />

      <div className="home__content container">
        <div className="home__left">
          <p className="home__eyebrow">Commercial Roofing Specialists</p>
          <h1 className="home__headline">
            Built to<br />
            <span className="home__headline-accent">Seal.</span>{' '}
            Built to<br />
            <span className="home__headline-accent">Shield.</span>
          </h1>
          <p className="home__sub">
            Protecting Kansas businesses with premium roofing solutions —
            from Conklin liquid coatings to full commercial installations.
            Trusted, reliable, and built to last.
          </p>
          <div className="home__actions">
            <a
              href="#contact"
              className="home__btn home__btn--primary"
              onClick={e => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get a Free Quote
            </a>
            <a
              href="#services"
              className="home__btn home__btn--secondary"
              onClick={e => {
                e.preventDefault()
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Our Services
            </a>
          </div>
        </div>

        <div className="home__right">
          <div className="home__logo-wrap">
            <div className="home__logo-ring" aria-hidden="true" />
            <img src={logo} alt="Seal and Shield LLC Logo" className="home__logo" />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="home__stats">
        <div className="container home__stats-inner">
          {STATS.map(stat => (
            <div key={stat.label} className="home__stat">
              <span className="home__stat-value">{stat.value}</span>
              <span className="home__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
