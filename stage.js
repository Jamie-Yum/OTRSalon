/* 오프더레코드 살롱 진행 장표 — 1920×1080 무대를 화면에 맞춰 띄움 */
(function(){
const css=`
#stg{position:fixed;inset:0;z-index:9999;background:#0B0B0B;display:none;cursor:none}
#stg.on{display:block}#stg.mv{cursor:default}
#stg .stage{position:absolute;left:50%;top:50%;width:1920px;height:1080px;transform-origin:0 0;background:#141414;color:#EDE6D6;overflow:hidden;font-family:'Pretendard',sans-serif;word-break:keep-all}
#stg .sl{position:absolute;inset:0;padding:120px 150px;display:flex;flex-direction:column;opacity:0;transition:opacity .45s ease}
#stg .sl.on{opacity:1}
#stg .top{position:absolute;left:150px;right:150px;top:64px;display:flex;justify-content:space-between;align-items:center;font-family:'Inter Tight',sans-serif;font-size:22px;letter-spacing:.12em;color:rgba(237,230,214,.55)}
#stg .wm{font-family:'Inter Tight',sans-serif;font-weight:800;letter-spacing:.02em;word-spacing:-.18em;color:#EDE6D6}
#stg .wm .the{font-size:.66em}
#stg .gold{color:#C9B37E}
#stg .eb{font-family:'Inter Tight',sans-serif;font-size:26px;font-weight:600;letter-spacing:.22em;color:#C9B37E;text-transform:uppercase}
#stg .bar{position:absolute;left:0;bottom:0;height:6px;background:#C9B37E;transition:width .45s ease}
#stg .pg{position:absolute;right:150px;bottom:48px;font-family:'Inter Tight',sans-serif;font-size:20px;color:rgba(237,230,214,.35);letter-spacing:.1em}
#stg .ttl{justify-content:center}
#stg .ttl h1{font-size:112px;font-weight:700;line-height:1.15;letter-spacing:-.02em;margin:36px 0 0}
#stg .ttl p{font-size:40px;margin-top:40px;color:rgba(237,230,214,.7);line-height:1.5}
#stg .ag{justify-content:center}
#stg .ag h2{font-size:64px;font-weight:700;margin:24px 0 56px}
#stg .ag ol{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:28px;padding:0;margin:0}
#stg .ag li{border-top:3px solid #C9B37E;padding-top:28px;cursor:pointer}
#stg .ag li b{display:block;font-family:'Inter Tight',sans-serif;font-size:72px;font-weight:300;color:#C9B37E;line-height:1}
#stg .ag li span{display:block;font-size:36px;font-weight:600;margin-top:24px;line-height:1.35}
#stg .ag li.dn{opacity:.35}
#stg .cv{justify-content:center}
#stg .cv .no{font-family:'Inter Tight',sans-serif;font-size:300px;font-weight:200;color:#C9B37E;line-height:.85;letter-spacing:-.04em}
#stg .cv h2{font-size:104px;font-weight:700;margin:48px 0 0;letter-spacing:-.02em}
#stg .cv p{font-size:38px;margin-top:36px;color:rgba(237,230,214,.7);line-height:1.55;max-width:1400px}
#stg .q{justify-content:center}
#stg .q .qn{font-family:'Inter Tight',sans-serif;font-size:34px;color:#C9B37E;letter-spacing:.08em}
#stg .q h2{font-size:84px;font-weight:700;line-height:1.35;margin:36px 0 0;letter-spacing:-.015em;max-width:1560px}
#stg .q h2{display:flex;gap:.35em}#stg .q h2::before{content:'Q.';flex:none;color:#C9B37E;font-family:'Inter Tight',sans-serif;font-weight:300}
#stg .kw{justify-content:center}
#stg .kw h2{font-size:56px;font-weight:700;margin:20px 0 56px}
#stg .kw ul{list-style:none;padding:0;margin:0;display:grid;gap:26px}
#stg .kw ul.many{grid-template-columns:1fr 1fr;gap:22px 60px}
#stg .kw li{font-size:58px;font-weight:600;line-height:1.3;padding-left:56px;position:relative;opacity:0;transform:translateY(18px);transition:all .45s ease}
#stg .kw ul.many li{font-size:46px}
#stg .kw li::before{content:'';position:absolute;left:0;top:.62em;width:22px;height:4px;background:#C9B37E}
#stg .kw li.on{opacity:1;transform:none}
#stg .kw li small{display:block;font-size:.55em;font-weight:400;color:rgba(237,230,214,.6);margin-top:6px}
#stg .pdf{padding:0;background:#000;align-items:center;justify-content:center}
#stg .pdf canvas{max-width:100%;max-height:100%;display:block}
#stg .hero{justify-content:center;padding-right:820px}
#stg .hero .wmb{font-family:'Inter Tight',sans-serif;font-weight:800;font-size:92px;line-height:1.02;letter-spacing:.01em;color:#EDE6D6}
#stg .hero .wmb .the{font-size:.66em}
#stg .hero .ss{font-family:'Inter Tight',sans-serif;font-size:30px;letter-spacing:.2em;color:#C9B37E;margin-top:44px;text-transform:uppercase}
#stg .hero .who{margin-top:64px;border-top:1px solid rgba(237,230,214,.2);padding-top:40px}
#stg .hero .who b{display:block;font-size:64px;font-weight:700}
#stg .hero .who span{display:block;font-size:34px;color:rgba(237,230,214,.7);margin-top:10px}
#stg .hero .ph{position:absolute;right:0;top:0;bottom:0;width:760px;background:#1E1E1E center 18%/cover no-repeat}
#stg .hero .ph::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,#141414 0%,rgba(20,20,20,.35) 30%,transparent 55%)}
#stg .brand{justify-content:center;align-items:center;text-align:center;padding:0}
#stg .brand::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(201,179,126,.13),transparent 62%)}
#stg .brand .bw{position:relative;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:148px;line-height:1;letter-spacing:.01em;word-spacing:-.16em;color:#EDE6D6;white-space:nowrap}
#stg .brand .bw .the{font-size:.66em;color:#C9B37E}
#stg .brand .ln{position:relative;width:120px;height:3px;background:#C9B37E;margin:70px auto 56px}
#stg .brand .ss{position:relative;font-family:'Inter Tight',sans-serif;font-size:34px;letter-spacing:.28em;color:#C9B37E;text-transform:uppercase}
#stg .brand .wh{position:relative;font-size:40px;color:rgba(237,230,214,.72);margin-top:28px}
#stg .tt{justify-content:center}
#stg .tt h2{font-size:60px;font-weight:700;margin:20px 0 48px}
#stg .tt ol{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:max-content 1fr;column-gap:56px;row-gap:22px}
#stg .tt li{display:contents}
#stg .tt li span{font-family:'Inter Tight',sans-serif;font-size:38px;color:#C9B37E;font-variant-numeric:tabular-nums;white-space:nowrap}
#stg .tt li b{font-size:40px;font-weight:600;line-height:1.35}
#stg .tt li b small{display:block;font-size:.62em;font-weight:400;color:rgba(237,230,214,.6);margin-top:4px}
#stg .tt ol.dense{row-gap:12px}#stg .tt ol.dense li span{font-size:30px}#stg .tt ol.dense li b{font-size:32px}
#stg .pr{justify-content:center;align-items:flex-start}
#stg .pr h2{font-size:96px;font-weight:700;line-height:1.3;letter-spacing:-.02em;margin:36px 0 0}
#stg .pr p{font-size:38px;color:rgba(237,230,214,.7);margin-top:44px;line-height:1.6}
#stg .nt{justify-content:center}
#stg .nt h2{font-size:64px;font-weight:700;margin:20px 0 56px}
#stg .nt ul{list-style:none;padding:0;margin:0;display:grid;gap:30px}
#stg .nt li{font-size:46px;line-height:1.4;padding-left:56px;position:relative}
#stg .nt li::before{content:'';position:absolute;left:0;top:.66em;width:22px;height:4px;background:#C9B37E}
#stg .hint{position:fixed;right:20px;bottom:16px;z-index:10000;font:13px/1.5 'Pretendard',sans-serif;color:#888;background:rgba(0,0,0,.6);padding:8px 12px;border-radius:8px;opacity:0;transition:opacity .3s;pointer-events:none}
#stg.mv .hint{opacity:1}
#stg .x{position:fixed;right:16px;top:14px;z-index:10001;width:44px;height:44px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#EDE6D6;font-size:20px;cursor:pointer;opacity:0;transition:opacity .3s}
#stg.mv .x{opacity:1}
`;
let root,stage,S=[],i=0,step=0,meta={},hideT,loopT;
function ensure(){if(root)return;const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  root=document.createElement('div');root.id='stg';root.innerHTML='<div class="stage"></div><button class="x" title="닫기 (Esc)">✕</button><div class="hint">→ 다음 · ← 이전 · M 목차 · 1~9 주제 이동 · F 전체 화면 · Esc 닫기</div>';document.body.appendChild(root);stage=root.querySelector('.stage');
  addEventListener('resize',fit);
  document.addEventListener('keydown',key);
  root.addEventListener('click',e=>{if(e.target.closest('.x')){close();return;}const a=e.target.closest('[data-go]');if(a){go(+a.dataset.go);return;}if(e.clientX<innerWidth*.25)prev();else next();});
  const show=()=>{root.classList.add('mv');clearTimeout(hideT);hideT=setTimeout(()=>root.classList.remove('mv'),2500);};root.addEventListener('mousemove',show);root.addEventListener('touchstart',show,{passive:true});}
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`translate(${-960*s}px,${-540*s}px) scale(${s})`;}
const e=t=>(t==null?'':String(t)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WM='OFF <span class="the">THE</span> RECORD SALON';
function top(){return `<div class="top"><span class="wm">${WM}</span><span>${e(meta.label||'')}</span></div>`;}
const R={
  title:s=>`<div class="sl ttl">${top()}<div class="eb">${e(s.eyebrow)}</div><h1>${s.title}</h1>${s.sub?`<p>${s.sub}</p>`:''}</div>`,
  agenda:s=>`<div class="sl ag">${top()}<div class="eb">${e(s.eyebrow||'Topics')}</div><h2>${e(s.title||'오늘의 다섯 가지 주제')}</h2><ol>${s.cats.map((c,k)=>`<li data-go="${c.at}" class="${s.cur!=null&&k<s.cur?'dn':''}"><b>${String(k+1).padStart(2,'0')}</b><span>${e(c.title)}</span></li>`).join('')}</ol></div>`,
  cover:s=>`<div class="sl cv">${top()}<div class="no">${String(s.n).padStart(2,'0')}</div><h2>${e(s.title)}</h2>${s.desc?`<p>${e(s.desc)}</p>`:''}</div>`,
  q:s=>`<div class="sl q">${top()}<div class="qn">${String(s.n).padStart(2,'0')} · ${e(s.cat)} &nbsp;—&nbsp; ${s.qi} / ${s.qn}</div><h2><span>${e(s.text)}</span></h2></div>`,
  kw:s=>`<div class="sl kw">${top()}<div class="eb">${String(s.n).padStart(2,'0')} · Keywords</div><h2>${e(s.cat)}</h2><ul class="${s.items.length>5?'many':''}">${s.items.map(x=>{const [a,b]=String(x).split('|');return `<li>${e(a.trim())}${b?`<small>${e(b.trim())}</small>`:''}</li>`}).join('')}</ul></div>`,
  hero:s=>`<div class="sl hero">${top()}${s.photo?`<div class="ph" style="background-image:url('${e(s.photo)}')"></div>`:''}<div class="eb">${e(s.eyebrow||'')}</div><div class="wmb" style="margin-top:28px">OFF <span class="the">THE</span><br>RECORD SALON</div><div class="ss">${e(s.ss||'')}</div>${s.name?`<div class="who"><b>${e(s.name)}</b><span>${e(s.role||'')}</span></div>`:''}</div>`,
  brand:s=>`<div class="sl brand"><div class="bw">OFF <span class="the">THE</span> RECORD SALON</div><div class="ln"></div><div class="ss">${e(s.ss||'')}</div>${s.wh?`<div class="wh">${e(s.wh)}</div>`:''}</div>`,
  tt:s=>`<div class="sl tt">${top()}<div class="eb">Timetable</div><h2>${e(s.title||'오늘의 진행 순서')}</h2><ol class="${s.rows.length>8?'dense':''}">${s.rows.map(r=>`<li><span>${e(r.t||'·')}</span><b>${e(r.title)}${r.note?`<small>${e(r.note)}</small>`:''}</b></li>`).join('')}</ol></div>`,
  pr:s=>`<div class="sl pr">${top()}<div class="eb">${e(s.eyebrow||'')}</div><h2>${s.title}</h2>${s.sub?`<p>${s.sub}</p>`:''}</div>`,
  nt:s=>`<div class="sl nt">${top()}<div class="eb">${e(s.eyebrow||'Notice')}</div><h2>${e(s.title)}</h2><ul>${s.items.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`,
  pdf:s=>`<div class="sl pdf"></div>`
};
function steps(s){return s.t==='kw'?s.items.length:0;}
function draw(){const s=S[i];stage.innerHTML=R[s.t](s)+`<div class="bar" style="width:${(i+1)/S.length*100}%"></div>`+(s.t==='pdf'?'':`<div class="pg">${i+1} / ${S.length}</div>`);
  const sl=stage.querySelector('.sl');if(s.t==='pdf')s.render(sl);
  requestAnimationFrame(()=>{sl.classList.add('on');paint();});}
function paint(){stage.querySelectorAll('.kw li').forEach((li,k)=>li.classList.toggle('on',k<step));}
function next(){const s=S[i];if(step<steps(s)){step++;paint();return;}if(i<S.length-1){i++;step=0;draw();}}
function prev(){if(step>0&&S[i].t==='kw'){step--;paint();return;}if(i>0){i--;step=steps(S[i]);draw();}}
function go(n){if(n<0||n>=S.length)return;i=n;step=0;draw();}
function key(ev){if(!root||!root.classList.contains('on'))return;const k=ev.key;
  if(['ArrowRight','ArrowDown',' ','PageDown','Enter'].includes(k)){ev.preventDefault();next();}
  else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(k)){ev.preventDefault();prev();}
  else if(k==='Escape'){close();}
  else if(k==='f'||k==='F'){document.fullscreenElement?document.exitFullscreen():root.requestFullscreen().catch(()=>{});}
  else if(k==='m'||k==='M'||k==='Home'){const a=S.findIndex(s=>s.t==='agenda');if(a>=0)go(a);}
  else if(/^[1-9]$/.test(k)){const c=S.findIndex(s=>s.t==='cover'&&s.n===+k);if(c>=0)go(c);}}
function close(){clearInterval(loopT);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});root.classList.remove('on');stage.innerHTML='';}
/* 질문 덱: data = {cats:[{title,desc,qs:[],kw:[]}]} */
function qaSlides(d,m){const L=[],cats=(d.cats||[]).filter(c=>c.title);
  L.push({t:'title',eyebrow:'Q&A Session',title:`질문에서 시작하는<br><span class="gold">대화</span>`,sub:`참가자 여러분이 미리 보내주신 질문을<br>다섯 가지 주제로 묶었습니다.`});
  const ag={t:'agenda',cats:cats.map(c=>({title:c.title}))};L.push(ag);
  cats.forEach((c,k)=>{ag.cats[k].at=L.length;const n=k+1;
    L.push({t:'cover',n,title:c.title,desc:c.desc});
    const qs=(c.qs||[]).filter(Boolean);qs.forEach((q,j)=>L.push({t:'q',n,cat:c.title,qi:j+1,qn:qs.length,text:q}));
    const kw=(c.kw||[]).filter(Boolean);if(kw.length)L.push({t:'kw',n,cat:c.title,items:kw});
    if(k<cats.length-1)L.push({...ag,cur:k+1});});
  L.push({t:'title',eyebrow:'Thank you',title:`오늘의 질문은<br><span class="gold">이 자리에</span> 남겨 둡니다`,sub:m.speaker?`${e(m.speaker)}님, 솔직한 이야기 감사합니다.`:''});
  return L;}
/* 입장·퇴장: m = {n, speaker:{name,role,photo}, date, timetable:[], notes:[], next:{n,name,role,date}} */
const fd=d=>{if(!d)return '';const x=new Date(d+'T00:00:00');return `${x.getFullYear()}. ${x.getMonth()+1}. ${x.getDate()} (${'일월화수목금토'[x.getDay()]})`;};
function welcomeSlides(m){const sp=m.speaker||{},L=[];
  L.push({t:'brand',ss:`Season 1 · Session 0${m.n}`,wh:[fd(m.date),sp.name?`${sp.name} ${(sp.role||'').split(' ').pop()}`:''].filter(Boolean).join('  ·  ')});
  const nm=t=>(t||'').replace(/\s*\([가-힣]{3}\)/g,'').trim(),tt=(m.timetable||[]).filter(r=>r.pub!==false&&(r.title||'').trim()).map(r=>({t:r.t,title:nm(r.title),note:nm(r.note)}));if(tt.length)L.push({t:'tt',rows:tt});
  L.push({t:'pr',eyebrow:'Off the record',title:`이 자리에서 오간 이야기는<br><span class="gold">이 자리에</span> 남겨 둡니다`,sub:'연사와 참가자 모두 솔직하게 이야기할 수 있도록<br>오늘의 이야기는 외부에 기록하거나 공개하지 않습니다.'});
  const nt=(m.notes||[]).filter(Boolean);if(nt.length)L.push({t:'nt',eyebrow:'Notice',title:'안내',items:nt});
  return L;}
function farewellSlides(m){const sp=m.speaker||{},L=[];
  L.push({t:'title',eyebrow:'Thank you',title:`오늘 함께해 주셔서<br><span class="gold">감사합니다</span>`,sub:sp.name?`${e(sp.name)} ${e((sp.role||'').split(' ').pop())}님께 감사드립니다.`:''});
  const nt=(m.notes||[]).filter(Boolean);if(nt.length)L.push({t:'nt',eyebrow:'Part 2',title:'2부 네트워킹 안내',items:nt});
  const nx=m.next;if(nx&&nx.name)L.push({t:'hero',eyebrow:'Next session',ss:`Session 0${nx.n} · ${fd(nx.date)}`,name:nx.name,role:nx.role,photo:nx.photo});
  return L;}
/* 강연: 인트로 → PDF 페이지 → 아우트로. PDF는 이 컴퓨터에서만 읽고 어디에도 올리지 않음 */
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
function pdfLib(){return window.pdfjsLib?Promise.resolve(window.pdfjsLib):new Promise((ok,no)=>{const sc=document.createElement('script');sc.src=PDFJS+'pdf.min.js';
  sc.onload=()=>{pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js';ok(pdfjsLib);};sc.onerror=()=>no(new Error('PDF 뷰어를 불러오지 못했습니다'));document.head.appendChild(sc);});}
function pageSlide(doc,n){return {t:'pdf',render(sl){doc.getPage(n).then(pg=>{const v0=pg.getViewport({scale:1}),sc=Math.min(1920/v0.width,1080/v0.height)*1.5,v=pg.getViewport({scale:sc});
  const c=document.createElement('canvas');c.width=v.width;c.height=v.height;c.style.width=v.width/1.5+'px';c.style.height=v.height/1.5+'px';sl.appendChild(c);pg.render({canvasContext:c.getContext('2d'),viewport:v});});}};}
function talkSlides(m,doc){const sp=m.speaker||{},L=[];
  L.push({t:'hero',eyebrow:'Part 1 · Talk',ss:`Season 1 · Session 0${m.n}`,name:sp.name,role:sp.role,photo:sp.photo});
  if(doc)for(let k=1;k<=doc.numPages;k++)L.push(pageSlide(doc,k));
  L.push({t:'pr',eyebrow:'Next · Q&A',title:`이제, 여러분의 질문으로<br><span class="gold">대화를 이어갑니다</span>`,sub:'미리 보내주신 질문을 다섯 가지 주제로 묶어 연사께 여쭙니다.'});
  return L;}
window.Stage={
  async talk(m,file){let doc=null,tk=null;if(file){try{const lib=await pdfLib();tk=lib.getDocument({data:await file.arrayBuffer()});tk.onPassword=(cb,why)=>{const pw=prompt(why===2?'비밀번호가 맞지 않습니다. 다시 입력해 주세요.':'이 PDF는 비밀번호가 필요합니다.');if(pw==null){tk.cancelled=1;tk.destroy();}else cb(pw);};doc=await tk.promise;}catch(err){if(tk&&tk.cancelled)return;return alert('PDF를 열지 못했습니다: '+err.message);}}
    this.open(talkSlides(m,doc),{label:`SESSION 0${m.n}${m.speaker&&m.speaker.name?' · '+m.speaker.name:''}`});},
  open(slides,m,o){ensure();clearInterval(loopT);meta=m||{};S=slides;i=0;step=0;root.classList.add('on');fit();draw();root.requestFullscreen?.().catch(()=>{});
    if(o&&o.loop&&S.length>1)loopT=setInterval(()=>{i=(i+1)%S.length;step=0;draw();},o.loop);},
  welcome(m,o){this.open(welcomeSlides(m),{label:`SESSION 0${m.n}`},o);},
  farewell(m,o){this.open(farewellSlides(m),{label:`SESSION 0${m.n}`},o);},
  qa(d,m){if(!(d.cats||[]).some(c=>c.title))return alert('질문 덱 내용이 없습니다.');this.open(qaSlides(d,m||{}),m);}
};
})();
