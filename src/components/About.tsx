import { useEffect, useRef } from 'react'
import logo from '../assets/logo-full.png'
import './About.css'

const VALUES = [
  {
    title: 'Integrity',
    desc: 'We show up, tell the truth, and do the work right. No hidden costs, no shortcuts.'
  },
  {
    title: 'Quality',
    desc: 'We use premium materials — Conklin-certified products — and back our work with professional craftsmanship.'
  },
  {
    title: 'Reliability',
    desc: 'From the first inspection to the final walk-through, Seal and Shield is there every step of the way.'
  },
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="container">
        <div className="about__layout">
          {/* Left: Logo accent */}
          <div className="about__visual fade-up">
            <div className="about__logo-bg" aria-hidden="true" />
            <img src={logo} alt="Seal and Shield LLC" className="about__logo" />
            <div className="about__info-card">
              <div className="about__info-row">
                <span className="about__info-label">Founded</span>
                <span className="about__info-value">2024</span>
              </div>
              <div className="about__info-row">
                <span className="about__info-label">Based In</span>
                <span className="about__info-value">Lawrence, KS</span>
              </div>
              <div className="about__info-row">
                <span className="about__info-label">Phone</span>
                <a href="tel:7853041957" className="about__info-value about__info-link">
                  (785) 304-1957
                </a>
              </div>
              <div className="about__info-row">
                <span className="about__info-label">Hours</span>
                <span className="about__info-value">8 a.m. – 5 p.m.</span>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="about__text">
            <p className="section-label fade-up">Who We Are</p>
            <h2 className="section-title fade-up">About Seal &amp; Shield</h2>
            <div className="divider fade-up" />
            <p className="about__body fade-up">
              Seal and Shield LLC was founded in 2024 with a simple mission: provide Kansas businesses
              with trustworthy, high-quality commercial roofing they can count on for years to come.
              Based in Lawrence, Kansas, we combine hands-on expertise with premium materials to
              deliver results that protect your investment.
            </p>
            <p className="about__body fade-up">
              As an authorized Conklin distributor, we have direct access to some of the most
              advanced commercial roofing coatings available — and we back every job with the
              kind of craftsmanship and communication that earns long-term relationships.
            </p>

            {/* Values */}
            <div className="about__values">
              {VALUES.map((v, i) => (
                <div key={v.title} className="about__value fade-up" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="about__value-marker" aria-hidden="true" />
                  <div>
                    <h4 className="about__value-title">{v.title}</h4>
                    <p className="about__value-desc">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
