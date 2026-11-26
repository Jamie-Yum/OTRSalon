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
#stg .ag ol{list-style:none;display:grid;grid-template-columns:repeat(var(--n,5),1fr);gap:28px;padding:0;margin:0}
#stg .ag li{border-top:3px solid #C9B37E;padding-top:28px;cursor:pointer}
#stg .ag li b{display:block;font-family:'Inter Tight',sans-serif;font-size:72px;font-weight:300;color:#C9B37E;line-height:1}
#stg .ag li span{display:block;font-size:36px;font-weight:600;margin-top:24px;line-height:1.35}
#stg .ag li.dn{opacity:.35}
#stg .ag li.nx b{color:#E2CD94}
/* 목차 B: 목록형 (Key Question 함께) */
#stg .ag.v-list h2{margin-bottom:36px}
#stg .ag.v-list ol{grid-template-columns:1fr;gap:0}
#stg .ag.v-list li{display:grid;grid-template-columns:130px 560px 1fr;align-items:center;gap:40px;border-top:1px solid rgba(237,230,214,.16);padding:24px 0}
#stg .ag.v-list li:last-child{border-bottom:1px solid rgba(237,230,214,.16)}
#stg .ag.v-list li b{font-size:58px;font-weight:200}
#stg .ag.v-list li span{margin:0;font-size:40px;font-weight:700}
#stg .ag.v-list li em{font-style:normal;font-size:27px;line-height:1.5;color:rgba(237,230,214,.62)}
#stg .ag.v-list li.nx{background:linear-gradient(to right,rgba(201,179,126,.12),transparent 70%)}
/* 목차 C: 카드형 */
#stg .ag.v-cards ol{gap:24px}
#stg .ag.v-cards li{border:0;background:#1E1E1E;border-radius:24px;padding:40px 34px;height:440px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
#stg .ag.v-cards li b{font-size:170px;font-weight:700;color:transparent;-webkit-text-stroke:2px #C9B37E;line-height:.9;letter-spacing:-.03em}
#stg .ag.v-cards li span{font-size:38px;margin:0}
#stg .ag.v-cards li.nx{background:#C9B37E;color:#141414}#stg .ag.v-cards li.nx b{-webkit-text-stroke:2px #141414}
/* 목차 D: 여정형 (선 위의 점) */
#stg .ag.v-path ol{position:relative;gap:0;margin-top:40px}
#stg .ag.v-path ol::before{content:'';position:absolute;left:10%;right:10%;top:150px;height:2px;background:rgba(237,230,214,.2)}
#stg .ag.v-path li{border:0;padding:0;text-align:center;position:relative}
#stg .ag.v-path li b{font-size:84px;font-weight:200}
#stg .ag.v-path li i{display:block;width:30px;height:30px;border-radius:50%;margin:36px auto 0;background:#141414;border:3px solid #C9B37E;position:relative;z-index:1}
#stg .ag.v-path li.dn{opacity:1}#stg .ag.v-path li.dn i{background:#C9B37E}#stg .ag.v-path li.dn span,#stg .ag.v-path li.dn b{opacity:.4}
#stg .ag.v-path li.nx i{width:44px;height:44px;margin-top:29px;box-shadow:0 0 0 12px rgba(201,179,126,.18)}
#stg .ag.v-path li span{font-size:36px;margin-top:40px;padding:0 18px}
/* 목차 E: 큰 숫자 배경형 */
#stg .ag.v-big ol{gap:0}
#stg .ag.v-big li{border:0;border-left:1px solid rgba(237,230,214,.14);padding:170px 30px 0;height:440px;display:flex;flex-direction:column;justify-content:flex-start;position:relative;overflow:hidden}
#stg .ag.v-big li:first-child{border-left:0;padding-left:0}#stg .ag.v-big li.dn{opacity:.4}
#stg .ag.v-big li b{position:absolute;top:0;left:22px;font-size:180px;font-weight:800;color:rgba(201,179,126,.12);line-height:.8;letter-spacing:-.05em}
#stg .ag.v-big li:first-child b{left:-8px}
#stg .ag.v-big li span{font-size:36px;margin:0;position:relative}
#stg .ag.v-big li em{font-style:normal;display:block;font-size:22px;line-height:1.5;color:rgba(237,230,214,.55);margin-top:18px;position:relative}
#stg .ag.v-big li.nx b{color:rgba(201,179,126,.4)}
#stg .cv{justify-content:center}
#stg .cv .no{font-family:'Inter Tight',sans-serif;font-size:220px;font-weight:200;color:#C9B37E;line-height:.85;letter-spacing:-.04em}
#stg .cv h2{font-size:104px;font-weight:700;margin:48px 0 0;letter-spacing:-.02em}
#stg .cv.hk .no{font-size:150px}
#stg .cv.hk h2{font-size:52px;margin-top:28px;color:#C9B37E;font-weight:600}
#stg .cv .kq{margin-top:64px;max-width:1620px}
#stg .cv .kq .eb{font-size:24px}
#stg .cv .kq div:last-child{font-size:88px;font-weight:700;line-height:1.32;margin-top:22px;color:#EDE6D6;letter-spacing:-.02em}
#stg .qa2 .kqs{font-size:30px;font-weight:600;color:#E2CD94;margin-top:18px;line-height:1.45;max-width:1620px}
#stg .qa2 .kqs::before{content:'KEY QUESTION';font-family:'Inter Tight',sans-serif;font-size:.62em;font-weight:600;letter-spacing:.2em;color:#C9B37E;margin-right:18px;vertical-align:.18em}
#stg .cv p{font-size:38px;margin-top:36px;color:rgba(237,230,214,.7);line-height:1.55;max-width:1400px}
#stg .q{justify-content:center}
#stg .q .qn{font-family:'Inter Tight',sans-serif;font-size:34px;color:#C9B37E;letter-spacing:.08em}
#stg .q h2{font-size:84px;font-weight:700;line-height:1.35;margin:36px 0 0;letter-spacing:-.015em;max-width:1560px}
#stg .q h2{display:flex;gap:.35em}#stg .q h2::before{content:'Q.';flex:none;color:#C9B37E;font-family:'Inter Tight',sans-serif;font-weight:300}
#stg .q .raw{list-style:none;padding:0;margin:56px 0 0;display:grid;gap:18px;max-width:1560px;font-size:30px}
#stg .q.has-raw h2{font-size:68px}
#stg .raw li{position:relative;padding-left:44px;line-height:1.55;color:rgba(237,230,214,.62)}
#stg .raw li::before{content:'“';position:absolute;left:0;top:-.12em;font-family:'Inter Tight',sans-serif;font-size:1.9em;color:#C9B37E;opacity:.7;line-height:1}
#stg .qa2{padding-top:150px;padding-bottom:110px}
#stg .qa2 .hd{display:flex;align-items:baseline;gap:28px}
#stg .qa2 .hd b{font-family:'Inter Tight',sans-serif;font-size:64px;font-weight:200;color:#C9B37E;line-height:1}
#stg .qa2 .hd h2{font-size:52px;font-weight:700;margin:0}
#stg .qa2 .cols{display:grid;grid-template-columns:1.15fr 1fr;gap:80px;margin-top:40px;font-size:1px}
#stg .qa2 .cols.solo{grid-template-columns:1fr}
#stg .qa2 .sh{font-family:'Inter Tight',sans-serif;font-size:22px;letter-spacing:.2em;color:#C9B37E;margin-bottom:22px;text-transform:uppercase}
#stg .qa2 ol.core{list-style:none;padding:0;margin:0;display:grid;gap:26px;counter-reset:q}
#stg .qa2 ol.core li{counter-increment:q;font-size:38px;font-weight:600;line-height:1.42;padding-left:64px;position:relative}
#stg .qa2 ol.core li::before{content:'Q' counter(q);position:absolute;left:0;top:.18em;font-family:'Inter Tight',sans-serif;font-size:.62em;font-weight:400;color:#C9B37E}
#stg .qa2 .raw{list-style:none;padding:0;margin:0;display:grid;gap:18px;font-size:24px}
#stg .qa2 .rc{border-left:1px solid rgba(237,230,214,.14);padding-left:56px}
#stg .qa2 .cols.rawonly .raw{font-size:34px;gap:26px}
#stg .ag li em{display:none;font-style:normal}
#stg .ag.v-list li em,#stg .ag.v-big li em{display:block}
/* ── 번호 없음 ── 빈자리를 Key Question·골드 선으로 채움 */
#stg .nonum .ag li b,#stg .nonum .cv .no,#stg .nonum .qa2 .hd b,#stg .nonum .nm{display:none}
#stg .nonum .ag li em{display:block;font-size:24px;line-height:1.55;color:rgba(237,230,214,.58);margin-top:22px}
#stg .nonum .ag li.nx em{color:rgba(237,230,214,.85)}
/* A 기본 */
#stg .nonum .ag.v-cols li{padding-top:40px;border-top-width:4px}
#stg .nonum .ag.v-cols li span{font-size:40px;margin-top:0}
#stg .nonum .ag.v-cols li.nx{border-top-color:#E2CD94}
#stg .nonum .ag.v-cols li.nx span{color:#E2CD94}
/* B 목록형 */
#stg .nonum .ag.v-list li{grid-template-columns:24px 600px 1fr;padding:24px 0}
#stg .nonum .ag.v-list li::before{content:'';width:10px;height:10px;border-radius:50%;background:rgba(201,179,126,.5);justify-self:center}
#stg .nonum .ag.v-list li.nx::before{background:#E2CD94;box-shadow:0 0 0 8px rgba(201,179,126,.18)}
#stg .nonum .ag.v-list li span{font-size:44px}
#stg .nonum .ag.v-list li em{margin:0;font-size:27px}
/* C 카드형 */
#stg .nonum .ag.v-cards li{height:470px;justify-content:flex-start;padding-top:46px}
#stg .nonum .ag.v-cards li::before{content:'';display:block;width:48px;height:4px;background:#C9B37E;margin-bottom:34px}
#stg .nonum .ag.v-cards li.nx::before{background:#141414}
#stg .nonum .ag.v-cards li span{font-size:40px;line-height:1.3}
#stg .nonum .ag.v-cards li em{margin-top:auto;font-size:23px}
#stg .nonum .ag.v-cards li.nx em{color:rgba(20,20,20,.72)}
/* D 여정형 */
#stg .nonum .ag.v-path ol::before{top:21px}
#stg .nonum .ag.v-path li i{margin-top:6px}
#stg .nonum .ag.v-path li.nx i{margin-top:0}
#stg .nonum .ag.v-path li span{font-size:38px;margin-top:46px}
#stg .nonum .ag.v-path li em{padding:0 22px;font-size:23px}
#stg .nonum .ag.v-path li.dn em{opacity:.4}
/* E 큰 숫자형 → 세로 선 + 큰 제목 */
#stg .nonum .ag.v-big li{height:520px;padding-top:0;justify-content:flex-start}
#stg .nonum .ag.v-big li span{font-size:42px;line-height:1.28;padding-top:30px;border-top:4px solid #C9B37E;display:block;width:100%}
#stg .nonum .ag.v-big li:not(:first-child){padding-left:34px}
#stg .nonum .ag.v-big li.nx span{color:#E2CD94;border-top-color:#E2CD94}
/* 표지 */
#stg .nonum .cv h2::before,#stg .nonum .qa2 .hd h2::before{content:'';display:block;width:90px;height:5px;background:#C9B37E;margin-bottom:44px}
#stg .nonum .cv h2{font-size:120px;margin-top:0}
#stg .nonum .cv.hk h2{font-size:60px;margin-top:0}
#stg .nonum .cv.hk .kq{margin-top:72px}
#stg .nonum .cv.hk .kq div:last-child{font-size:96px}
/* 질문 장 머리 */
#stg .nonum .qa2 .hd h2::before{width:60px;height:4px;margin-bottom:26px}
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
/*P*/@media print{
  @page{size:1920px 1080px;margin:0}
  body.stg-printing>*:not(#stg){display:none!important}
  body.stg-printing{background:#141414!important;margin:0!important;padding:0!important;display:block!important;min-height:0!important}
  #stg.print{position:static!important;display:block!important;background:none}
  #stg.print .x,#stg.print .hint{display:none!important}
}
/*/P*/
#stg.print{cursor:default}
#stg.print .stage{position:static;transform:none!important;width:1920px;height:auto;background:none}
#stg.print .pp{position:relative;width:1920px;height:1080px;overflow:hidden;background:#141414;page-break-after:always;break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}
#stg.print .pp .sl{opacity:1;transition:none}
#stg.print .pp .kw li{opacity:1;transform:none}
/* 현장 질의응답 */
#stg .lv{flex-direction:row;gap:96px;padding-top:180px}
#stg .lv .lv-l{width:560px;flex:none;display:flex;flex-direction:column}
#stg .lv h2{font-size:88px;font-weight:700;line-height:1.2;margin:20px 0 26px}
#stg .lv .lv-l p{font-size:30px;line-height:1.6;color:rgba(237,230,214,.7)}
#stg .lv .lv-qr{margin-top:46px;width:320px;height:320px;background:#fff;border-radius:18px;padding:22px}
#stg .lv .lv-qr svg{width:100%;height:100%;display:block}
#stg .lv .lv-u{margin-top:18px;font-family:'Inter Tight',sans-serif;font-size:22px;color:rgba(237,230,214,.5)}
#stg .lv .lv-r{flex:1;display:flex;flex-direction:column;min-width:0}
#stg .lv .lv-h{display:flex;justify-content:space-between;align-items:center;font-size:24px;color:rgba(237,230,214,.55);border-bottom:1px solid rgba(237,230,214,.18);padding-bottom:22px}
#stg .lv-st{display:flex;align-items:center;gap:14px}
#stg .lv-st::before{content:'';width:12px;height:12px;border-radius:50%;background:rgba(237,230,214,.35)}
#stg .lv-st.on{color:#E2CD94}#stg .lv-st.on::before{background:#C9B37E;animation:lvp 1.6s infinite}
@keyframes lvp{0%{box-shadow:0 0 0 0 rgba(201,179,126,.6)}100%{box-shadow:0 0 0 14px rgba(201,179,126,0)}}
#stg .lv-qs{list-style:none;margin:0;padding:0;overflow:hidden;flex:1}
#stg .lv-qs li{padding:26px 150px 26px 0;border-bottom:1px solid rgba(237,230,214,.1);font-size:32px;line-height:1.5;cursor:pointer;position:relative}
#stg .lv-qs li p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
#stg .lv-qs li:hover p{color:#E2CD94}
#stg .lv-qs li.new{animation:lvn 1.4s ease}
@keyframes lvn{from{background:rgba(201,179,126,.28);transform:translateX(24px);opacity:0}to{background:transparent;transform:none;opacity:1}}
#stg .lv-qs li.empty{color:rgba(237,230,214,.35);cursor:default;border:0;padding-top:64px}
#stg .lv-qs li button{position:absolute;right:0;top:50%;transform:translateY(-50%);display:none;background:#141414;border:1px solid rgba(237,230,214,.3);color:#EDE6D6;border-radius:999px;padding:8px 20px;font:inherit;font-size:18px;cursor:pointer}
#stg.mv .lv-qs li:hover button{display:block}
#stg .lv-spot{position:absolute;inset:0;background:rgba(11,11,11,.97);display:flex;flex-direction:column;justify-content:center;padding:150px 220px;z-index:5;cursor:pointer}
#stg .lv-spot .eb{margin-bottom:40px}
#stg .lv-spot div{font-size:64px;font-weight:700;line-height:1.45}
#stg .ag li.lvi b{color:#E2CD94}
#stg .hint{position:fixed;right:20px;bottom:16px;z-index:10000;font:13px/1.5 'Pretendard',sans-serif;color:#888;background:rgba(0,0,0,.6);padding:8px 12px;border-radius:8px;opacity:0;transition:opacity .3s;pointer-events:none}
#stg.mv .hint{opacity:1}
#stg .x{position:fixed;right:16px;top:14px;z-index:10001;width:44px;height:44px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#EDE6D6;font-size:20px;cursor:pointer;opacity:0;transition:opacity .3s}
#stg.mv .x{opacity:1}
`;
let root,stage,S=[],i=0,step=0,meta={},hideT,loopT,liveT,opt={};
let cssOn=0;function ensureCss(){if(cssOn)return;cssOn=1;const st=document.createElement('style');st.textContent=css+css.replace(/\/\*P\*\/[\s\S]*?\/\*\/P\*\//,'').replace(/#stg/g,'.stgt')+'.stgt{position:relative!important;inset:auto!important;z-index:auto!important;display:block!important;cursor:default!important;overflow:hidden;background:#141414}.stgt .stage{left:0!important;top:0!important;transform-origin:0 0}';document.head.appendChild(st);}
function ensure(){if(root)return;ensureCss();
  root=document.createElement('div');root.id='stg';root.innerHTML='<div class="stage"></div><button class="x" title="닫기 (Esc)">✕</button><div class="hint">→ 다음 · ← 이전 · M 목차 · 1~9 주제 이동 · F 전체 화면 · Esc 닫기</div>';document.body.appendChild(root);stage=root.querySelector('.stage');
  addEventListener('resize',fit);
  document.addEventListener('keydown',key);
  root.addEventListener('click',e=>{if(e.target.closest('.x')){close();return;}
    const hd=e.target.closest('[data-hide]');if(hd){const pv=opt.live;if(pv&&pv.hide)pv.hide(hd.dataset.hide).then(()=>hd.closest('li').remove()).catch(er=>alert('실패: '+er.message));return;}
    const sp=e.target.closest('.lv-spot');if(sp){sp.remove();return;}
    const lq=e.target.closest('.lv-qs li[data-id]');if(lq){spot(lq.querySelector('p').textContent);return;}const a=e.target.closest('[data-go]');if(a){go(+a.dataset.go);return;}if(e.clientX<innerWidth*.25)prev();else next();});
  const show=()=>{root.classList.add('mv');clearTimeout(hideT);hideT=setTimeout(()=>root.classList.remove('mv'),2500);};root.addEventListener('mousemove',show);root.addEventListener('touchstart',show,{passive:true});}
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`translate(${-960*s}px,${-540*s}px) scale(${s})`;}
const e=t=>(t==null?'':String(t)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WM='OFF <span class="the">THE</span> RECORD SALON';
function top(){return `<div class="top"><span class="wm">${WM}</span><span>${e(meta.label||'')}</span></div>`;}
const R={
  title:s=>`<div class="sl ttl">${top()}<div class="eb">${e(s.eyebrow)}</div><h1>${s.title}</h1>${s.sub?`<p>${s.sub}</p>`:''}</div>`,
  agenda:s=>`<div class="sl ag v-${s.v||'cols'}">${top()}<div class="eb">${e(s.eyebrow||'Topics')}</div><h2>${e(s.title||'오늘의 다섯 가지 주제')}</h2><ol style="--n:${s.cats.length}">${s.cats.map((c,k)=>`<li data-go="${c.at}" class="${s.cur!=null&&k<s.cur?'dn':''}${s.cur!=null&&k===s.cur?' nx':''}${c.live?' lvi':''}"><b>${String(k+1).padStart(2,'0')}</b>${s.v==='path'?'<i></i>':''}<span>${e(c.title)}</span>${c.key?`<em>${e(c.key)}</em>`:''}</li>`).join('')}</ol></div>`,
  cover:s=>`<div class="sl cv${s.key?' hk':''}" data-fit>${top()}<div class="no">${String(s.n).padStart(2,'0')}</div><h2>${e(s.title)}</h2>${s.key?`<div class="kq"><div class="eb">Key Question</div><div>${e(s.key)}</div></div>`:s.desc?`<p>${e(s.desc)}</p>`:''}</div>`,
  q:s=>`<div class="sl q${(s.raw||[]).length?' has-raw':''}" data-fit>${top()}<div class="qn"><span class="nm">${String(s.n).padStart(2,'0')} · </span>${e(s.cat)} &nbsp;—&nbsp; ${s.qi} / ${s.qn}</div><h2><span>${e(s.text)}</span></h2>${(s.raw||[]).length?`<ul class="raw">${s.raw.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:''}</div>`,
  qall:s=>`<div class="sl qa2" data-fit>${top()}<div class="hd"><b>${String(s.n).padStart(2,'0')}</b><h2>${e(s.cat)}</h2></div>${s.key?`<div class="kqs">${e(s.key)}</div>`:''}<div class="cols ${s.raw.length&&s.qs.length?'':'solo'}${s.qs.length?'':' rawonly'}">${s.qs.length?`<div><div class="sh">Questions</div><ol class="core">${s.qs.map(x=>`<li>${e(x)}</li>`).join('')}</ol></div>`:''}${s.raw.length?`<div class="${s.qs.length?'rc':''}"><div class="sh">참가자 여러분이 보내주신 질문</div><ul class="raw">${s.raw.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`:''}</div></div>`,
  kw:s=>`<div class="sl kw">${top()}<div class="eb"><span class="nm">${String(s.n).padStart(2,'0')} · </span>Keywords</div><h2>${e(s.cat)}</h2><ul class="${s.items.length>5?'many':''}">${s.items.map(x=>{const [a,b]=String(x).split('|');return `<li>${e(a.trim())}${b?`<small>${e(b.trim())}</small>`:''}</li>`}).join('')}</ul></div>`,
  hero:s=>`<div class="sl hero">${top()}${s.photo?`<div class="ph" style="background-image:url('${e(s.photo)}')"></div>`:''}<div class="eb">${e(s.eyebrow||'')}</div><div class="wmb" style="margin-top:28px">OFF <span class="the">THE</span><br>RECORD SALON</div><div class="ss">${e(s.ss||'')}</div>${s.name?`<div class="who"><b>${e(s.name)}</b><span>${e(s.role||'')}</span></div>`:''}</div>`,
  brand:s=>`<div class="sl brand"><div class="bw">OFF <span class="the">THE</span> RECORD SALON</div><div class="ln"></div><div class="ss">${e(s.ss||'')}</div>${s.wh?`<div class="wh">${e(s.wh)}</div>`:''}</div>`,
  tt:s=>`<div class="sl tt">${top()}<div class="eb">Timetable</div><h2>${e(s.title||'오늘의 진행 순서')}</h2><ol class="${s.rows.length>8?'dense':''}">${s.rows.map(r=>`<li><span>${e(r.t||'·')}</span><b>${e(r.title)}${r.note?`<small>${e(r.note)}</small>`:''}</b></li>`).join('')}</ol></div>`,
  pr:s=>`<div class="sl pr">${top()}<div class="eb">${e(s.eyebrow||'')}</div><h2>${s.title}</h2>${s.sub?`<p>${s.sub}</p>`:''}</div>`,
  nt:s=>`<div class="sl nt">${top()}<div class="eb">${e(s.eyebrow||'Notice')}</div><h2>${e(s.title)}</h2><ul>${s.items.map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>`,
  pdf:s=>`<div class="sl pdf"></div>`,
  live:s=>`<div class="sl lv">${top()}<div class="lv-l"><div class="eb">Open Q&amp;A</div><h2>현장 질의응답</h2><p>휴대폰 카메라로 QR을 찍어<br>궁금한 것을 자유롭게 남겨 주세요.<br>이름 없이 보내집니다.</p><div class="lv-qr"></div><div class="lv-u"></div></div><div class="lv-r"><div class="lv-h"><span class="lv-st">질문 받기 전</span><span class="lv-n"></span></div><ul class="lv-qs"><li class="empty">첫 질문을 기다리고 있습니다</li></ul></div></div>`
};
function steps(s){return s.t==='kw'?s.items.length:0;}
function draw(){const s=S[i];stage.innerHTML=R[s.t](s)+`<div class="bar" style="width:${(i+1)/S.length*100}%"></div>`+(s.t==='pdf'?'':`<div class="pg">${i===S.length-1&&opt.nextLabel?`→ ${e(opt.nextLabel)} &nbsp;·&nbsp; `:''}${i+1} / ${S.length}</div>`);
  clearInterval(liveT);const sl=stage.querySelector('.sl');if(s.t==='pdf')s.render(sl);if(s.t==='live')liveRun(sl,opt.live);
  if(sl.hasAttribute('data-fit'))fitText(sl);
  requestAnimationFrame(()=>{sl.classList.add('on');paint();});}
function fitText(sl){const els=[...sl.querySelectorAll('h2,li,.raw,.kq div:last-child')];const base=els.map(x=>parseFloat(getComputedStyle(x).fontSize));
  for(let f=1;f>.5&&sl.scrollHeight>sl.clientHeight+2;f-=.05)els.forEach((x,k)=>{if(!x.classList.contains('raw'))x.style.fontSize=base[k]*f+'px';});}
function paint(){stage.querySelectorAll('.kw li').forEach((li,k)=>li.classList.toggle('on',k<step));}
function next(){const s=S[i];if(step<steps(s)){step++;paint();return;}if(i<S.length-1){i++;step=0;draw();}else if(opt.next){clearInterval(loopT);opt.next();}}
function prev(){if(step>0&&S[i].t==='kw'){step--;paint();return;}if(i>0){i--;step=steps(S[i]);draw();}else if(opt.prev){clearInterval(loopT);opt.prev();}}
function go(n){if(n<0||n>=S.length)return;i=n;step=0;draw();}
function key(ev){if(!root||!root.classList.contains('on'))return;const k=ev.key;
  if(['ArrowRight','ArrowDown',' ','PageDown','Enter'].includes(k)){ev.preventDefault();next();}
  else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(k)){ev.preventDefault();prev();}
  else if(k==='Escape'){const sp=stage.querySelector('.lv-spot');sp?sp.remove():close();}
  else if(k==='f'||k==='F'){document.fullscreenElement?document.exitFullscreen():root.requestFullscreen().catch(()=>{});}
  else if(k==='m'||k==='M'||k==='Home'){const a=S.findIndex(s=>s.t==='agenda');if(a>=0)go(a);}
  else if(/^[1-9]$/.test(k)){const c=S.findIndex(s=>s.t==='cover'&&s.n===+k);if(c>=0)go(c);}}
function close(){clearInterval(loopT);clearInterval(liveT);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});root.classList.remove('on');stage.innerHTML='';}
/* 현장 질의응답: pv = {get()→{url,open,qs:[{id,body,hidden}]}, start()?, hide(id)?} */
const QRJS='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
function qrLib(){return window.qrcode?Promise.resolve(window.qrcode):new Promise((ok,no)=>{const sc=document.createElement('script');sc.src=QRJS;sc.onload=()=>ok(window.qrcode);sc.onerror=()=>no(new Error('QR'));document.head.appendChild(sc);});}
async function qrSvg(t){try{const q=(await qrLib())(0,'M');q.addData(t);q.make();return q.createSvgTag({cellSize:8,margin:0,scalable:true});}catch(er){return '';}}
function liveList(sl,d,pv){const qs=(d.qs||[]).filter(x=>!x.hidden),box=sl.querySelector('.lv-qs'),seen=new Set([...box.querySelectorAll('li[data-id]')].map(x=>x.dataset.id)),first=!box.dataset.ok;box.dataset.ok=1;
  box.innerHTML=qs.length?qs.slice(0,8).map(x=>`<li data-id="${e(x.id)}" class="${!first&&!seen.has(x.id)?'new':''}"><p>${e(x.body)}</p>${pv.hide?`<button data-hide="${e(x.id)}">숨기기</button>`:''}</li>`).join(''):'<li class="empty">첫 질문을 기다리고 있습니다</li>';
  sl.querySelector('.lv-n').textContent=qs.length?`질문 ${qs.length}개`:'';const st=sl.querySelector('.lv-st');st.className='lv-st'+(d.open?' on':'');st.textContent=d.open?'질문 받는 중':'질문 받기 전';}
async function liveRun(sl,pv,once){if(!pv)return;let d;
  try{if(!once&&pv.start)await pv.start();d=await pv.get();}catch(er){sl.querySelector('.lv-qs').innerHTML=`<li class="empty">질문을 불러오지 못했습니다 (${e(er.message)})</li>`;return;}
  if(d.url){sl.querySelector('.lv-qr').innerHTML=await qrSvg(d.url);sl.querySelector('.lv-u').textContent=d.url.replace(/^https?:\/\//,'');}
  liveList(sl,d,pv);if(once)return;
  liveT=setInterval(async()=>{if(!sl.isConnected)return clearInterval(liveT);try{liveList(sl,await pv.get(),pv);}catch(er){}},4000);}
function spot(t){const d=document.createElement('div');d.className='lv-spot';d.innerHTML=`<div class="eb">Question</div><div>${e(t)}</div>`;stage.querySelector('.sl').appendChild(d);}
/* 질문 덱: data = {mode:'all'|'one', cats:[{title,desc,qs:[],kw:[]}]} · qs 중 '↳'로 시작하는 줄 = 위 질문의 참가자 원래 질문 */
const RAW=/^\s*(↳|>)\s*/;
function parseQs(lines){const out=[];(lines||[]).filter(Boolean).forEach(l=>{if(RAW.test(l)){if(out.length)out[out.length-1].raw.push(l.replace(RAW,''));}else out.push({q:l.trim(),raw:[]});});return out;}
function uniqRaw(list){const key=t=>t.replace(/[^0-9A-Za-z가-힣]/g,'').slice(0,10),m=new Map();
  list.forEach(t=>{const k=key(t),c=t.replace(/\s*\(…\)\s*/g,' … ').trim();if(!m.has(k)||c.length>m.get(k).length)m.set(k,c);});return [...m.values()];}
function qaSlides(d,m){const L=[],cats=(d.cats||[]).filter(c=>c.title);
  L.push({t:'title',eyebrow:'Q&A Session',title:`질문에서 시작하는<br><span class="gold">대화</span>`,sub:`참가자 여러분이 미리 보내주신 질문을<br>다섯 가지 주제로 묶었습니다.`});
  const ag={t:'agenda',v:d.agenda||'cols',cats:cats.map(c=>({title:c.title,key:d.showKey!==false?c.key:''}))};L.push(ag);
  cats.forEach((c,k)=>{ag.cats[k].at=L.length;const n=k+1;
    const key=d.showKey!==false?c.key:'';L.push({t:'cover',n,title:c.title,desc:c.desc,key});
    const qs=parseQs(c.qs),showQ=d.showCore!==false,showR=d.showRaw!==false;
    if(d.mode==='one')qs.forEach((x,j)=>L.push({t:'q',n,cat:c.title,qi:j+1,qn:qs.length,text:x.q,raw:showR?uniqRaw(x.raw):[]}));
    else{const core=showQ?qs.map(x=>x.q):[],raw=showR?uniqRaw(qs.flatMap(x=>x.raw)):[];if(core.length||raw.length)L.push({t:'qall',n,cat:c.title,key,qs:core,raw});}
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
function pageSlide(doc,n){return {t:'pdf',render(sl){return doc.getPage(n).then(pg=>{const v0=pg.getViewport({scale:1}),sc=Math.min(1920/v0.width,1080/v0.height)*1.5,v=pg.getViewport({scale:sc});
  const c=document.createElement('canvas');c.width=v.width;c.height=v.height;c.style.width=v.width/1.5+'px';c.style.height=v.height/1.5+'px';sl.appendChild(c);return pg.render({canvasContext:c.getContext('2d'),viewport:v}).promise;});}};}
function talkSlides(m,doc){const sp=m.speaker||{},L=[];
  L.push({t:'hero',eyebrow:'Part 1 · Talk',ss:`Season 1 · Session 0${m.n}`,name:sp.name,role:sp.role,photo:sp.photo});
  if(doc)for(let k=1;k<=doc.numPages;k++)L.push(pageSlide(doc,k));
  L.push({t:'pr',eyebrow:'Next · Q&A',title:`이제, 여러분의 질문으로<br><span class="gold">대화를 이어갑니다</span>`,sub:'미리 보내주신 질문을 다섯 가지 주제로 묶어 연사께 여쭙니다.'});
  return L;}
async function printParts(parts,title){ensure();clearInterval(loopT);
  if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});
  root.classList.add('on','print');stage.innerHTML='';stage.style.transform='none';
  const jobs=[];clearInterval(liveT);
  for(const p of parts){const keep=meta;meta=p.meta||{};
    for(const sl of p.slides){const pp=document.createElement('div');pp.className='pp'+(p.nonum?' nonum':'');pp.innerHTML=R[sl.t](sl);stage.appendChild(pp);
      const el=pp.querySelector('.sl');el.classList.add('on');if(el.hasAttribute('data-fit'))fitText(el);if(sl.t==='pdf')jobs.push(sl.render(el));if(sl.t==='live')jobs.push(liveRun(el,p.live,1));}
    meta=keep;}
  await Promise.all(jobs);await (document.fonts?document.fonts.ready:Promise.resolve());
  await Promise.all([...stage.querySelectorAll('img')].map(im=>im.complete?0:new Promise(r=>{im.onload=im.onerror=r;})));
  const t0=document.title;document.title=title||t0;document.body.classList.add('stg-printing');
  const done=()=>{document.body.classList.remove('stg-printing');document.title=t0;root.classList.remove('on','print');stage.innerHTML='';fit();removeEventListener('afterprint',done);};
  addEventListener('afterprint',done);setTimeout(()=>print(),300);}
/* 미리보기 그림: 장 하나를 w px 폭으로 축소해 HTML로 돌려줌 */
function thumb(sl,m,o,w){ensureCss();const k=meta;meta=m||{};const h=R[sl.t](sl).replace('class="sl ','class="sl on ');meta=k;const sc=(w||240)/1920;
  return `<div class="stgt" style="width:${1920*sc}px;height:${1080*sc}px"><div class="stage${o&&o.nonum?' nonum':''}" style="transform:scale(${sc})">${h}</div></div>`;}
window.Stage={
  thumb,
  slides:{live:()=>[{t:'live'}],welcome:m=>welcomeSlides(m),farewell:m=>farewellSlides(m),qa:(d,m)=>qaSlides(d,m||{}),talk:(m,doc)=>talkSlides(m,doc)},
  print:printParts,
  async loadPdf(file){let tk=null;try{const lib=await pdfLib();tk=lib.getDocument({data:await file.arrayBuffer()});tk.onPassword=(cb,why)=>{const pw=prompt(why===2?'비밀번호가 맞지 않습니다. 다시 입력해 주세요.':'이 PDF는 비밀번호가 필요합니다.');if(pw==null){tk.cancelled=1;tk.destroy();}else cb(pw);};return await tk.promise;}catch(err){if(tk&&tk.cancelled)return false;alert('PDF를 열지 못했습니다: '+err.message);return false;}},
  async talk(m,file,o){let doc=null;if(file){doc=await this.loadPdf(file);if(doc===false)return;}
    this.open(talkSlides(m,doc),{label:`SESSION 0${m.n}${m.speaker&&m.speaker.name?' · '+m.speaker.name:''}`},o);},
  open(slides,m,o){ensure();clearInterval(loopT);opt=o||{};meta=m||{};S=slides;i=opt.atEnd?slides.length-1:0;step=opt.atEnd?steps(S[i]):0;stage.classList.toggle('nonum',!!opt.nonum);const was=root.classList.contains('on');root.classList.add('on');fit();draw();if(!was&&!document.fullscreenElement)root.requestFullscreen?.().catch(()=>{});
    if(o&&o.loop&&S.length>1)loopT=setInterval(()=>{i=(i+1)%S.length;step=0;draw();},o.loop);},
  welcome(m,o){this.open(welcomeSlides(m),{label:`SESSION 0${m.n}`},o);},
  live(m,o){this.open([{t:'live'}],{label:`SESSION 0${m.n}`},o);},
  farewell(m,o){this.open(farewellSlides(m),{label:`SESSION 0${m.n}`},o);},
  qa(d,m,o){if(!(d.cats||[]).some(c=>c.title))return alert('질문 덱 내용이 없습니다.');this.open(qaSlides(d,m||{}),m,{...(o||{}),nonum:d.showNum===false});},
  /* 덱 잇기: list=[{label,run(o)}], 마지막 장 → 다음 덱, 첫 장 ← 이전 덱 */
  chain(list,k,atEnd){const go=(j,end)=>{const it=list[j];if(!it)return;it.run({atEnd:end,loop:it.loop,nextLabel:list[j+1]&&list[j+1].label,next:list[j+1]?()=>go(j+1,false):null,prev:j>0?()=>go(j-1,true):null});};go(k||0,!!atEnd);}
};
})();
