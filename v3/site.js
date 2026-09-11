/* One time code fields. Shared by the register, sign in and quick flows.
   Handles the phone cases: the SMS autofill dropping four digits into one box,
   a pasted code, arrow keys, backspace, and verifying itself on the last digit
   so nobody has to hunt for a button with the keyboard up. */
window.otpGroup=function(ids,done){
  var boxes=[];
  ids.forEach(function(id){var el=document.getElementById(id);if(el){boxes.push(el)}});
  if(!boxes.length)return;
  function value(){var v='';boxes.forEach(function(b){v+=b.value});return v}
  function check(){
    if(value().length===boxes.length&&typeof done==='function'){
      boxes[boxes.length-1].blur();
      setTimeout(done,340);
    }
  }
  function fill(text,from){
    var digits=String(text).replace(/[^0-9]/g,'').split(''),i=from;
    while(digits.length&&i<boxes.length){boxes[i].value=digits.shift();i++}
    boxes[Math.min(i,boxes.length-1)].focus();
    check();
  }
  boxes.forEach(function(b,i){
    b.setAttribute('autocomplete','one-time-code');
    b.setAttribute('inputmode','numeric');
    b.addEventListener('focus',function(){setTimeout(function(){b.select()},0)});
    b.addEventListener('input',function(){
      if(b.value.length>1){fill(b.value,i);return}
      b.value=b.value.replace(/[^0-9]/g,'');
      if(b.value&&i<boxes.length-1){boxes[i+1].focus()}
      check();
    });
    b.addEventListener('keydown',function(e){
      if(e.key==='Backspace'&&!b.value&&i>0){boxes[i-1].focus()}
      else if(e.key==='ArrowLeft'&&i>0){boxes[i-1].focus()}
      else if(e.key==='ArrowRight'&&i<boxes.length-1){boxes[i+1].focus()}
    });
    b.addEventListener('paste',function(e){
      e.preventDefault();
      fill(((e.clipboardData||window.clipboardData).getData('text')||''),i);
    });
  });
};

/* Move to a step: bring the card under the header, then put the cursor in its
   first field so the keyboard stays up on a phone. */
window.stepFocus=function(pane,anchor){
  if(anchor){
    var y=anchor.getBoundingClientRect().top+window.pageYOffset-90;
    var box=anchor.closest('.auth__panel');
    if(box&&box.scrollHeight>box.clientHeight){box.scrollTo({top:0,behavior:'smooth'})}
    else{window.scrollTo({top:y<0?0:y,behavior:'smooth'})}
  }
  if(!pane)return;
  var first=pane.querySelector('input:not([type=checkbox]):not([type=hidden])');
  if(first){setTimeout(function(){try{first.focus({preventScroll:true})}catch(e){first.focus()}},80)}
};

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
