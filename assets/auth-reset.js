
// assets/auth-reset.js
// Liga a página de Recuperar Senha ao Supabase sem alterar o layout.
const sp = window.supabase;
(function attach(){
  const scope = document.querySelector('main, section, .card, body');
  if(!sp || !scope){ console.warn('Supabase ou escopo não encontrado'); return; }

  const email = scope.querySelector('input[type="email"], input[name*="email" i]');
  const btn = [...scope.querySelectorAll('button, a, input[type="submit"]')]
    .find(el => /(enviar|recuperar|reset|redefinir)/i.test(el.textContent || el.value || ''));

  function msg(text, ok=false){
    let box = document.getElementById('sp-msg');
    if(!box){ box = document.createElement('div'); box.id='sp-msg'; box.style.marginTop='10px'; scope.appendChild(box); }
    box.textContent = text || '';
    box.style.color = ok ? '#9be79b' : '#ff9aa2';
  }

  async function doReset(){
    const e = (email?.value||'').trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){ msg('Informe um e-mail válido.'); return; }
    msg('Enviando...');
    const { error } = await sp.auth.resetPasswordForEmail(e, { redirectTo: location.origin + '/login.html' });
    if(error){ msg(error.message); return; }
    msg('Se existir conta, enviamos um link de recuperação.', true);
  }

  const form = scope.querySelector('form');
  if(form){ form.addEventListener('submit', (ev)=>{ ev.preventDefault(); doReset(); }); }
  if(btn){ btn.addEventListener('click', (ev)=>{ ev.preventDefault(); doReset(); }); }
})();
