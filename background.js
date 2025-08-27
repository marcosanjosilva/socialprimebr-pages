(function(){
  const cvs=document.createElement('canvas'); cvs.className='constel'; document.body.appendChild(cvs);
  const ctx=cvs.getContext('2d'); let w=innerWidth,h=innerHeight; cvs.width=w; cvs.height=h;
  let mx=w/2,my=h/2;
  const N=Math.min(140, Math.floor(w*h/12000)); const pts=[];
  function rnd(a,b){return Math.random()*(b-a)+a}
  function reset(){
    w=innerWidth;h=innerHeight; cvs.width=w;cvs.height=h; pts.length=0;
    for(let i=0;i<N;i++){ pts.push({x:rnd(0,w), y:rnd(0,h), vx:rnd(-.2,.2), vy:rnd(-.2,.2)}); }
  }
  reset(); addEventListener('resize', reset); addEventListener('mousemove', e=>{mx=e.clientX; my=e.clientY});
  function step(){
    ctx.clearRect(0,0,w,h);
    for(const p of pts){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
      const d=Math.hypot(p.x-mx,p.y-my); const a=Math.max(0, 1- d/420);
      ctx.fillStyle=`rgba(200,210,255,${.15 + .35*a})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,1.2+1.2*a,0,Math.PI*2); ctx.fill();
    }
    // lines
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j]; const d=Math.hypot(a.x-b.x,a.y-b.y); if(d<120){
          const m=(Math.hypot((a.x+b.x)/2-mx,(a.y+b.y)/2-my)); const op=Math.max(0,.08- d/1500) * Math.max(.2,1-m/600);
          ctx.strokeStyle=`rgba(180,195,255,${op})`; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();
