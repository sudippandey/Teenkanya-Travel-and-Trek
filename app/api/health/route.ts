import { getSupabaseServerConnection, isSupabaseConfigured } from '@/lib/supabase/server-client'
import { logEvent } from '@/lib/observability/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CheckState = 'ok' | 'not_configured' | 'unavailable'

async function checkDatabase(): Promise<CheckState> {
  if (!isSupabaseConfigured()) return 'not_configured'
  try {
    const { client } = getSupabaseServerConnection()
    const { error } = await client.from('enquiries').select('id', { head: true, count: 'planned' }).limit(1)
    return error ? 'unavailable' : 'ok'
  } catch {
    return 'unavailable'
  }
}

export async function GET() {
  const database = await checkDatabase()
  const notifications: CheckState = process.env.WEB3FORMS_ACCESS_KEY ? 'ok' : 'not_configured'
  const healthy = database === 'ok' && notifications === 'ok'

  if (!healthy) logEvent('warn', 'health.degraded', { database, notifications })

  return Response.json(
    { status: healthy ? 'ok' : 'degraded', checks: { database, notifications }, at: new Date().toISOString() },
    { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
