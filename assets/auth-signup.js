
// assets/auth-signup.js
// Liga a página de Cadastro ao Supabase sem alterar o layout.
const sp = window.supabase;
(function attach(){
  const scope = document.querySelector('main, section, .card, body');
  if(!sp || !scope){ console.warn('Supabase ou escopo não encontrado'); return; }

  const inputs = [...scope.querySelectorAll('input')];
  // Tenta identificar campos por placeholder, name ou ordem (Nome, Sobrenome, Email, Senha)
  const first = inputs.find(i => /(nome|first)/i.test(i.placeholder||i.name||'')) || inputs.find(i => i.type==='text');
  const last  = inputs.find(i => /(sobrenome|last)/i.test(i.placeholder||i.name||'')) || inputs.filter(i=>i.type==='text')[1];
  const email = inputs.find(i => i.type==='email') || inputs.find(i => /(email)/i.test(i.placeholder||i.name||''));
  const password = inputs.find(i => i.type==='password');
  const btn = [...scope.querySelectorAll('button, a, input[type="submit"]')]
    .find(el => /(criar conta|cadastrar|cadastro|registrar)/i.test(el.textContent || el.value || ''));

  function msg(text, ok=false){
    let box = document.getElementById('sp-msg');
    if(!box){ box = document.createElement('div'); box.id='sp-msg'; box.style.marginTop='10px'; scope.appendChild(box); }
    box.textContent = text || '';
    box.style.color = ok ? '#9be79b' : '#ff9aa2';
  }

  function cap(text){
    if(!text) return '';
    return text.replace(/\s+/g,' ').trim().replace(/\b\p{L}/gu, m => m.toUpperCase());
  }

  async function doSignup(){
    if(!email || !password){ msg('Campos principais não encontrados.'); return; }
    const e = (email.value||'').trim();
    const p = password.value||'';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){ msg('E-mail inválido.'); return; }
    if(p.length < 8){ msg('A senha deve ter 8+ caracteres.'); return; }

    const fn = cap(first?.value || '');
    const ln = cap(last?.value || '');

    msg('Criando conta...');
    const { error } = await sp.auth.signUp({
      email: e,
      password: p,
      options: {
        data: { first_name: fn, last_name: ln },
        emailRedirectTo: location.origin + '/login.html'
      }
    });
    if(error){ msg(error.message); return; }
    msg('Conta criada! Verifique seu e-mail para confirmar.', true);
  }

  const form = scope.querySelector('form');
  if(form){ form.addEventListener('submit', (ev)=>{ ev.preventDefault(); doSignup(); }); }
  if(btn){ btn.addEventListener('click', (ev)=>{ ev.preventDefault(); doSignup(); }); }
})();
