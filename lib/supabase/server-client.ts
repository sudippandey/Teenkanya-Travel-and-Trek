import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null
let cachedSecret: string | null = null

export function isSupabaseConfigured() {
  return Boolean(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)
    && (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY),
  )
}

export function getSupabaseServerConnection() {
  if (cachedClient && cachedSecret) return { client: cachedClient, secret: cachedSecret }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !secret) throw new Error('Supabase server credentials are not configured')

  const timedFetch: typeof fetch = (input, init) => {
    const timeoutSignal = AbortSignal.timeout(2_000)
    const signal = init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal
    return fetch(input, { ...init, signal })
  }

  cachedClient = createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: { fetch: timedFetch },
  })
  cachedSecret = secret

  return { client: cachedClient, secret }
}
