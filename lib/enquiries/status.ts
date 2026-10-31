export const enquiryStatuses = ['new', 'contacted', 'quoted', 'confirmed', 'closed', 'spam'] as const
export type EnquiryStatus = (typeof enquiryStatuses)[number]

export const allowedStatusTransitions: Record<EnquiryStatus, readonly EnquiryStatus[]> = {
  new: ['contacted', 'closed', 'spam'],
  contacted: ['quoted', 'closed', 'spam'],
  quoted: ['contacted', 'confirmed', 'closed'],
  confirmed: ['closed'],
  closed: ['contacted'],
  spam: ['new'],
}

export function isEnquiryStatus(value: unknown): value is EnquiryStatus {
  return typeof value === 'string' && (enquiryStatuses as readonly string[]).includes(value)
}

export function canTransitionEnquiryStatus(from: EnquiryStatus, to: EnquiryStatus) {
  return allowedStatusTransitions[from].includes(to)
}
