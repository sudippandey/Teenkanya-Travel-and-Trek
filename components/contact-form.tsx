'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || submitting) return

    const formData = new FormData(form)
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: crypto.randomUUID(),
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          countryOfResidence: formData.get('countryOfResidence'),
          preferredContactChannel: 'email',
          interest: formData.get('interest'),
          message: formData.get('message'),
          travelStartDate: formData.get('travelStartDate'),
          datesFlexible: formData.get('datesFlexible') === 'on',
          travellerCount: formData.get('travellerCount'),
          website: formData.get('website'),
        }),
      })
      const result = await response.json() as { message?: string; reference?: string }

      if (!response.ok) {
        throw new Error(result.message ?? 'We could not send your enquiry. Please try again.')
      }

      setReference(result.reference ?? '')
      form.reset()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We could not send your enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="contact-form-wrap">
    {reference ? <div className="form-success" role="status">
      <span className="success-icon"><Check aria-hidden="true" /></span>
      <span className="eyebrow">ENQUIRY RECEIVED</span>
      <h3>Thank you for getting in touch.</h3>
      <p>Your enquiry has been received. Keep this reference for your records: <strong>{reference}</strong>.</p>
      <div className="success-actions"><a href="tel:+9779851248173">Call +977 9851248173</a><a href="mailto:3kanya2018@gmail.com">Email our team</a></div>
      <button type="button" className="text-link" onClick={() => setReference('')}>Send another enquiry</button>
    </div> : <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-honeypot" aria-hidden="true"><label>Leave this field blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-row">
        <label>Your name<input name="fullName" autoComplete="name" required minLength={2} maxLength={120} placeholder="Full name" /></label>
        <label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      </div>
      <div className="form-row">
        <label>Phone (optional)<input type="tel" name="phone" autoComplete="tel" maxLength={30} placeholder="+977" /></label>
        <label>Country of residence (optional)<input name="countryOfResidence" autoComplete="country-name" maxLength={100} placeholder="Country" /></label>
      </div>
      <div className="form-row">
        <label>What are you planning?<select name="interest" defaultValue="" required><option value="" disabled>Select an interest</option><option value="tour">Tour or holiday</option><option value="trekking">Trekking</option><option value="travel_service">Travel service</option><option value="other">Something else</option></select></label>
        <label>Approximate travel date (optional)<input type="date" name="travelStartDate" /></label>
      </div>
      <div className="form-row form-row-small">
        <label>Number of travelers (optional)<input type="number" name="travellerCount" min={1} max={50} step={1} placeholder="e.g. 2" /></label>
        <label className="checkbox-label"><input type="checkbox" name="datesFlexible" /> My dates are flexible</label>
      </div>
      <label>Your message<textarea name="message" rows={5} required minLength={10} maxLength={4000} placeholder="Tell us a little about your journey..." /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-submit-row"><p>By submitting, you agree that our team may contact you about this enquiry.</p><button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send an enquiry'} <ArrowUpRight aria-hidden="true" /></button></div>
      <p className="form-disclaimer">Your enquiry will be stored securely so our team can respond. We only use these details to follow up on your request.</p>
    </form>}
  </div>
}
