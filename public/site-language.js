(function(){
  const key='rcd-language';
  const initial=localStorage.getItem(key)==='en'?'en':'es';
  const control=document.createElement('div');
  control.className='site-language';
  control.setAttribute('aria-label','Idioma / Language');
  control.innerHTML='<button type="button" data-lang="es">ES</button><span>/</span><button type="button" data-lang="en">EN</button>';
  document.body.appendChild(control);

  function apply(lang){
    document.documentElement.lang=lang;
    localStorage.setItem(key,lang);
    document.querySelectorAll('[data-es][data-en]').forEach(el=>{
      el.innerHTML=el.getAttribute('data-'+lang);
    });
    control.querySelectorAll('button').forEach(button=>{
      const active=button.dataset.lang===lang;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    window.dispatchEvent(new CustomEvent('rcd-language-change',{detail:{lang}}));
  }
  control.addEventListener('click',event=>{
    const button=event.target.closest('button[data-lang]');
    if(button)apply(button.dataset.lang);
  });
  apply(initial);
})();
