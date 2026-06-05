import { useEffect, useRef } from 'react'
import './Services.css'

const SERVICES = [
  {
    icon: '🏗️',
    title: 'Full Roof Installation',
    desc: 'Complete commercial roof installations built to last. We handle every phase — from tear-off and substrate prep to final coating application.',
  },
  {
    icon: '🔧',
    title: 'Patching & Repairs',
    desc: 'Targeted commercial roof repairs that stop leaks and prevent further damage. We diagnose the problem and fix it right the first time.',
  },
  {
    icon: '📞',
    title: 'Service Calls',
    desc: 'If your roof is leaking but may not need a full replacement, we\'ll come out, assess the situation, and recommend the most cost-effective solution.',
  },
  {
    icon: '🔍',
    title: 'Free Inspections',
    desc: 'No-obligation roof inspections to assess the current condition of your commercial roof. Know exactly what you\'re working with before committing to anything.',
  },
  {
    icon: '💧',
    title: 'Conklin Liquid Coatings',
    desc: 'As an authorized Conklin distributor, we specialize in high-performance liquid roof coatings — seamless, reflective, and built for the Kansas climate.',
  },
  {
    icon: '🛡️',
    title: 'TPO & EPDM Roofing',
    desc: 'We install both TPO (thermoplastic polyolefin) and EPDM rubber roofing membranes — durable, low-maintenance solutions for flat and low-slope commercial roofs.',
  },
  {
    icon: '🌀',
    title: 'Spray Foam Sealing',
    desc: 'Closed-cell spray polyurethane foam provides excellent insulation and a seamless moisture barrier — perfect for problem areas and penetrations.',
  },
  {
    icon: '📋',
    title: 'Free Quotes',
    desc: 'Transparent, detailed quotes at no cost or obligation. Know what the project involves and what it costs before any work begins.',
  },
]

const AREAS = [
  'Lawrence, KS',
  'Topeka, KS',
  'Kansas City Metro',
  'All of Kansas',
  'Continental U.S.',
]

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80)
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
    <section id="services" className="services" ref={sectionRef}>
      <div className="container">
        <div className="services__header fade-up">
          <p className="section-label">What We Do</p>
          <h2 className="section-title">Our Services</h2>
          <div className="divider" />
          <p className="services__intro">
            Seal and Shield LLC is a full-service commercial roofing company.
            Whether you need a complete new roof, a targeted repair, or just peace of mind from a professional inspection —
            we have you covered.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map(service => (
            <div key={service.title} className="services__card fade-up">
              <span className="services__card-icon">{service.icon}</span>
              <h3 className="services__card-title">{service.title}</h3>
              <p className="services__card-desc">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Service area */}
        <div className="services__area fade-up">
          <div className="services__area-text">
            <p className="section-label">Where We Work</p>
            <h3 className="section-title">Service Area</h3>
            <div className="divider" />
            <p className="services__area-desc">
              Based in Lawrence, Kansas, Seal and Shield serves businesses across all of Kansas —
              including Topeka, Lawrence, and the greater Kansas City metro area.
              We're also willing to travel anywhere in the continental United States for the right project.
            </p>
          </div>
          <div className="services__area-tags">
            {AREAS.map(area => (
              <span key={area} className="services__area-tag">{area}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
