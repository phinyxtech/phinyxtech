/* ==========================================================
   ELECTRONIC REPAIR ACADEMY — site interactions
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Navbar: scroll state + mobile menu ---------- */
  var navbar = document.getElementById('navbar');
  var menuBtn = document.getElementById('menuBtn');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Hero canvas: resistors, capacitors, chips, PCB traces, tools ---------- */
  var canvas = document.getElementById('heroCanvas');
  var ctx = canvas.getContext('2d');
  var components = [];
  var types = ['resistor', 'capacitor', 'chip', 'trace', 'tool'];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeComponent() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 30 + 15,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.01,
      type: types[Math.floor(Math.random() * types.length)],
      alpha: Math.random() * 0.3 + 0.1
    };
  }

  function drawResistor(c) {
    var w = c.size, h = c.size * 0.4;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w / 2 + 5, 0);
    for (var i = 0; i < 4; i++) {
      var x = -w / 2 + 5 + (i * (w - 10)) / 4;
      ctx.lineTo(x, i % 2 === 0 ? -h / 2 : h / 2);
    }
    ctx.lineTo(w / 2 - 5, 0);
    ctx.lineTo(w / 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-w / 2, 0, 3, 0, Math.PI * 2);
    ctx.arc(w / 2, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCapacitor(c) {
    var w = c.size * 0.6, h = c.size;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(-w / 2, h / 2);
    ctx.moveTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2);
    ctx.moveTo(-w / 2 - 5, -h / 2); ctx.lineTo(-w / 2 - 5, h / 2);
    ctx.moveTo(w / 2 + 5, -h / 2); ctx.lineTo(w / 2 + 5, h / 2);
    ctx.stroke();
  }

  function drawChip(c) {
    var w = c.size, h = c.size * 0.8, i, p;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.beginPath();
    for (i = 0; i < 4; i++) {
      p = -h / 2 + ((i + 1) * h) / 5;
      ctx.moveTo(-w / 2, p); ctx.lineTo(-w / 2 - 5, p);
      ctx.moveTo(w / 2, p); ctx.lineTo(w / 2 + 5, p);
    }
    ctx.stroke();
  }

  function drawTrace(c) {
    var w = c.size * 1.5, i;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w / 6, -c.size * 0.2);
    ctx.lineTo(w / 6, c.size * 0.2);
    ctx.lineTo(w / 2, 0);
    ctx.stroke();
    for (i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-w / 2 + (i * w) / 3, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawTool(c) {
    var w = c.size, h = c.size * 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-w / 3, h / 2);
    ctx.lineTo(w / 3, h / 2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, h / 2 - 5, 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (var n = 0; n < 30; n++) components.push(makeComponent());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // faint grid
    ctx.strokeStyle = 'rgba(100,255,218,0.05)';
    ctx.lineWidth = 1;
    var i;
    for (i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (i = 0; i < canvas.height; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    // components
    for (i = 0; i < components.length; i++) {
      var c = components[i];
      c.x += c.vx; c.y += c.vy; c.rot += c.vr;
      if (c.x < -50) c.x = canvas.width + 50;
      if (c.x > canvas.width + 50) c.x = -50;
      if (c.y < -50) c.y = canvas.height + 50;
      if (c.y > canvas.height + 50) c.y = -50;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.globalAlpha = c.alpha;
      ctx.strokeStyle = '#64ffda';
      ctx.fillStyle = '#64ffda';
      ctx.lineWidth = 1.5;
      if (c.type === 'resistor') drawResistor(c);
      else if (c.type === 'capacitor') drawCapacitor(c);
      else if (c.type === 'chip') drawChip(c);
      else if (c.type === 'trace') drawTrace(c);
      else drawTool(c);
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1800;
    var start = Date.now();
    function tick() {
      var p = Math.min((Date.now() - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    tick();
  }

  var counted = new WeakSet();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !counted.has(entry.target)) {
        counted.add(entry.target);
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count').forEach(function (el) {
    observer.observe(el);
  });

  /* ---------- Auth: login / signup tabs ---------- */
  var mode = 'login';
  var loginTab = document.getElementById('loginTab');
  var signupTab = document.getElementById('signupTab');
  var nameGroup = document.getElementById('nameGroup');
  var courseGroup = document.getElementById('courseGroup');
  var authForm = document.getElementById('authForm');
  var authMessage = document.getElementById('authMessage');
  var authSubmit = document.getElementById('authSubmit');
  var authSwitch = document.getElementById('authSwitch');
  var switchLink = document.getElementById('switchLink');
  var authLogged = document.getElementById('authLogged');
  var loggedText = document.getElementById('loggedText');
  var logoutBtn = document.getElementById('logoutBtn');
  var showBtn = document.getElementById('showBtn');
  var passwordInput = document.getElementById('authPassword');
  var nameInput = document.getElementById('authName');
  var emailInput = document.getElementById('authEmail');

  function setMode(next) {
    mode = next;
    var isLogin = mode === 'login';
    loginTab.classList.toggle('active', isLogin);
    loginTab.setAttribute('aria-selected', isLogin ? 'true' : 'false');
    signupTab.classList.toggle('active', !isLogin);
    signupTab.setAttribute('aria-selected', !isLogin ? 'true' : 'false');
    nameGroup.classList.toggle('hidden', isLogin);
    courseGroup.classList.toggle('hidden', isLogin);
    authSubmit.textContent = isLogin ? 'Log In' : 'Create Account';
    authSwitch.innerHTML = isLogin
      ? 'New to the Academy? '
      : 'Already have an account? ';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'switchLink';
    btn.textContent = isLogin ? 'Sign up free' : 'Log in';
    btn.addEventListener('click', function () {
      setMode(isLogin ? 'signup' : 'login');
    });
    authSwitch.appendChild(btn);
    passwordInput.setAttribute('autocomplete', isLogin ? 'current-password' : 'new-password');
    hideMessage();
  }

  function showMessage(text) {
    authMessage.textContent = text;
    authMessage.classList.remove('hidden');
  }
  function hideMessage() {
    authMessage.classList.add('hidden');
    authMessage.textContent = '';
  }

  loginTab.addEventListener('click', function () { setMode('login'); });
  signupTab.addEventListener('click', function () { setMode('signup'); });
  switchLink.addEventListener('click', function () {
    setMode(mode === 'login' ? 'signup' : 'login');
  });

  showBtn.addEventListener('click', function () {
    var show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    showBtn.textContent = show ? 'Hide' : 'Show';
  });

  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    var password = passwordInput.value;
    var name = nameInput.value.trim();
    if (!email || !password) {
      showMessage('Please fill in email and password.');
      return;
    }
    if (mode === 'signup' && !name) {
      showMessage('Please enter your full name.');
      return;
    }
    loggedText.textContent = mode === 'signup'
      ? 'Welcome to Electronic Repair Academy, ' + name + '! Your account has been created.'
      : 'Welcome back! You are now logged in as ' + email + '.';
    authForm.classList.add('hidden');
    authLogged.classList.remove('hidden');
  });

  logoutBtn.addEventListener('click', function () {
    authForm.reset();
    authForm.classList.remove('hidden');
    authLogged.classList.add('hidden');
    setMode('login');
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
