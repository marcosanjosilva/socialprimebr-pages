
/* global sp */
window.SP_URL = 'https://ojxabliahndxbgnaitqc.supabase.co';
window.SP_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGFibGlhaG5keGJnbmFpdHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzUzOTUsImV4cCI6MjA3MTkxMTM5NX0.KuVPdhzJrBDvgK1JM0LXIKzB-l7ufh3cterzy3MaZbE';

// Initialise a single global Supabase client as `sp` without changing layout.
(function(){
  if (window.sp) {
    return; // already initialised
  }
  // Load supabase-js v2 as an ESM module and expose a global client
  const m = document.createElement('script');
  m.type = 'module';
  m.textContent = `
    import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
    window.sp = createClient(window.SP_URL, window.SP_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    // notify any listeners that the client is ready
    window.dispatchEvent(new Event('sp-ready'));
  `;
  document.head.appendChild(m);
})();
