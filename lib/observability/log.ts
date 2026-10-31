type LogValue = string | number | boolean | null
type LogLevel = 'info' | 'warn' | 'error'

/**
 * Structured operational log. Callers must only pass non-personal values
 * (event names, references, status codes, counts) — never names, emails,
 * phone numbers, messages, tokens or provider response bodies.
 */
export function logEvent(level: LogLevel, event: string, fields: Record<string, LogValue> = {}) {
  const entry = JSON.stringify({ level, event, ...fields, at: new Date().toISOString() })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.info(entry)
}
