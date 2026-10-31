import { validateEnquiry, type ValidatedEnquiry } from './validation.ts'

export type EnquiryNotificationStatus = 'not_configured' | 'pending' | 'sent' | 'failed'

export interface EnquiryDeliverySnapshot extends ValidatedEnquiry {
  reference: string
  sourcePage: string
}

export interface PersistedEnquiry {
  status: 'saved'
  reference: string
  notificationStatus: EnquiryNotificationStatus
  shouldNotify: boolean
  duplicate: boolean
  deliverySnapshot: EnquiryDeliverySnapshot
}

export type EnquiryPersistenceResult =
  | { status: 'rate_limited' }
  | PersistedEnquiry

export type SubmissionOutcome =
  | { status: 'invalid'; fieldErrors: Record<string, string> }
  | { status: 'rate_limited' }
  | { status: 'notification_pending'; reference: string }
  | { status: 'notification_failed'; reference: string; statusUpdateFailed: boolean }
  | {
      status: 'sent'
      reference: string
      duplicate: boolean
      statusUpdateFailed: boolean
    }

export interface SubmissionDependencies {
  persist: (
    enquiry: ValidatedEnquiry & { sourcePage: string },
    clientIdentifier: string,
  ) => Promise<EnquiryPersistenceResult>
  notify: (enquiry: EnquiryDeliverySnapshot) => Promise<{ success: boolean }>
  updateNotificationStatus: (
    submissionId: string,
    status: 'sent' | 'failed',
  ) => Promise<void>
}

export async function processEnquirySubmission(
  input: unknown,
  clientIdentifier: string,
  sourcePage: string,
  dependencies: SubmissionDependencies,
): Promise<SubmissionOutcome> {
  const validation = validateEnquiry(input)
  if (!validation.success) {
    return { status: 'invalid', fieldErrors: validation.fieldErrors }
  }

  const persisted = await dependencies.persist(
    { ...validation.value, sourcePage },
    clientIdentifier,
  )

  if (persisted.status === 'rate_limited') return { status: 'rate_limited' }

  if (persisted.notificationStatus === 'sent') {
    return {
      status: 'sent',
      reference: persisted.reference,
      duplicate: persisted.duplicate,
      statusUpdateFailed: false,
    }
  }

  if (!persisted.shouldNotify) {
    return { status: 'notification_pending', reference: persisted.reference }
  }

  let notificationSucceeded = false
  try {
    notificationSucceeded = (await dependencies.notify(persisted.deliverySnapshot)).success
  } catch {
    notificationSucceeded = false
  }

  if (!notificationSucceeded) {
    let statusUpdateFailed = false
    try {
      await dependencies.updateNotificationStatus(validation.value.submissionId, 'failed')
    } catch {
      statusUpdateFailed = true
    }

    return {
      status: 'notification_failed',
      reference: persisted.reference,
      statusUpdateFailed,
    }
  }

  let statusUpdateFailed = false
  try {
    await dependencies.updateNotificationStatus(validation.value.submissionId, 'sent')
  } catch {
    statusUpdateFailed = true
  }

  return {
    status: 'sent',
    reference: persisted.reference,
    duplicate: persisted.duplicate,
    statusUpdateFailed,
  }
}
