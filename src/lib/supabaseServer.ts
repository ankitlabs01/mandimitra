/**
 * ==============================================================================
 * MANDI MITRA AI — SERVER-SIDE SUPABASE CLIENT & AUTH VERIFICATION
 * ==============================================================================
 * Server-only execution. Never import this module in Client Components.
 * Uses SUPABASE_SERVICE_ROLE_KEY securely without leaking to the browser bundle.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Server-side Admin Client (Service Role) - only created when service role key exists
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient) return adminClient;

  if (supabaseUrl && serviceRoleKey && serviceRoleKey.length > 20) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    return adminClient;
  }
  return null;
}

// Standard Server-side Client (Anon Key)
export function getSupabaseServerClient(): SupabaseClient {
  const key = serviceRoleKey || anonKey || 'placeholder-anon-key';
  const url = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Server-side helper to verify user JWT token from incoming Request headers
 */
export async function verifyServerAuth(req: Request): Promise<{
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  error?: string;
}> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAuthenticated: false, error: 'Missing or malformed Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return { isAuthenticated: false, error: 'Empty token' };
    }

    const client = getSupabaseServerClient();
    const { data: { user }, error } = await client.auth.getUser(token);

    if (error || !user) {
      return { isAuthenticated: false, error: error?.message || 'Invalid authentication token' };
    }

    return {
      isAuthenticated: true,
      userId: user.id,
      email: user.email,
    };
  } catch (err: any) {
    return { isAuthenticated: false, error: err.message || 'Token verification failed' };
  }
}
