'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Magnetic } from '@/components/cinematic'
import { gsap } from '@/lib/gsap'

interface EnquiryResponse {
  status?: unknown
  error?: unknown
  message?: unknown
  reference?: unknown
  saved?: unknown
  fieldErrors?: unknown
}

function isRecord(value: unknown): value is EnquiryResponse {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getFieldErrors(value: unknown) {
  if (!isRecord(value) || typeof value.fieldErrors !== 'object' || value.fieldErrors === null) return {}
  return Object.fromEntries(
    Object.entries(value.fieldErrors).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  )
}

export function ContactForm() {
  const submissionId = useRef<string | null>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionLocked, setSubmissionLocked] = useState(false)
  const [error, setError] = useState('')
  const [failureReference, setFailureReference] = useState('')
  const [successReference, setSuccessReference] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!submitted || !successRef.current) return
    successRef.current.focus()
    successRef.current.scrollIntoView({ block: 'start' })

    const icon = successRef.current.querySelector('.success-icon')
    if (icon) {
      gsap.fromTo(icon, { scale: 0, rotation: -45 }, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })
    }
  }, [submitted])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || isSubmitting) return

    setError('')
    setFieldErrors({})
    setIsSubmitting(true)
    setSubmissionLocked(true)
    submissionId.current ??= crypto.randomUUID()

    const formData = new FormData(form)
    const payload = {
      submissionId: submissionId.current,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      countryOfResidence: formData.get('countryOfResidence'),
      preferredContactChannel: formData.get('preferredContactChannel'),
      interest: formData.get('interest'),
      message: formData.get('message'),
      travelStartDate: formData.get('travelStartDate'),
      datesFlexible: formData.get('datesFlexible') === 'on',
      travellerCount: formData.get('travellerCount') || null,
      website: formData.get('website'),
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let result: unknown = null
      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (response.ok && isRecord(result) && result.status === 'received' && typeof result.reference === 'string') {
        setSubmitted(true)
        setSubmissionLocked(false)
        setFailureReference('')
        setSuccessReference(result.reference)
        submissionId.current = null
        form.reset()
        return
      }

      const saved = isRecord(result) && result.saved === true
      const reference = isRecord(result) && typeof result.reference === 'string' ? result.reference : ''
      const validationErrors = getFieldErrors(result)
      setFieldErrors(validationErrors)

      if (saved) {
        setFailureReference(reference)
        setSubmissionLocked(true)
      } else if (response.status < 500) {
        setFailureReference('')
        setSubmissionLocked(false)
      }

      if (isRecord(result) && typeof result.message === 'string') {
        setError(result.message)
      } else {
        setError('We could not confirm this enquiry. Please retry with the same details or contact our team directly.')
      }
    } catch {
      setError('We could not confirm whether this enquiry was processed. Retry with the same details; the submission reference prevents duplicates.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function startNewEnquiry() {
    submissionId.current = null
    setSubmissionLocked(false)
    setFailureReference('')
    setError('')
    setFieldErrors({})
  }

  return <div className="contact-form-wrap">
    {submitted ? <div ref={successRef} className="form-success" role="status" tabIndex={-1}>
      <span className="success-icon"><Check aria-hidden="true" /></span>
      <span className="eyebrow">ENQUIRY SENT</span>
      <h3>Thank you for getting in touch.</h3>
      <p>Web3Forms confirmed your enquiry was submitted to our team. This is not a booking confirmation.</p>
      {successReference && <p className="success-reference">Reference: <strong>{successReference}</strong></p>}
      <div className="success-actions"><a href="tel:+9779851248173">Call +977 9851248173</a><a href="mailto:3kanya2018@gmail.com">Email our team</a></div>
      <Magnetic className="send-anchor"><button type="button" className="text-link" onClick={() => { setSubmitted(false); startNewEnquiry() }}>Send another enquiry</button></Magnetic>
    </div> : <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="enquiry-full-name">Your name
          <input id="enquiry-full-name" name="fullName" autoComplete="name" required minLength={2} maxLength={120} placeholder="Full name" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? 'enquiry-full-name-error' : undefined} />
          {fieldErrors.fullName && <span className="field-error" id="enquiry-full-name-error">{fieldErrors.fullName}</span>}
        </label>
        <label htmlFor="enquiry-email">Email address (optional if you provide a phone)
          <input id="enquiry-email" type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@example.com" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'enquiry-email-error' : undefined} />
          {fieldErrors.email && <span className="field-error" id="enquiry-email-error">{fieldErrors.email}</span>}
        </label>
      </div>
      <div className="form-row">
        <label htmlFor="enquiry-phone">Phone (optional if you provide an email)
          <input id="enquiry-phone" type="tel" name="phone" autoComplete="tel" maxLength={30} placeholder="+977" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'enquiry-phone-error' : undefined} />
          {fieldErrors.phone && <span className="field-error" id="enquiry-phone-error">{fieldErrors.phone}</span>}
        </label>
        <label htmlFor="enquiry-country">Country of residence
          <input id="enquiry-country" name="countryOfResidence" autoComplete="country-name" maxLength={100} placeholder="For example, Nepal" disabled={isSubmitting || submissionLocked} />
        </label>
      </div>
      <div className="form-row">
        <label htmlFor="enquiry-contact-channel">Preferred contact method
          <select id="enquiry-contact-channel" name="preferredContactChannel" defaultValue="email" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.preferredContactChannel)} aria-describedby={fieldErrors.preferredContactChannel ? 'enquiry-contact-channel-error' : undefined}>
            <option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option>
          </select>
          {fieldErrors.preferredContactChannel && <span className="field-error" id="enquiry-contact-channel-error">{fieldErrors.preferredContactChannel}</span>}
        </label>
        <label htmlFor="enquiry-interest">What are you planning?
          <select id="enquiry-interest" name="interest" defaultValue="" required disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.interest)} aria-describedby={fieldErrors.interest ? 'enquiry-interest-error' : undefined}>
            <option value="" disabled>Select an interest</option><option value="tour">Tour or holiday</option><option value="trekking">Trekking</option><option value="travel_service">Travel service</option><option value="other">Something else</option>
          </select>
          {fieldErrors.interest && <span className="field-error" id="enquiry-interest-error">{fieldErrors.interest}</span>}
        </label>
      </div>
      <div className="form-row">
        <label htmlFor="enquiry-travel-date">Preferred travel date
          <input id="enquiry-travel-date" type="date" name="travelStartDate" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.travelStartDate)} aria-describedby={fieldErrors.travelStartDate ? 'enquiry-travel-date-error' : undefined} />
          {fieldErrors.travelStartDate && <span className="field-error" id="enquiry-travel-date-error">{fieldErrors.travelStartDate}</span>}
        </label>
        <label htmlFor="enquiry-travellers">Number of travellers
          <input id="enquiry-travellers" type="number" name="travellerCount" min={1} max={50} step={1} placeholder="1" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.travellerCount)} aria-describedby={fieldErrors.travellerCount ? 'enquiry-travellers-error' : undefined} />
          {fieldErrors.travellerCount && <span className="field-error" id="enquiry-travellers-error">{fieldErrors.travellerCount}</span>}
        </label>
      </div>
      <label className="checkbox-label"><input type="checkbox" name="datesFlexible" disabled={isSubmitting || submissionLocked} /> My travel dates are flexible</label>
      <label htmlFor="enquiry-message">Your message
        <textarea id="enquiry-message" name="message" rows={5} required minLength={10} maxLength={4000} placeholder="Tell us a little about your journey..." disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? 'enquiry-message-error' : undefined} />
        {fieldErrors.message && <span className="field-error" id="enquiry-message-error">{fieldErrors.message}</span>}
      </label>
      <label className="contact-form-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {fieldErrors.contact && <p className="field-error" role="alert">{fieldErrors.contact}</p>}
      {error && <div className="form-error" role="alert">
        <p>{error}</p>
        {failureReference && <p>Saved enquiry reference: <strong>{failureReference}</strong></p>}
        {submissionLocked && <button type="button" className="text-link" onClick={startNewEnquiry}>Edit details and submit as a new enquiry</button>}
      </div>}
      <div className="form-submit-row"><p>Sending an enquiry does not confirm a booking. Our team will follow up using your preferred contact method.</p><Magnetic translateX={4} translateY={-6} className="submit-magnetic"><button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : submissionLocked ? 'Retry submission' : 'Send an enquiry'} <ArrowUpRight aria-hidden="true" /></button></Magnetic></div>
      <p className="form-disclaimer">Your details are used to respond to this enquiry. If a saved enquiry cannot be emailed, retrying uses the same reference and does not create a duplicate.</p>
    </form>}
  </div>
}
