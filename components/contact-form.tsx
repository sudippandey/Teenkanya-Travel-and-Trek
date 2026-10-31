'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    setError('')
    setSubmitted(true)
    form.reset()
  }

  return <div className="contact-form-wrap">
    {submitted ? <div className="form-success" role="status"><span className="success-icon"><Check aria-hidden="true" /></span><span className="eyebrow">DETAILS VALIDATED</span><h3>Thank you for getting in touch.</h3><p>This enquiry form is a frontend preview and has not sent your message. Please call or email us directly for now.</p><div className="success-actions"><a href="tel:+9779851248173">Call +977 9851248173</a><a href="mailto:3kanya2018@gmail.com">Email our team</a></div><button type="button" className="text-link" onClick={() => setSubmitted(false)}>Send another enquiry</button></div> : <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row"><label>Your name<input name="name" autoComplete="name" required minLength={2} placeholder="Full name" /></label><label>Email address<input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></label></div>
      <div className="form-row"><label>Phone (optional)<input type="tel" name="phone" autoComplete="tel" placeholder="+977" /></label><label>What are you planning?<select name="interest" defaultValue=""><option value="" disabled>Select an interest</option><option>Tour or holiday</option><option>Trekking</option><option>Travel service</option><option>Something else</option></select></label></div>
      <label>Your message<textarea name="message" rows={5} required minLength={10} placeholder="Tell us a little about your journey..." /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-submit-row"><p>By submitting, you agree that our team may contact you about this enquiry.</p><button className="button button-primary" type="submit">Send an enquiry <ArrowUpRight aria-hidden="true" /></button></div>
      <p className="form-disclaimer">Preview form only — online submissions will be connected in a future development phase.</p>
    </form>}
  </div>
}
