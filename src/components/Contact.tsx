import { useState, useRef, useEffect } from 'react'
import { type FormEvent } from 'react'
import './Contact.css'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '', message: ''
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Form submission placeholder
    const myForm = e.target as HTMLFormElement;
    const formData = new FormData(myForm) as unknown as Record<string, string>;

    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    }).catch(error => alert(error));
    setSubmitted(true);
    setForm({ name: '', company: '', phone: '', email: '', message: '' });
    window.setTimeout(() => setSubmitted(false), 6000);
  }

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      {/* Background accent */}
      <div className="contact__bg" aria-hidden="true" />

      <div className="container contact__inner">
        {/* Left: Info */}
        <div className="contact__info">
          <p className="section-label fade-up">Get In Touch</p>
          <h2 className="section-title light fade-up">Request a Free<br />Quote Today</h2>
          <div className="divider fade-up" />
          <p className="contact__info-body fade-up">
            Ready to protect your commercial roof? Reach out to Seal and Shield LLC for
            a free inspection or quote. We serve Lawrence, Topeka, the Kansas City metro,
            and beyond.
          </p>

          <div className="contact__details fade-up">
            <div className="contact__detail">
              <span className="contact__detail-icon">📍</span>
              <div>
                <span className="contact__detail-label">Location</span>
                <span className="contact__detail-value">Lawrence, Kansas</span>
              </div>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-icon">📞</span>
              <div>
                <span className="contact__detail-label">Phone</span>
                <a href="tel:7853041957" className="contact__detail-value contact__detail-link">
                  (785) 304-1957
                </a>
              </div>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-icon">🕐</span>
              <div>
                <span className="contact__detail-label">Business Hours</span>
                <span className="contact__detail-value">Monday – Friday, 8 a.m. – 5 p.m.</span>
              </div>
            </div>
          </div>

          <a href="tel:7853041957" className="contact__phone-btn fade-up">
            Call Now: (785) 304-1957
          </a>
        </div>

        {/* Right: Form */}
        <div className="contact__form-wrap fade-up">
          {submitted ? (
            <div className="contact__success">
              <span className="contact__success-icon">✓</span>
              <h3 className="contact__success-title">Message Sent!</h3>
              <p className="contact__success-body">
                Thank you for reaching out. Seal and Shield LLC will be in touch shortly.
              </p>
            </div>
          ) : (
            <form name='contactForm' className="contact__form" onSubmit={handleSubmit} noValidate data-netlify="true">
              <h3 className="contact__form-title">Free Quote Request</h3>
              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name" name="name" type="text" required
                    placeholder="John Smith"
                    value={form.name} onChange={handleChange}
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company" name="company" type="text"
                    placeholder="ABC Business LLC"
                    value={form.company} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone" name="phone" type="tel" required
                    placeholder="(555) 000-0000"
                    value={form.phone} onChange={handleChange}
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email"
                    placeholder="john@example.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="contact__field contact__field--full">
                <label htmlFor="message">Tell us about your roof</label>
                <textarea
                  id="message" name="message" rows={4}
                  placeholder="Describe your commercial roof, square footage, current issues, or any questions..."
                  value={form.message} onChange={handleChange}
                />
              </div>
              <input type="hidden" name="form-name" value="contactForm" />
              <button type="submit" className="contact__submit">
                Submit Free Quote Request
              </button>
              <p className="contact__form-note">
                No spam. We'll only contact you regarding your roofing inquiry.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
