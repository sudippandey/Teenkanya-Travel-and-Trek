'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { track } from '@vercel/analytics'
import { getWhatsAppHref } from '@/lib/contact-links'
import { TrackedLink } from '@/components/tracked-link'

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
  const [servicePrefill, setServicePrefill] = useState({
    key: '',
    interest: '',
    message: '',
  })

  useEffect(() => {
    if (!submitted || !successRef.current) return
    successRef.current.focus()
    successRef.current.scrollIntoView({ block: 'start' })
  }, [submitted])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const serviceSlug = params.get('service') ?? ''
    const serviceNames: Record<string, string> = {
      flights: 'Flights and air tickets',
      bus: 'Bus tickets and future service updates',
      hotels: 'Hotel reservations',
      vehicles: 'Vehicles and transfers',
      'tours-trekking': 'Tours and trekking',
      assistance: 'Travel assistance',
    }
    const serviceName = serviceNames[serviceSlug]
    const packageName = params.get('package') ?? ''
    const destination = params.get('destination') ?? params.get('trek') ?? ''
    const requestedInterest = params.get('interest') ?? ''
    const interest = ['tour', 'trekking', 'travel_service', 'other'].includes(requestedInterest)
      ? requestedInterest
      : serviceName
        ? 'travel_service'
        : ''
    const message = params.get('message') ?? (packageName
      ? `I am interested in ${packageName}${destination ? ` in ${destination}` : ''}. Please let me know more about this trip.`
      : destination
        ? `I am interested in visiting ${destination}. Please let me know more about this trip.`
        : serviceName
          ? serviceSlug === 'bus'
            ? 'I would like to ask about future updates for bus ticket support. Please let me know when this service becomes available.'
            : `I am interested in ${serviceName.toLowerCase()}. Please let me know what options may be available.`
          : '')

    const key = [serviceSlug, packageName, destination, interest, message].join('|')
    if (key !== '||||') setServicePrefill({ key, interest, message })
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || isSubmitting) return

    const contactData = new FormData(form)
    if (!String(contactData.get('email') ?? '').trim() && !String(contactData.get('phone') ?? '').trim()) {
      setFieldErrors({ contact: 'Add a phone number or email address so our team can reply.' })
      return
    }

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
      interest: formData.get('interest'),
      message: formData.get('message'),
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
        track('enquiry_submission', {
          interest: typeof payload.interest === 'string' ? payload.interest : 'other',
          focus: 'unspecified',
        })
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

  function clearContactError() {
    setFieldErrors((previous) => {
      if (!previous.contact) return previous
      const next = { ...previous }
      delete next.contact
      return next
    })
  }

  return <div className="contact-form-wrap">
    {submitted ? <div ref={successRef} className="form-success" role="status" tabIndex={-1}>
      <span className="success-icon"><Check aria-hidden="true" /></span>
      <span className="eyebrow">ENQUIRY SENT</span>
      <h3>Thank you for getting in touch.</h3>
      <p>Your enquiry has been saved and the notification process has been accepted. This is not a booking confirmation. If you do not hear back, contact our team directly.</p>
      {successReference && <p className="success-reference">Reference: <strong>{successReference}</strong></p>}
      <div className="success-actions"><TrackedLink href="tel:+9779851248173" eventName="contact_click" eventProperties={{ channel: 'phone', location: 'enquiry_success' }}>Call +977 9851248173</TrackedLink><TrackedLink href={getWhatsAppHref('Hello Teenkanya, I would like to follow up on my enquiry.')} target="_blank" rel="noreferrer" eventName="whatsapp_click" eventProperties={{ location: 'enquiry_success' }}>WhatsApp</TrackedLink><TrackedLink href="mailto:3kanya2018@gmail.com" eventName="contact_click" eventProperties={{ channel: 'email', location: 'enquiry_success' }}>Email our team</TrackedLink></div>
      <button type="button" className="text-link" onClick={() => { setSubmitted(false); startNewEnquiry() }}>Send another enquiry</button>
    </div> : <form key={servicePrefill.key || 'default'} className="contact-form" onSubmit={handleSubmit}>
      <header className="contact-form-heading">
        <h2>Plan Your Trip With Us</h2>
        <p>Tell us a little about what you&apos;re looking for. Our team will help with the rest.</p>
      </header>
      <label htmlFor="enquiry-full-name">Full name
        <input id="enquiry-full-name" name="fullName" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your name" disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? 'enquiry-full-name-error' : undefined} />
        {fieldErrors.fullName && <span className="field-error" id="enquiry-full-name-error">{fieldErrors.fullName}</span>}
      </label>
      <div className="form-row form-contact-row">
        <label htmlFor="enquiry-phone">Phone number / WhatsApp <span className="optional-note">(required if no email)</span>
          <input id="enquiry-phone" type="tel" name="phone" autoComplete="tel" maxLength={30} placeholder="+977 98XXXXXXXX" onChange={clearContactError} disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.phone || fieldErrors.contact)} aria-describedby={[fieldErrors.phone ? 'enquiry-phone-error' : '', fieldErrors.contact ? 'enquiry-contact-error' : ''].filter(Boolean).join(' ') || undefined} />
          {fieldErrors.phone && <span className="field-error" id="enquiry-phone-error">{fieldErrors.phone}</span>}
        </label>
        <label htmlFor="enquiry-email">Email address <span className="optional-note">(optional if phone provided)</span>
          <input id="enquiry-email" type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@example.com" onChange={clearContactError} disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.email || fieldErrors.contact)} aria-describedby={[fieldErrors.email ? 'enquiry-email-error' : '', fieldErrors.contact ? 'enquiry-contact-error' : ''].filter(Boolean).join(' ') || undefined} />
          {fieldErrors.email && <span className="field-error" id="enquiry-email-error">{fieldErrors.email}</span>}
        </label>
      </div>
      {fieldErrors.contact && <p className="field-error" id="enquiry-contact-error" role="alert">{fieldErrors.contact}</p>}
      <label htmlFor="enquiry-interest">Travel interest
        <select id="enquiry-interest" name="interest" defaultValue={servicePrefill.interest} required disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.interest)} aria-describedby={fieldErrors.interest ? 'enquiry-interest-error' : undefined}>
          <option value="" disabled>Select what you&apos;re interested in</option>
          <option value="tour">Tour or holiday</option>
          <option value="trekking">Trekking</option>
          <option value="travel_service">Travel services</option>
          <option value="other">Something else</option>
        </select>
        {fieldErrors.interest && <span className="field-error" id="enquiry-interest-error">{fieldErrors.interest}</span>}
      </label>
      <label htmlFor="enquiry-message">Message <span className="optional-note">(optional)</span>
        <textarea id="enquiry-message" name="message" rows={4} defaultValue={servicePrefill.message} maxLength={3000} placeholder="Tell us where you'd like to go or what you have in mind..." disabled={isSubmitting || submissionLocked} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? 'enquiry-message-error' : undefined} />
        {fieldErrors.message && <span className="field-error" id="enquiry-message-error">{fieldErrors.message}</span>}
      </label>
      <label className="contact-form-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {error && <div className="form-error" role="alert">
        <p>{error}</p>
        {failureReference && <p>Saved enquiry reference: <strong>{failureReference}</strong></p>}
        {submissionLocked && <button type="button" className="text-link" onClick={startNewEnquiry}>Edit details and submit as a new enquiry</button>}
      </div>}
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : submissionLocked ? 'Retry submission' : 'Send Enquiry'} <ArrowUpRight aria-hidden="true" /></button>
        <TrackedLink className="whatsapp-alternative" href={getWhatsAppHref('Hello Teenkanya, I would like to discuss my travel plans.')} target="_blank" rel="noreferrer" eventName="whatsapp_click" eventProperties={{ location: 'contact_form' }}>Or chat with us on WhatsApp</TrackedLink>
      </div>
      <p className="form-reassurance">No commitment. Our team will contact you to discuss your plans.</p>
      <p className="form-disclaimer">Your details are only used to respond to your enquiry. <a href="/privacy">Privacy notice</a></p>
    </form>}
  </div>
}
