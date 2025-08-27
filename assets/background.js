
const canvas=document.getElementById('bg');const ctx=canvas.getContext('2d');let w,h,pr=window.devicePixelRatio||1;
let points=[];let mouse={x:-1e9,y:-1e9};
function resize(){w=canvas.width=innerWidth*pr;h=canvas.height=innerHeight*pr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';spawn()}
function spawn(){points=[];const count= Math.min(120, Math.floor((innerWidth*innerHeight)/14000));for(let i=0;i<count;i++){points.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4*pr,vy:(Math.random()-.5)*.4*pr,r:(Math.random()*1.8+0.6)*pr})}}
function step(){ctx.clearRect(0,0,w,h);for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(124,214,255,.7)';ctx.fill();}
for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j];const dx=a.x-b.x,dy=a.y-b.y;const d=dx*dx+dy*dy;if(d<22000*pr){const op=Math.max(.02, 1-d/22000/pr);ctx.strokeStyle=`rgba(122,92,255,${.12*op})`;ctx.lineWidth=pr;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}
requestAnimationFrame(step)}
addEventListener('mousemove',e=>{mouse.x=e.clientX*pr;mouse.y=e.clientY*pr})
addEventListener('resize',resize);resize();step();
