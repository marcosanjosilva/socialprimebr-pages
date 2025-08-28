
// assets/auth-login.js
// Liga a página de Login ao Supabase sem alterar o layout.
const sp = window.supabase;
(function attach(){
  const scope = document.querySelector('main, section, .card, body');
  if(!sp || !scope){ console.warn('Supabase ou escopo não encontrado'); return; }

  const email = scope.querySelector('input[type="email"], input[name*="email" i]');
  const password = scope.querySelector('input[type="password"]');
  // Procura um botão/link com texto "Entrar" ou "Login"
  const btn = [...scope.querySelectorAll('button, a, input[type="submit"]')]
    .find(el => /(^|\s)(entrar|login)(\s|$)/i.test(el.textContent || el.value || ''));

  function msg(text, ok=false){
    let box = document.getElementById('sp-msg');
    if(!box){ box = document.createElement('div'); box.id='sp-msg'; box.style.marginTop='10px'; scope.appendChild(box); }
    box.textContent = text || '';
    box.style.color = ok ? '#9be79b' : '#ff9aa2';
  }

  async function doLogin(){
    if(!email || !password){ msg('Campos não encontrados na página.'); return; }
    const e = (email.value||'').trim();
    const p = password.value||'';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){ msg('E-mail inválido.'); return; }
    if(p.length < 6){ msg('Senha muito curta.'); return; }
    msg('Entrando...');
    const { error } = await sp.auth.signInWithPassword({ email: e, password: p });
    if(error){ msg(error.message); return; }
    // Redireciona
    location.href = 'dashboard.html';
  }

  // Se houver <form>, intercepta
  const form = scope.querySelector('form');
  if(form){ form.addEventListener('submit', (ev)=>{ ev.preventDefault(); doLogin(); }); }

  if(btn){
    btn.addEventListener('click', (ev)=>{
      // Evita navegação padrão se for <a>
      ev.preventDefault();
      doLogin();
    });
  }

  // Enter em inputs
  [email, password].forEach(x=> x && x.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ e.preventDefault(); doLogin(); }
  }));
})();
