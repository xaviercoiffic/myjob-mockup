(function(){
  var t=document.querySelector('.nav-toggle'),n=document.getElementById('primary-nav');
  if(t){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)})}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  document.querySelectorAll('[data-pillgroup]').forEach(function(g){
    g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false')});
      b.setAttribute('aria-pressed','true');
    })});
  });
})();
