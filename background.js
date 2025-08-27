
// fundo discreto animado
(() => {
  const cnv=document.createElement('canvas');cnv.id='bg-canvas';document.body.prepend(cnv);
  Object.assign(cnv.style,{position:'fixed',inset:'0',zIndex:'-1'});
  const ctx=cnv.getContext('2d'); const stars=[];
  const R=()=>Math.random();
  const resize=()=>{cnv.width=innerWidth;cnv.height=innerHeight;};
  addEventListener('resize',resize);resize();
  for(let i=0;i<100;i++){stars.push({x:R()*innerWidth,y:R()*innerHeight,r:R()*1.5+0.3,dx:(R()-.5)*.15,dy:(R()-.5)*.15})}
  function tick(){
    ctx.clearRect(0,0,cnv.width,cnv.height);
    for(const s of stars){
      s.x+=s.dx; s.y+=s.dy;
      if(s.x<0||s.x>cnv.width) s.dx*=-1;
      if(s.y<0||s.y>cnv.height) s.dy*=-1;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba(125,105,255,.35)'; ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
