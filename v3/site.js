(function(){
  var t=document.querySelector('.nav-toggle'),n=document.getElementById('primary-nav');
  if(t){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)})}

  var menus=document.querySelectorAll('.has-menu');
  function shut(except){
    menus.forEach(function(m){
      if(m===except)return;
      m.classList.remove('open');
      m.dataset.pinned='';
      m.querySelector('.nav-btn').setAttribute('aria-expanded','false');
    });
  }
  menus.forEach(function(m){
    var b=m.querySelector('.nav-btn'),wide=window.matchMedia('(min-width:1025px)');
    b.addEventListener('click',function(e){
      e.stopPropagation();
      if(m.dataset.pinned==='1'){
        m.classList.remove('open');
        m.dataset.pinned='';
        b.setAttribute('aria-expanded','false');
        return;
      }
      shut(m);
      m.classList.add('open');
      m.dataset.pinned='1';
      b.setAttribute('aria-expanded','true');
    });
    m.querySelector('.dropdown').addEventListener('click',function(e){e.stopPropagation()});
    m.addEventListener('mouseenter',function(){if(wide.matches){shut(m);m.classList.add('open');b.setAttribute('aria-expanded','true')}});
    m.addEventListener('mouseleave',function(){
      if(!wide.matches||m.dataset.pinned)return;
      m.classList.remove('open');
      b.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('click',function(){shut(null)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){shut(null)}});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  document.querySelectorAll('[data-pillgroup]').forEach(function(g){
    g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false')});
      b.setAttribute('aria-pressed','true');
    })});
  });
})();
