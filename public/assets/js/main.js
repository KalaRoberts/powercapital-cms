// Power Capital — shared site JS
(function(){
  // Mobile nav toggle + header shadow.
  // Uses delegation / fresh lookups because the live editor can re-render the header.
  document.addEventListener('click', function(e){
    var t = e.target.closest && e.target.closest('.nav-toggle');
    if(!t) return;
    var links = document.querySelector('.nav-links');
    if(links) links.classList.toggle('open');
  });
  function onScroll(){
    var header = document.querySelector('.site-header');
    if(!header) return;
    if(window.scrollY > 8){ header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Current year in footer
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  // Also handles sections re-rendered later (e.g. by the TinaCMS live editor),
  // and shows everything immediately when the page is inside the editor iframe.
  var inEditor = window.self !== window.top;
  var io = (!inEditor && 'IntersectionObserver' in window)
    ? new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, {threshold:0.12})
    : null;
  function setupReveal(root){
    var els = [];
    if(root.matches && root.matches('.reveal:not(.in)')) els.push(root);
    if(root.querySelectorAll) els = els.concat([].slice.call(root.querySelectorAll('.reveal:not(.in)')));
    els.forEach(function(el){
      if(io){ io.observe(el); } else { el.classList.add('in'); }
    });
  }
  setupReveal(document);
  if('MutationObserver' in window){
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(n){ if(n.nodeType === 1) setupReveal(n); });
      });
    }).observe(document.body, {childList:true, subtree:true});
  }

  // Google Analytics events (custom dimensions: page_type, cta_location,
  // cta_text, link_location, form_service). Off inside the Tina editor.
  function track(name, params){
    if(inEditor || typeof window.gtag !== 'function') return;
    params = params || {};
    params.page_type = document.body.getAttribute('data-page-type') || 'other';
    window.gtag('event', name, params);
  }
  function whereIs(el){
    if(el.closest('.site-header')) return 'header';
    if(el.closest('.site-footer')) return 'footer';
    var s = el.closest('section');
    if(!s) return 'page';
    var c = (s.className || '').split(/\s+/).filter(function(x){ return x && x !== 'reveal' && x !== 'in'; })[0];
    return c || 'section';
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    var text = (a.textContent || '').trim().slice(0, 100) || a.getAttribute('aria-label') || '(icon)';
    if(href.indexOf('linkedin.com') !== -1){
      track('linkedin_click', { link_location: whereIs(a), cta_text: text });
    } else if(/^\/contact\/?(#.*)?$/.test(href) || /powercapital\.cloud\/contact\/?$/.test(href)){
      track('contact_cta_click', { cta_location: whereIs(a), cta_text: text });
    }
  });

  // Contact form — Web3Forms submission
  var form = document.getElementById('contact-form');
  if(form){
    var note = document.getElementById('form-result');
    var submitBtn = form.querySelector('button[type="submit"]');
    var btnLabel = submitBtn ? submitBtn.textContent : '';

    function showNote(msg, ok){
      if(!note) return;
      note.style.display = 'block';
      note.style.borderColor = ok ? 'var(--forest-500)' : 'var(--accent)';
      note.style.color = ok ? 'var(--forest-600)' : 'var(--accent-600)';
      note.style.background = ok ? 'var(--bg-mint)' : '#fdf1e7';
      note.innerHTML = (ok
        ? '<i class="fa-solid fa-circle-check"></i> <strong>Message sent!</strong> '
        : '<i class="fa-solid fa-triangle-exclamation"></i> ') + msg;
      // Smooth pop-in: reset then transition opacity + slight rise/scale
      note.style.transition = 'none';
      note.style.opacity = '0';
      note.style.transform = 'translateY(8px) scale(.98)';
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          note.style.transition = 'opacity .32s ease, transform .32s ease';
          note.style.opacity = '1';
          note.style.transform = 'none';
        });
      });
      note.scrollIntoView({behavior:'smooth', block:'center'});
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();

      // Required-field check (Name, Email, Service, Message — Company is optional)
      if(!form.name.value.trim() || !form.email.value.trim() || !form.stage.value.trim() || !form.message.value.trim()){
        showNote('Please complete all required fields — name, email, service, and message.', false);
        return;
      }

      // hCaptcha check — require the challenge to be completed
      var captchaEl = form.querySelector('textarea[name="h-captcha-response"], input[name="h-captcha-response"]');
      var captchaToken = captchaEl ? captchaEl.value.trim() : '';
      if(!captchaToken){
        showNote('Please complete the “I am human” check below before sending.', false);
        return;
      }

      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      var data = Object.fromEntries(new FormData(form).entries());
      // Build a dynamic email subject from the submitted name
      var senderName = (form.name.value || '').trim();
      data.subject = senderName ? ('New Power Capital form submission from ' + senderName) : 'New Power Capital form submission';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Accept':'application/json'},
        body: JSON.stringify(data)
      })
      .then(function(r){ return r.json(); })
      .then(function(res){
        if(res.success){
          track('generate_lead', {
            form_service: (form.querySelector('[name="stage"]') || {}).value || '(none)'
          });
          showNote(form.getAttribute('data-success') || 'Thanks for reaching out — we will get back to you.', true);
          form.reset();
        } else {
          showNote('Something went wrong sending your message. Please email us or connect on LinkedIn instead.', false);
        }
      })
      .catch(function(){
        showNote('Network error — please try again, or reach us on LinkedIn.', false);
      })
      .finally(function(){
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = btnLabel; }
        if(window.hcaptcha && typeof window.hcaptcha.reset === 'function'){ try { window.hcaptcha.reset(); } catch(err){} }
      });
    });
  }
})();
