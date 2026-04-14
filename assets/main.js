var LOGO_BLACK='assets/logo-light.png';
  var LOGO_WHITE='assets/logo-dark.png';

  document.addEventListener('DOMContentLoaded',function(){var h=document.getElementById('hero-logo');if(h){h.src=LOGO_WHITE;h.style.opacity='1';}});
  // Cursor
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  setInterval(() => {
    ring.style.left = mx + 'px'; ring.style.top = my + 'px';
  }, 30);
  document.querySelectorAll('a,button,.btn-primary,.btn-ghost,.pill').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.8)');
    el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
  });

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Badge generator ───────────────────────────────────────────────────────
  var LOGO_RATIO = 1.0;
  var S = { bg:'transparent', dark:false, size:'sm', lang:'fr', customSub:'', showTM:true, showSub:true };
  var SIZES = { xs:{w:80,subSz:7,gap:4}, sm:{w:120,subSz:9.5,gap:6}, md:{w:180,subSz:13,gap:8}, lg:{w:260,subSz:18,gap:10} };
  var SUBTITLES = { fr:"co-cr\u00e9\u00e9 avec l'IA", en:"AI co-created" };

  function getDims(size, showSub) {
    var c=SIZES[size], logoW=c.w, logoH=Math.round(c.w*LOGO_RATIO);
    var subSz=c.subSz, subH=showSub?subSz*1.3:0;
    var totalH=logoH+(showSub?c.gap+subH:0), subCY=logoH+c.gap+subH/2;
    return {logoW:logoW,logoH:logoH,subSz:subSz,subH:subH,totalH:totalH,subCY:subCY,gap:c.gap};
  }

  function makeSVG(bgOverride, darkOverride) {
    var bg=(bgOverride!==undefined)?bgOverride:S.bg;
    var dark=(darkOverride!==undefined)?darkOverride:S.dark;
    var logo=dark?LOGO_WHITE:LOGO_BLACK;
    var subtitle=S.customSub||SUBTITLES[S.lang];
    var d=getDims(S.size,S.showSub);
    var bgEl=(bg&&bg!=='transparent')?'<rect width="'+d.logoW+'" height="'+d.totalH+'" fill="'+bg+'"/>':'';
    var tmEl=S.showTM?'<text x="'+(d.logoW*0.74)+'" y="'+(d.logoH*0.055)+'" font-family="DM Sans,sans-serif" font-size="'+(d.logoW*0.065)+'" font-weight="500" fill="'+(dark?'#f0efe9':'#1a1a18')+'" opacity="0.7">\u00ae</text>':'';
    var subEl=S.showSub?'<text x="'+(d.logoW/2)+'" y="'+d.subCY+'" text-anchor="middle" dominant-baseline="central" font-family="DM Sans,sans-serif" font-size="'+d.subSz+'" font-weight="400" fill="'+(dark?'#9a9a94':'#5a5a56')+'" letter-spacing="0.06em">'+subtitle+'</text>':'';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+d.logoW+'" height="'+d.totalH+'" viewBox="0 0 '+d.logoW+' '+d.totalH+'">'+bgEl+'<image href="'+logo+'" x="0" y="0" width="'+d.logoW+'" height="'+d.logoH+'" preserveAspectRatio="xMidYMid meet"/>'+tmEl+subEl+'</svg>';
  }

  function update() {
    var cs=document.getElementById('custom-sub'), tm=document.getElementById('opt-tm'), sub=document.getElementById('opt-sub');
    if(!cs||!tm||!sub) return;
    S.customSub=cs.value.trim(); S.showTM=tm.checked; S.showSub=sub.checked;
    document.getElementById('preview-light-svg').innerHTML=makeSVG('#ffffff',false);
    document.getElementById('preview-dark-svg').innerHTML=makeSVG('#0B0E1A',true);
    document.getElementById('preview-trans-svg').innerHTML=makeSVG('transparent',false);
  }

  function pickBg(btn) {
    document.querySelectorAll('#bg-grid .gen-swatch').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active'); S.bg=btn.dataset.bg; S.dark=btn.dataset.dark==='1'; update();
  }
  function pickSize(btn) {
    document.querySelectorAll('#size-row .gen-size-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active'); S.size=btn.dataset.size; update();
  }
  function pickLang(btn) {
    document.querySelectorAll('#lang-toggle .gen-lang-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active'); S.lang=btn.dataset.lang; update();
  }

  function downloadPNG(bgColor) {
    document.fonts.ready.then(function() {
      var dark=(bgColor==='#0B0E1A');
      var logo=dark?LOGO_WHITE:LOGO_BLACK;
      var d=getDims(S.size,S.showSub);
      var scale=3, canvas=document.createElement('canvas');
      canvas.width=d.logoW*scale; canvas.height=d.totalH*scale;
      var ctx=canvas.getContext('2d'); ctx.scale(scale,scale);
      if(bgColor){ctx.fillStyle=bgColor; ctx.fillRect(0,0,d.logoW,d.totalH);}
      var img=new Image();
      img.onload=function(){
        ctx.drawImage(img,0,0,d.logoW,d.logoH);
        if(S.showTM){
          ctx.font='500 '+(d.logoW*0.065)+"px 'DM Sans',sans-serif";
          ctx.fillStyle=dark?'rgba(240,239,233,0.7)':'rgba(26,26,24,0.7)';
          ctx.textAlign='left'; ctx.textBaseline='top';
          ctx.fillText('\u00ae',d.logoW*0.74,d.logoH*0.055);
        }
        if(S.showSub){
          ctx.font='400 '+SIZES[S.size].subSz+"px 'DM Sans',sans-serif";
          ctx.fillStyle=dark?'#9a9a94':'#5a5a56';
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.letterSpacing='0.06em';
          ctx.fillText(S.customSub||SUBTITLES[S.lang],d.logoW/2,d.subCY);
          ctx.letterSpacing='0';
        }
        var dataURL=canvas.toDataURL('image/png');
        var fname='iam-badge-'+S.size+'-'+(bgColor?bgColor.replace('#',''):'transp')+'.png';
        try{var a=document.createElement('a');a.download=fname;a.href=dataURL;document.body.appendChild(a);a.click();document.body.removeChild(a);}catch(e){}
        showModal(dataURL,fname);
      };
      img.src=logo;
    });
  }

  function showModal(dataURL,fname) {
    var ex=document.getElementById('dl-modal'); if(ex)ex.remove();
    var modal=document.createElement('div'); modal.id='dl-modal';
    var overlay=document.createElement('div'); overlay.id='dl-overlay';
    overlay.onclick=function(){modal.remove();};
    var box=document.createElement('div'); box.id='dl-box';
    var title=document.createElement('p'); title.id='dl-title'; title.textContent='Badge pr\u00eat \u2014 clic droit \u2192 Enregistrer sous';
    var imgEl=document.createElement('img'); imgEl.id='dl-img'; imgEl.src=dataURL; imgEl.alt="Badge IA'm";
    var actions=document.createElement('div'); actions.id='dl-actions';
    var link=document.createElement('a'); link.id='dl-link'; link.href=dataURL; link.download=fname; link.textContent='\u2b07 T\u00e9l\u00e9charger';
    var closeBtn=document.createElement('button'); closeBtn.textContent='Fermer'; closeBtn.onclick=function(){modal.remove();};
    actions.appendChild(link); actions.appendChild(closeBtn);
    box.appendChild(title); box.appendChild(imgEl); box.appendChild(actions);
    modal.appendChild(overlay); modal.appendChild(box); document.body.appendChild(modal);
  }

  function copySVG() {
    navigator.clipboard.writeText(makeSVG(null,false)).then(function(){
      var btn=document.getElementById('svg-btn'); if(!btn)return;
      var orig=btn.innerHTML; btn.innerHTML='Copi\u00e9 \u2713';
      setTimeout(function(){btn.innerHTML=orig;},1800);
    });
  }

  window.addEventListener('load', function(){ if(document.getElementById('preview-light-svg')) update(); });

  // Contact form
  function handleSubmit(e) {
    e.preventDefault();
    var form = document.getElementById('contactForm');
    var name = form.querySelector('input[type=text]').value;
    var email = form.querySelector('input[type=email]').value;
    var msg = form.querySelector('textarea').value;
    window.location.href = 'mailto:my.ai.inside@gmail.com?subject=Badge+IA%27m&body='+encodeURIComponent('Nom: '+name+'\\nEmail: '+email+'\\nMessage: '+msg);
    var s = document.getElementById('form-success');
    if(s){ s.style.display='block'; }
  }