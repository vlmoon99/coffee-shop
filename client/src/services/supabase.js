import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('[Supabase] Init Check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'N/A'
});

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
    console.warn('[Supabase] Client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_KEY.');
} else {
    console.log('[Supabase] Client initialized successfully.');
}
