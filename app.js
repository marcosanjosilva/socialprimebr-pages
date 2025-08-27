
// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
function cap(s){return s? (s[0].toUpperCase()+s.slice(1).toLowerCase()):'';}

// Assistant (demo via localStorage.assistant_url)
(function initAssistant(){
  const assistant = $('#assistant');
  const on = !location.pathname.includes('settings') && !location.pathname.includes('workspaces');
  if(on && matchMedia('(min-width:1150px)').matches){ document.body.classList.add('has-side'); if(assistant) assistant.style.display='block'; }
  const pop = $('#assistantPop');
  if(pop) pop.onclick = () => window.open('https://chat.openai.com','_blank');
  const url = localStorage.assistant_url || '';
  const sendBtn = $('#assistantSend');
  const input = $('#assistantInput');
  const log = $('#assistantLog');
  if(sendBtn && input && log){
    sendBtn.onclick = async ()=>{
      const q = input.value.trim(); if(!q) return;
      log.innerHTML += `<div><b>Você:</b> ${q}</div>`;
      input.value='';
      if(!url){ log.innerHTML += `<div><i>Defina <code>localStorage.assistant_url</code> com a URL do seu backend.</i></div>`; log.scrollTop=log.scrollHeight; return; }
      try{
        const r = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:q})});
        const j = await r.json();
        log.innerHTML += `<div><b>Assistente:</b> ${j.reply || '(sem resposta)'}</div>`;
      }catch(e){
        log.innerHTML += `<div><b>Erro:</b> ${e.message}</div>`;
      }
      log.scrollTop=log.scrollHeight;
    }
  }
})();

// Banner dinâmico no dashboard
(async function banner(){
  if(!location.pathname.endsWith('dashboard.html')) return;
  const banner = $('#banner');
  if(!banner) return;
  try{
    const r = await fetch('assets/banner.html?_='+Date.now());
    banner.innerHTML = await r.text();
  }catch(e){
    banner.innerHTML = '<div class="tile"><div class="title">Bem-vindo ao SocialPrimeBR!</div><div class="muted">Novidades em breve. Este banner é servido de assets/banner.html.</div></div>';
  }
})();

// Redes sociais do Dashboard (somente UI)
(function networks(){
  if(!location.pathname.endsWith('dashboard.html')) return;
  const NETS=['Instagram','Facebook','Threads','TikTok','Pinterest','YouTube','X','Google'];
  const grid = $('#netGrid');
  const pill = (name)=>`
    <div class="tile">
      <div class="title">${name}</div>
      <div class="muted">Integração em preparação.</div>
      <div class="row" style="margin-top:10px">
        <button class="btn sm" onclick="alert('Conectar ${name}: integrações serão adicionadas quando as APIs forem habilitadas.')">Conectar</button>
        <span class="badge">Não conectado</span>
      </div>
    </div>`;
  grid.innerHTML = NETS.map(pill).join('');
})();

// Calendário (UI + lista mensal demo)
(function calendar(){
  if(!location.pathname.endsWith('calendar.html')) return;
  const monthLabel = $('#calMonth');
  const grid = $('#calGrid');
  const list = $('#monthList');
  let d = new Date();
  function setMonth(dt){
    const month = dt.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
    monthLabel.textContent = month;
    build(dt);
  }
  function build(dt){
    grid.innerHTML='';
    const year = dt.getFullYear(); const month = dt.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay() || 7; // domingo => 7
    const days = new Date(year, month+1, 0).getDate();
    for(let i=1;i<startDay;i++) grid.appendChild(cell(''));
    for(let day=1; day<=days; day++) grid.appendChild(cell(day));
    // demo schedule
    const demo=[
      {date:`${year}-${(month+1+'').padStart(2,'0')}-03`, title:'Reels - Produto X', status:'Agendado'},
      {date:`${year}-${(month+1+'').padStart(2,'0')}-03`, title:'Story - Bastidores', status:'Agendado'},
      {date:`${year}-${(month+1+'').padStart(2,'0')}-03`, title:'Feed - Promoção', status:'Agendado'},
      {date:`${year}-${(month+1+'').padStart(2,'0')}-12`, title:'YouTube Shorts', status:'Agendado'},
      {date:`${year}-${(month+1+'').padStart(2,'0')}-20`, title:'TikTok teaser', status:'Agendado'},
    ];
    // render list
    list.innerHTML = demo.map(it=>`<div class="row">
      <div style="width:120px">${it.date.split('-').reverse().join('/')}</div>
      <div style="width:110px"><span class="badge">${it.status}</span></div>
      <div class="grow">${it.title}</div>
      <div style="width:160px" class="muted">Canais demo</div>
    </div>`).join('');
    // inject items per day (max 3 + "ver mais")
    $$('[data-day]').forEach(cellEl=>{
      const day = parseInt(cellEl.dataset.day);
      const mm = (month+1+'').padStart(2,'0');
      const dd = (day+'').padStart(2,'0');
      const dateKey = `${year}-${mm}-${dd}`;
      const items = demo.filter(x=>x.date===dateKey);
      const wrap = document.createElement('div');
      wrap.className='day-items';
      items.slice(0,3).forEach(x=>{
        const b=document.createElement('div'); b.className='badge'; b.textContent=x.title.slice(0,22);
        wrap.appendChild(b);
      });
      if(items.length>3){
        const more=document.createElement('div'); more.className='badge'; more.textContent='... ver mais';
        more.onclick = ()=> alert(items.map(i=>i.title).join('\n'));
        wrap.appendChild(more);
      }
      cellEl.appendChild(wrap);
      cellEl.onclick = ()=> alert(items.length? items.map(i=>i.title).join('\n') : 'Sem agendamentos no dia.');
    });
  }
  function cell(day){
    const el = document.createElement('div');
    el.className='tile day';
    if(day) { el.dataset.day=day; el.innerHTML='<div class="day-n">'+day+'</div>'; }
    return el;
  }
  $('#prevM').onclick=()=>{ d=new Date(d.getFullYear(), d.getMonth()-1, 1); setMonth(d); }
  $('#nextM').onclick=()=>{ d=new Date(d.getFullYear(), d.getMonth()+1, 1); setMonth(d); }
  setMonth(d);
})();

// Agendar (regras básicas de compatibilidade e limites de texto por canal)
(function schedule(){
  if(!location.pathname.endsWith('schedule.html')) return;
  const CH = [
    {key:'ig_feed', label:'IG Feed (Foto/Carrossel)', kind:'photo', maxPhotos:10, text:2200},
    {key:'ig_reels', label:'IG Reels (Vídeo)', kind:'video', text:2200},
    {key:'ig_story', label:'IG Story (Foto/Vídeo)', kind:'both', text:0},
    {key:'fb_feed', label:'Facebook (Foto/Vídeo)', kind:'both', text:63206},
    {key:'fb_reels', label:'FB Reels (Vídeo)', kind:'video', text:2200},
    {key:'pinterest', label:'Pinterest (Foto)', kind:'photo', text:500},
    {key:'tiktok', label:'TikTok (Vídeo)', kind:'video', text:2200},
    {key:'google', label:'Google (Post)', kind:'photo', text:1500},
    {key:'yt', label:'YouTube (Vídeo)', kind:'video', text:5000},
    {key:'yt_short', label:'YouTube Shorts (Vídeo)', kind:'video', text:100},
    {key:'x', label:'X/Twitter (Texto + Mídia)', kind:'both', text:280},
  ];
  const wrap = $('#channels');
  const legend = $('#legend');
  const media = $('#media');
  const addDateBtn = $('#addDate');
  const dates = $('#dates');
  function renderChips(){
    wrap.innerHTML = CH.map(c=>`<label class="chip"><input type="checkbox" value="${c.key}"><span>${c.label}</span></label>`).join('');
    wrap.onchange = updateRules;
  }
  function updateRules(){
    const sel = $$('input[type=checkbox]:checked', wrap).map(i=>i.value);
    const chosen = CH.filter(c=>sel.includes(c.key));
    // Determine required kind
    const kinds = new Set(chosen.map(c=>c.kind));
    // Incompatibilidades simples
    if(kinds.has('video') && kinds.has('photo')){
      alert('Você selecionou canais que exigem apenas vídeo e outros que permitem apenas fotos. Remova os incompatíveis.');
    }
    // Legend rules
    const allowsText = chosen.some(c=>c.text>0);
    legend.disabled = !allowsText;
    if(allowsText){
      const max = Math.min(...chosen.filter(c=>c.text>0).map(c=>c.text));
      legend.maxLength = max;
      $('#legendHint').textContent = `Legenda permitida (limite automático: ${max} caracteres de acordo com os canais).`;
    }else{
      $('#legendHint').textContent = 'Legenda desativada: os canais atuais não permitem texto.';
      legend.value='';
    }
    // Media accept (photo/video/both)
    let accept = '';
    if(kinds.size===1){
      const k=[...kinds][0];
      if(k==='photo') accept='image/*';
      if(k==='video') accept='video/*';
      if(k==='both') accept='image/*,video/*';
    }else if(kinds.size>1){
      accept='image/*,video/*';
    }
    media.setAttribute('accept', accept || 'image/*,video/*');
  }
  addDateBtn.onclick = ()=>{
    const row=document.createElement('div'); row.className='row';
    row.innerHTML = `<input type="date"> <input type="time"> <button class="btn sm ghost" type="button" onclick="this.parentElement.remove()">Remover</button>`;
    dates.appendChild(row);
  };
  renderChips(); updateRules();
})();

// Workspaces (front demo + hook para integração)
(function ws(){
  if(!location.pathname.endsWith('workspaces.html')) return;
  const list = $('#wsList');
  const input = $('#wsNew');
  $('#wsAdd').onclick = ()=>{
    const name = input.value.trim(); if(!name) return;
    const arr = JSON.parse(localStorage.getItem('sp_ws')||'[]');
    const item = {id: Date.now(), name, created_at:new Date().toISOString()};
    arr.push(item); localStorage.setItem('sp_ws', JSON.stringify(arr));
    input.value=''; render();
  };
  function render(){
    const arr = JSON.parse(localStorage.getItem('sp_ws')||'[]');
    list.innerHTML = arr.map(w=>`<div class="tile row row-ai">
      <div class="grow"><b>${cap(w.name)}</b><div class="muted">Criado em ${new Date(w.created_at).toLocaleDateString('pt-BR')}</div></div>
      <button class="btn sm" onclick="useWorkspace('${w.id}','${w.name}')">Usar</button>
    </div>`).join('') || '<div class="muted">Nenhum perfil criado.</div>';
  }
  render();
})();

// Workspace selection + redirect
window.useWorkspace = function(id,name){
  localStorage.setItem('sp_active_ws_id', id);
  localStorage.setItem('sp_active_ws_name', name);
  location.href='dashboard.html';
};
