function setLang(lang) {
    document.body.className = lang;
    document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('.lang-btn[onclick="setLang(\'' + lang + '\')"]').classList.add('active');
  }