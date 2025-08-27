
// Simple particles + link lines + mouse parallax
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W=canvas.width=innerWidth, H=canvas.height=innerHeight;
const dots = Array.from({length:120}, () => ({
  x: Math.random()*W, y: Math.random()*H,
  vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6,
  r: Math.random()*1.8+0.6
}));
let mx=-999, my=-999;
addEventListener('resize', ()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });
addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
function tick(){
  ctx.clearRect(0,0,W,H);
  for(const p of dots){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(170,160,255,.9)';
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  // link lines
  for(let i=0;i<dots.length;i++){
    for(let j=i+1;j<dots.length;j++){
      const a=dots[i], b=dots[j];
      const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      if(d<120){
        const alpha=(120-d)/120*.25;
        ctx.strokeStyle='rgba(140,120,255,'+alpha+')';
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  // mouse gravity
  for(const p of dots){
    const dx=mx-p.x, dy=my-p.y, d=Math.hypot(dx,dy);
    if(d<140){
      p.vx -= dx*0.0005; p.vy -= dy*0.0005;
    }
  }
  requestAnimationFrame(tick);
}
tick();
